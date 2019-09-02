module.exports = {
	isEndClient: socket => {
		console.log(socket.handshake.headers.referer);
		/*return socket.handshake.headers.referer === 'http://localhost:3000/';*/
		return socket.handshake.headers.referer === 'https://https://cedw032.github.io/c4b_cw/build/';
	},

	isBusinessClient: socket => {
		console.log(socket.handshake.headers.referer);
		return socket.handshake.headers.referer === 'https://still-falls-37601.herokuapp.com/';
		/*return socket.handshake.headers.referer === 'http://localhost:5000/'
			|| socket.handshake.headers.referer === 'http://localhost:3001/';*/
	},

	isBusinessLogin: ({username, password}) => {
		return username === 'chad' && password === 'test';
	}

};