module.exports = (io, auth) => {

	let sockets = {
		businessSignedIn: {},
		endClientGuest: {},
	}

	let endClientSocketsAllocated = 0;

	const broadcastEndClients = () => {
		object.entries(sockets.businessSignedIn).forEach(([username, sockets]) => {
			sockets.forEach(socket => {
				socket.emit('endClients', Object.keys(sockets.endClientGuest))
			});
		});
	}

	const broadcastIsBusinessAvailable = () => {
		Object.entries(sockets.endClientGuest).forEach(([id, socket]) => {
			socket.emit(
				'isBusinessAvailable', 
				Object.entries(sockets.businessSignedIn).reduce(
					(isBusinessAvailable, [,sockets]) => isBusinessAvailable || !!sockets.length,
					false
				)
			)
		})
	}

 	io.on('connection', socket => {

 		console.log('CONNECTION');

 		let role;

 		let username;
 		let endClientId;

 		const roles = {
			businessNotSignedIn: {
				login: credentials => {
					if (!auth.isBusinessLogin(credentials)) {
						socket.emit('login', {error: 'Not business login'});
						return;
					}

					changeRole(roles.businessSignedIn, credentials);
					socket.emit('login');
				},
			},

			businessSignedIn: {
				connect: credentials => {
					username = credentials.username;

					sockets.businessSignedIn[username] = [
						...(sockets.businessSignedIn[username] || []),
						socket
					];

					broadcastIsBusinessAvailable();
				},

				message: message => {
					const receiver = sockets.endClientGuest[message.to];
					if (receiver) {
						receiver.emit('message', {
							content: message.content,
							at: moment(),
							from: username,
						});
					}
				},

				disconnect: () => {
					sockets.businessSignedIn = sockets.businessSignedIn.filter(
						businessSignedIn => businessSignedIn !== socket
					);
					broadcastIsBusinessAvailable();
				},
			},

			endClientGuest: {
				connect: () => {
					endClientId = endClientSocketsAllocated++;
					sockets.endClientGuest[endClientId] = socket;
				},

				message: message => {
					const receivers = sockets.businessSignedIn[message.to];
					receivers.forEach(receiver => {
						receiver.emit('message', {
							content: message.content,
							at: moment(),
							from: username,
						});
					});
				},

				disconnect: () => {
					delete sockets.endClientGuest[endClientId];
					broadcastEndClients();
				},
			}

		};

 		const changeRole = (newRole, connectProps) => {

 			const exitRole = () => {
				Object.entries(role).forEach(([type, listener]) => {
					socket.removeListener(type, listener);
				});
				role.disconnect();
				role = undefined;
			};

			const enterRole = newRole => {
				Object.entries(newRole).forEach(([type, listener]) => {
					socket.on(type, listener);
				});
				role = newRole;
				newRole.connect(...connectProps);
				
			}

			if (role) exitRole();
			enterRole(newRole)
		}

		if (auth.isBusinessClient(socket)) {
			changeRole(roles.businessNotSignedIn);
			broadcastIsBusinessAvailable();
			return;
		};

		if (auth.isEndClient(socket)) {
			changeRole(roles.endClientGuest);
			broadcastEndClients();
			return;
		};

		

	});

}