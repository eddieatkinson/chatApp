$(document).ready(()=>{
	// console.log("Sanity check");
	// Set up route to piggy back on.
	var socketUrl = 'http://127.0.0.1:8080';
	var socketio = io.connect(socketUrl);
	var name = prompt("What is your name?");
	// Take the user's name and send it to the server.
	// emit takes 2 args:
	// 1. Event (we make this up)
	// 2. Data to send via ws
	socketio.emit('nameToServer', name);
	socketio.on('newUser', (users)=>{
		// console.log(`${userName} just joined!`);
		// $('#users').append(`<div class="col-sm-12">${userName}</div>`);
		var usersHTML = "";
		users.map((users)=>{
			usersHTML += `<div class="col-sm-12">${users.name}</div>`;
		});
		$('#users').html(usersHTML);
	});
	// User jQuery to listen to form submit
	$('#submit-message').submit((event)=>{
		// stop the page from submitting
		event.preventDefault();
		// Get the value from the input box
		var newMessage = $('#new-message').val();
		// use socketio to send data to the server
		socketio.emit('messageToServer', {
			name: name,
			message: newMessage
		});
	});
	socketio.on('messageToClient', (messageObject)=>{
		$('#messages').prepend(`<p>${messageObject.message} -- ${messageObject.name}</p>`);
	});
});
