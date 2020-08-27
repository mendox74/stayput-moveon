const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;
const Game = require('./libs/game');

const game = new Game();
game.start(io);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/generateRoomId', (req, res) => {
    let hostname = req.headers.host;
    let roomId = game.makeKey();
    res.send({roomId: roomId, hostname: hostname});
});

app.use('/static', express.static('public'));

http.listen(port, () => {
    console.log('listening on *:' + port);
});