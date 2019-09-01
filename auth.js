module.exports = {
	isEndClient: socket => {
		console.log('END CLIENT ADDRESS', socket.handshake.address);
	},

	isBusinessClient: socket => {
		console.log('BUSINESS ADDRESS', socket.handshake.address);
	},

	isBusinessLogin: ({username, password}) => {
		return username === 'chad' && password === 'test';
	}

};