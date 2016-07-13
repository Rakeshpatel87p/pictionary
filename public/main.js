var socket = io();
var drawing = false;
var pictionary = function() {
    var canvas, context;
    var guessBox;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
            6, 0, 2 * Math.PI);
        context.fill();
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) {
            return
        };

        var userGuess = guessBox.val();
        socket.emit('guess', userGuess);
        guessBox.val('');

    };

    socket.on('guessAppend', function(userGuess){
    	$('#guesses').append('<div>' + userGuess + '</div>');
    })

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.mousedown(function() {
        drawing = true;
    });

    canvas.on('mouseup', function(event) {
        drawing = false;
    })

    // Better to place within mousemove or outside?
    // How to have pre-drawing loaded for newcoming users?
    socket.on('drawEvent', function(position) {
        draw(position);
    });

    canvas.on('mousemove', function(event) {
        if (drawing == true) {
            var offset = canvas.offset();
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };
            draw(position);
            // Necessary to have this socket here?
            socket.emit('connection');
            socket.emit('draw', position);
        };

    });

};

$(document).ready(function() {
    pictionary();

});
