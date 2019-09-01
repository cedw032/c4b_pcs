const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const manageClient = require('./manageClient');

app.use(express.static(__dirname + '/public'));

io.on('connection', manageClient(io));

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});