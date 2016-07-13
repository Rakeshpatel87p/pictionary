var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('draw', function(socket) {
    console.log('registered');
    // socket.on('draw', position);
    
});

server.listen(8080);
