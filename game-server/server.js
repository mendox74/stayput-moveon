const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;
const Game = require('./libs/game');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'));

const game = new Game();
game.start(io);

http.listen(port, () => {
  console.log('listening on *:' + port);
});