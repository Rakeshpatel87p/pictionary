var socket = io();
// var drawing = false;

var pictionary = function() {
    var canvas, context;
    var guessBox;
    // How to confine drawing to one client?
    // How to clear drawing space after game has finished?
    // How to load image for newcomers to the game?
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

    socket.on('drawerWord', function(WORDS) {
        $('#drawerInstructions').show()
        $('#drawerWord').text(WORDS);
    });

    socket.on('guessAppend', function(userGuess) {
        $('#guesses').append('<div>' + userGuess + '</div>');
    });

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.mousedown(function() {
        // drawing = true;

    });

    canvas.on('mouseup', function(event) {
        // drawing = false;
    });

    socket.on('drawEvent', function(user) {
        if (user.canDraw) {
            draw(user.position);
        }
    });

    canvas.on('mousemove', function(event) {
        // if (drawing == true) {
            var offset = canvas.offset();
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };

        // };

        // Necessary to have this socket here?
        socket.emit('connection');
        // on top of sending position, send user identity

        socket.on('user', function(users) {
            console.log('users', users);
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                console.log((user.canDraw && user.socket_id == socket.id), "CONDITION");
                console.log("Can draw?", user.canDraw);
                console.log('id on obj', user.socket_id);
                console.log("SOCKET ID", socket.id)
                if (user.canDraw && user.socket_id == socket.id) {
                    socket.emit('draw', position);
                    draw(position);
                    return;
                }
            }
            // console.log('user in client', user);

        })

        // };

    });
};

$(document).ready(function() {
    pictionary();

});
