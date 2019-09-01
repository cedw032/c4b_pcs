const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const auth = require('./auth');
const manageRoles = require('./manageRoles');

app.use(express.static(__dirname + '/public'));

manageRoles(io, auth);

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});