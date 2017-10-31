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
		$('.num-users').html(`${users.length} `);
		if((users.length) == 1){
			$('.connected-users').html('Connected User');
		}else{
			$('.connected-users').html('Connected Users');
		}
		users.map((users)=>{
			usersHTML += `<div class="col-sm-12"><h4>${users.name}</h4></div>`;
		});
		$('#users').html(usersHTML);
	});
	// User jQuery to listen to form submit
	$('#submit-message').submit((event)=>{
		// stop the page from submitting
		event.preventDefault();
		var now = new Date();
		var hours = now.getHours().toString();
		var min = now.getMinutes().toString();
		var mornOrEvn = 'am';
		if(hours > 12){
			hours -= 12;
			mornOrEvn = 'pm';
		}
		var timeNow = `${hours}:${min}${mornOrEvn}`;
		// Get the value from the input box
		var newMessage = $('#new-message').val();
		// use socketio to send data to the server
		socketio.emit('messageToServer', {
			time: timeNow,
			name: name,
			message: newMessage
		});
		$('#new-message').val("");
	});
	socketio.on('messageToClient', (messages)=>{
		var messageHTML = "";
		messages.map((message)=>{
			messageHTML += (`<p class="whole-message"><span class="time">${message.time}</span><span class="message-display"><span class="name-display">${message.name}</span>: ${message.message}</span></p>`);
		});
		$('#messages').html(messageHTML);
	});
	$(window).on('beforeunload', ()=>{
		socketio.emit('userLeft', {
			name: name
		});
	});
	socketio.on('messageREExit', (leftMessageObject)=>{
		// console.log(leftMessageObject.userWhoLeft);
		$('#messages').prepend(`${leftMessageObject.userWhoLeft.name} has left the chat!`);
	});
});
