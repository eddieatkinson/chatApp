const http = require('http');
const express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);
console.log('The server is listening on port 8080.');