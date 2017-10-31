const http = require('http');
const express = require('express');

var socketio = require('socket.io');

var app = express();
app.use(express.static(__dirname + '/public'));

var users = [];
var messages = [];

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
		// console.log(data);
		// Emit takes 2 args:
		// 1. Event (we make this up)
		// 2. Data to send
		io.sockets.emit('newUser', users);
	});
	socket.on('messageToServer', (messageObject)=>{
		// console.log(messageObject);
		messages.unshift(messageObject);
		if(messages.length > 50){ // Will only keep the last 50 messages.
			messages.pop();
		}
		// console.log(messages);
		io.sockets.emit('messageToClient', messages);
	});
	socket.on('userLeft', (userWhoLeft)=>{
		var indexToRemove;
		// console.log(users);
		console.log(`${userWhoLeft.name} has left.`);
		for(let i = 0; i < users.length; i++){
			if(userWhoLeft.name == users[i].name){
				indexToRemove = i;
			}
		};
		users.splice(indexToRemove, 1);
		// console.log(users);
		io.sockets.emit('messageREExit', {
			users: users,
			userWhoLeft: userWhoLeft
		});
	});
});

console.log('The server is listening on port 8080.');