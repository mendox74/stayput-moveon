const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'));

io.on('connection', (socket) => {
  // 接続切断処理
  socket.on('disconnect', () => {
    console.log("disconnect");
  });

  socket.on('login', () => {
    if(socket.roomId) return;
    // 待機中のプレイヤーが居る
    if(io.waitPlayer){
      // 待機中の部屋IDにjoin
      socket.join(io.tmpRoomId, () => {
        socket.roomId = io.tmpRoomId;
        console.log(socket.roomId, socket.rooms.id);
      });

      io.of('/').in(io.tmpRoomId).clients((error, clients) => {
        console.log(clients.userName);
      });

      io.waitPlayer = false;
      io.to(io.tmpRoomId).emit('roomNumber', io.tmpRoomId)
      io.to(io.tmpRoomId).emit('roomMenber', socket.userName);
    } else {
      io.tmpRoomId = '';
      io.waitPlayer = true;

      io.tmpRoomId = Math.floor( Math.random() * 100 );
      socket.join(io.tmpRoomId, () => {
        socket.roomId = io.tmpRoomId;
        console.log(socket.roomId);
      });

      io.of('/').in(io.tmpRoomId).clients((error, clients) => {
        console.log(clients);
        
      });

      io.to(io.tmpRoomId).emit('roomNumber', io.tmpRoomId);
      io.to(io.tmpRoomId).emit('roomMenber', socket.userName);
    }
  })

  socket.on('logout', () => {
    io.to(socket.roomId).emit('delete');
    socket.leave(socket.roomId, () => {
      io.to(socket.roomId).emit('chat message', socket.userName　+　'さんが退室されました。');
      io.waitPlayer = io.waitPlayer === true ? false : true ;
    });
  });


  socket.on('chat message', (msg) => {
    io.to(socket.roomId).emit('chat message', socket.userName +': ' + msg);
  });

  socket.on('setUserName',  (userName) => {
    if(!userName) {userName = '匿名';}
    socket.userName = userName;
    io.to(socket.id).emit('myName', userName);
  });

});

http.listen(port, () => {
  console.log('listening on *:' + port);
});