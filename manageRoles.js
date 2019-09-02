const moment = require('moment');

module.exports = (io, auth) => {

	let sockets = {
		businessSignedIn: {},
		endClientGuest: {},
	}

	let endClientSocketsAllocated = 0;

	const forEachBusinessSocket = task => {
		Object.entries(sockets.businessSignedIn).forEach(([username, sockets]) => {
			sockets.forEach(socket => task(socket));
		});
	}

	const broadcastEndClients = () => {
		const endClients = Object.keys(sockets.endClientGuest);
		forEachBusinessSocket(socket => socket.emit('endClients', endClients));
	}

	const broadcastIsBusinessAvailable = () => {
		Object.entries(sockets.endClientGuest).forEach(([id, socket]) => {
			console.log('EMITTING RESPONSE YEYE');

			//console.log('bIN', sockets.businessSignedIn);

			const isBusinessAvailable = Object.entries(sockets.businessSignedIn).reduce(
				(isBusinessAvailable, [id ,sockets]) => /*console.log('IDDSSSSS', id, sockets) || */isBusinessAvailable || !!sockets.length,
				false
			)

			socket.emit(
				'isBusinessAvailable', 
				isBusinessAvailable,
			)
		})
	}

 	io.on('connection', socket => {

 		let role;

 		let username;
 		let endClientId;

 		const roles = {
			businessNotSignedIn: {
				login: credentials => {

					console.log('CREDIENTIAL', credentials);

					if (!auth.isBusinessLogin(credentials)) {
						socket.emit('login', 'Not business login');
						return;
					}

					console.log('AAAA');
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

					broadcastEndClients();
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
					sockets.businessSignedIn[username] = sockets.businessSignedIn[username].filter(
						businessSignedIn => businessSignedIn !== socket
					);

					broadcastIsBusinessAvailable();
				},
			},

			endClientGuest: {
				connect: () => {
					console.log('THIS?');
					endClientId = endClientSocketsAllocated++;
					sockets.endClientGuest[endClientId] = socket;
					broadcastEndClients();
					broadcastIsBusinessAvailable();
					console.log('END USER CONNECTED');
				},

				message: message => {
					forEachBusinessSocket(
						socket => console.log('emiting message', message) || socket.emit('message', {
							content: message.content,
							at: moment(),
							from: endClientId,
						})
					);
				},

				disconnect: () => {
					delete sockets.endClientGuest[endClientId];
					broadcastEndClients();
				},
			}

		};

 		const changeRole = (newRole, connectParam) => {

 			const exitRole = () => {
				Object.entries(role).forEach(([type, listener]) => {
					socket.removeListener(type, listener);
				});
				if (role.disconnect) role.disconnect();
				role = undefined;
			};

			const enterRole = () => {
				Object.entries(newRole).forEach(([type, listener]) => {
					socket.on(type, listener);
				});
				role = newRole;
				if (newRole.connect) newRole.connect(connectParam);
				
			}

			if (role) exitRole();
			enterRole()
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