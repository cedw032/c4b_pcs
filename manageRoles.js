const moment = require('moment');

module.exports = (io, auth) => {

	const businessClients = {};
	const endClients = {};

	const sockets = [];
	let socketsAllocated = 0;

	const forEachInGroup = (task, group) => {
		Object.values(group).forEach(socketIds => {
			socketIds.forEach(socketId => task(sockets[socketId]));
		});
	};

	const forEachBusinessSocket = task => {
		console.log('TASK', task, typeof task);
		forEachInGroup(task, businessClients);
	};

	const forEachEndSocket = task => {
		forEachInGroup(task, endClients);
	};

	const broadcastEndClients = () => {
		forEachBusinessSocket(
			socket => socket.emit('endClients', Object.keys(endClients))
		);
	};

	const broadcastIsBusinessAvailable = () => {
		forEachEndSocket(
			socket => socket.emit(
				'isBusinessAvailable', 
				!!Object.keys(businessClients).length,
			)
		);
	};

	const forGroupMemberSockets = (clientId, group, task) => {
		const socketIds = group[clientId];
		socketIds.forEach(socketId => {
			task(sockets[socketId]);
		});
	};

 	io.on('connection', socket => {

 		let role;
 		let clientId;
 		let socketId;

 		const allocateSocket = () => {
 			socketId = socketsAllocated++;
 			sockets[socketId] = socket;
 		};

 		const deallocataeSocket = () => {
 			delete sockets[socketId];
 		};

 		const addToGroup = group => {

 			console.log('ADDING TO GROUP', clientId, socketId);

 			group[clientId] = [
				...(group[clientId] || []),
				socketId
			];
 		};

 		const removeFromGroup = group => {
 			group[clientId] = group[clientId].filter(
 				existing => existing !== socketId
			);

			if (!group[clientId].length) {
				delete group[clientId];
			}
 		};

 		const emitMessage = (socket, message) => {
 			console.log('EMITTING MESSAGE HARD', clientId);
 			socket.emit(
				'message',
				{
					content: message.content,
					at: moment().toISOString(),
					from: clientId,
				}
			)
		};

		const emitBusinessMessage = (socket, message) => {
 			console.log('EMITTING MESSAGE HARD', clientId);
 			socket.emit(
				'message',
				{
					content: message.content,
					at: moment().toISOString(),
					from: clientId,
					isBusiness: true,
				}
			)
		};

 		const roles = {
			businessNotSignedIn: {
				login: credentials => {

					if (!auth.isBusinessLogin(credentials)) {
						socket.emit('login', 'Not business login');
						return;
					}

					clientId = credentials.username;
					changeRole(roles.businessSignedIn);

					socket.emit('login');
				},
			},

			businessSignedIn: {
				connect: credentials => {
					allocateSocket();
					addToGroup(businessClients);

					console.log('BUSINESS CLIENTS', businessClients)

					broadcastEndClients();
					broadcastIsBusinessAvailable();
				},

				message: message => {
					forGroupMemberSockets(
						message.to,
						endClients,
						socket => emitMessage(socket, message)
					)

					console.log('REFLECTING BACK');
					forEachBusinessSocket(
						receiver => {
							if (receiver === socket) return;
							emitBusinessMessage(receiver, message);
						}
					);
				},

				disconnect: () => {
					deallocataeSocket();
					removeFromGroup(businessClients)

					broadcastIsBusinessAvailable();
				},
			},

			endClientWithoutId: {
				id: id => {
					console.log('RECEIVING ID', id);
					clientId = id;
					changeRole(roles.endClientWithId)
				}
			},

			endClientWithId: {
				connect: id => {
					allocateSocket();
					addToGroup(endClients)
					console.log('ADDING TO END CLIENTS', endClients);

					broadcastEndClients();
					broadcastIsBusinessAvailable();
				},

				message: message => {
					forEachBusinessSocket(
						socket => console.log('EMITTING MESSAGE') || emitMessage(socket, message)
					);

					forGroupMemberSockets(
						clientId,
						endClients,
						receiver => {
							if (receiver === socket) return;
							emitMessage(receiver, message);
						}
					)
				},

				disconnect: () => {
					deallocataeSocket();
					removeFromGroup(endClients);

					broadcastEndClients();
				},
			},

		};

 		const changeRole = (newRole) => {

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
				if (newRole.connect) newRole.connect();
				
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
			changeRole(roles.endClientWithoutId);
			broadcastEndClients();
			return;
		};

		

	});

}