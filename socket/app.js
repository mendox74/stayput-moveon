const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'));

const defaultDistance = 400;
const defaultHideTime = 1500;
const defaultWatchCount = 8;
const status = {};
let watchCount;
let random;
let moveFlg = false;
let endFlg;
let checkID;
let moveID;
let hideID;

let rooms = [];
let count = 0;
io.on('connection', (socket) => {
  // 接続切断処理
  socket.on('disconnect', () => {
    if(!io.sockets.adapter.rooms[socket.roomId]){
      rooms.splice(rooms.indexOf(socket.roomId), 1);
    };
    console.log("disconnect", socket.userName, rooms);
  });

  socket.on('moveStart', () => {
    moveID = setInterval(() => {countDown('distance');}, 10);
  });

  socket.on('moveStop', () => {
    clearInterval(moveID);
  });

  socket.on('distance reset', () => {
    clearInterval(moveID);
    status.distance = defaultDistance;
    io.to(socket.roomId).emit('distance', status.distance);
  });

  socket.on('hide', () => {
    hideID = setInterval(() => {countDown('hideTime');}, 10);
  });

  socket.on('watch count', () => {
    watchCount -= 1;
    io.to(socket.roomId).emit('watch count', watchCount);
    clearInterval(hideID);
  });

  socket.on('login', () => {
    if(socket.roomId)return;
    io.to(socket.id).emit('delete');
    // 部屋の有無を判定
    if(rooms.length >= 1){
      // 人数が1人の部屋を検索
      socket.roomId = rooms.find(key => io.sockets.adapter.rooms[key].length === 1);
    }
    if(!socket.roomId){
      // 新しく部屋番号を生成
      socket.roomId =  Math.floor( Math.random() * 1000);
      rooms.push(socket.roomId);
    } 
    socket.join(socket.roomId);

    console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName);

    io.to(socket.id).emit('myName', socket.userName);
    io.to(socket.id).emit('roomNumber', socket.roomId);
    io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
    io.to(socket.roomId).emit('chat message', socket.userName　+　'さんが入室されました。');
  });

  socket.on('logout', () => {
    socket.leave(socket.roomId, () => {
      if(!io.sockets.adapter.rooms[socket.roomId]){
        rooms.splice(rooms.indexOf(socket.roomId), 1);
      }
      io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
      io.to(socket.roomId).emit('chat message', socket.userName　+　'さんが退室されました。');
      io.to(socket.id).emit('delete');
      delete socket.userName;
      delete socket.roomId;
      console.log(socket.roomId, socket.userName, rooms);
    });
  });

  socket.on('chat message', (msg) => {
    if(!socket.roomId)return;
    io.to(socket.roomId).emit('chat message', socket.userName + ': ' + msg);
  });

  socket.on('setUserName',  (userName) => {
    if(!userName) {userName = '匿名';}
    socket.userName = userName;
  });

  socket.on('set start', () => {
    endFlg = false;
    watchCount = defaultWatchCount;
    status.hideTime = defaultHideTime;
    status.distance = defaultDistance;
    io.to(socket.roomId).emit('set start', status, watchCount);
  });

  function getRoomMenberName () {
    if(!io.sockets.adapter.rooms[socket.roomId])return;
    let id = Object.keys(io.sockets.adapter.rooms[socket.roomId].sockets);
    return id.map(id => io.sockets.sockets[id].userName);
  }

  function countDown (name) {
    status[name] -= 1;
    io.to(socket.roomId).emit(name, status[name]);
    if(status[name] === 0 ){
      endFlg = true;
      moveFlg = false;
      clearInterval(moveID);
      clearInterval(hideID);
      io.to(socket.roomId).emit('result', name);
    }
  }

});

http.listen(port, () => {
  console.log('listening on *:' + port);
});