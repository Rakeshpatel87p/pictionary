var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var users = [];

io.on('connection', function(socket) {
    if (users.length == 0) {
        io.sockets.connected[socket.id].emit('drawerWord', selectedWord());
    };
    var user = { canDraw: false, socket_id: socket.id.split('').splice(2).join('') };
    if (users.length > 0){
        // there are already existing users, then push a user who can't draw
        users.push(user);    
    } else {
        // there are no existing users, then push a user who can draw
        user.canDraw = true;
        users.push(user);    
    }  
    socket.emit('user', users);
    console.log(users, 'ALl users');
    // for (var i = 0; i < users.length; i++) {
    //     drawing = false;
    // }

    socket.on('draw', function(position) {
        // Sitauations
        /*
        - user stays on browser too long and forgets to quit
        - are we fair?
        - 2 player first then multiple!
        */
        // who is drawing??
        // console.log(users[0], 'USER zero');
        console.log("SOCKET ID", socket.id);

        if (socket.id == users[0].socket_id && users[0].canDraw) {
            socket.broadcast.emit('drawEvent', {position:position, socket_id: users[0].socket_id, canDraw: users[0].canDraw});
        };
    });

    socket.on('guess', function(userGuess) {
        io.emit('guessAppend', userGuess);
        if (userGuess = WORDS[randomNumber]) {
            console.log('you got it!');
        };
    });

    socket.on('disconnect', function() {
        for (var i = 0; i < users.length; i++) {
            if (users[i].socket_id === socket.id) {
                console.log('Users Socket_ID from Obj',users[i].socket_id); 
                console.log('Socket ID ', socket.id);
                users.splice(i, 1);

                if (i == 0) {
                    io.sockets.connected[users[0].socket_id].emit('drawerWord', selectedWord());
                };
            };
        };
    });

});

var selectedWord = function() {
    randomNumber = Math.floor((Math.random() * 100) + 1);
    return WORDS[randomNumber]
};

server.listen(8080);
