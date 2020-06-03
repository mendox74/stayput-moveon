const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'));

let rooms = {};
let countId;
let count = 0;
io.on('connection', (socket) => {
  // 接続切断処理
  socket.on('disconnect', () => {
    console.log("disconnect", socket.userName);
  });

  socket.on('countStart', () => {
    countId = setInterval(() => {
      count += 1;
      io.to(socket.roomId).emit('count', count);
    }, 100);
  });

  socket.on('countStop', () => {
    clearInterval(countId);
  });

  socket.on('login', () => {
    if(socket.roomId)return;
    io.to(socket.id).emit('delete');
    let room;
    // 部屋の有無を判定
    if(Object.keys(rooms).length >= 1){
      room = Object.keys(rooms).find(key => rooms[key].length === 1);
    }
    // 待機中を検索
    if(room){
      // 待機中の部屋IDにjoin
      socket.join(room);
      rooms[room].push(socket.userName);
      socket.roomId = room;

      console.log(io.rooms);
      
      io.to(socket.id).emit('myName', socket.userName);
      io.to(socket.id).emit('roomNumber', room)
      io.to(room).emit('roomMenber', rooms[room]);
      io.to(room).emit('chat message', socket.userName　+　'さんが入室されました。');
    } else {
      room =  Math.floor( Math.random() * 1000 );
      socket.join(room);
      rooms[room] = [socket.userName];
      socket.roomId = room;

      console.log(io.rooms);

      io.to(socket.id).emit('myName', socket.userName);
      io.to(socket.id).emit('roomNumber', room);
      io.to(room).emit('roomMenber', rooms[room]);
      io.to(room).emit('chat message', socket.userName　+　'さんが入室されました。');
    }
  });

  socket.on('logout', () => {
    socket.leave(socket.roomId, () => {
      io.to(socket.roomId).emit('chat message', socket.userName　+　'さんが退室されました。');
      io.to(socket.roomId).emit('roomMenber', rooms[socket.roomId]);
      io.to(socket.id).emit('delete');
      let index = rooms[socket.roomId].indexOf(socket.userName);
      rooms[socket.roomId].splice(index,1);
      delete socket.roomId;
    });
    console.log(rooms);
  });

  socket.on('chat message', (msg) => {
    io.to(socket.roomId).emit('chat message', socket.userName + ': ' + msg);
  });

  socket.on('setUserName',  (userName) => {
    if(!userName) {userName = '匿名';}
    socket.userName = userName;
  });

});

http.listen(port, () => {
  console.log('listening on *:' + port);
});