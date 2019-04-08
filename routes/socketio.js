const http = require('http');
const socket = require('socket.io');

const init = (app) => {
    const server = http.Server(app);
    const io = socket.listen(server);

    server.lastPlayderID = 0; // Keep track of the last id assigned to a new player

    io.on('connection',function(socket){
        socket.on('newplayer',function(){
            socket.player = {
                id: server.lastPlayderID++,
                x: randomInt(100,400),
                y: randomInt(100,400)
            };
            socket.emit('allplayers',getAllPlayers());
            socket.broadcast.emit('newplayer',socket.player);
        });
    });
};

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


module.exports= {init};