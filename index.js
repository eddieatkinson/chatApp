const http = require('http');
const express = require('express');

var socketio = require('socket.io');

var app = express();
app.use(express.static(__dirname + '/public'));

var users = [];

var server = http.createServer(app);
server.listen(8080);
// listening to the listener:
var io = socketio.listen(server); // Only listening at ws://localhost:8080
// console.log(io);

// The way socket.io works....
// 1. .on to listen
// 2. .emit to send
io.sockets.on('connect', (socket)=>{
	console.log("Someone connected via socket.");
	// ADD ALL EVENT LISTENERS
	socket.on('nameToServer', (data)=>{
		var clientInfo = {
			name: data,
			clientId: socket.id
		}
		users.push(clientInfo);
		console.log(data);
		// Emit takes 2 args:
		// 1. Event (we make this up)
		// 2. Data to send
		io.sockets.emit('newUser', users);
	});
	socket.on('messageToServer', (messageObject)=>{
		console.log(messageObject);
		io.sockets.emit('messageToClient', messageObject);
	})
});

console.log('The server is listening on port 8080.');