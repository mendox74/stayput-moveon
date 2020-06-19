const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'));

const defaultDistance = 4000;
const defaultHideTime = 15000;
const defaultWatchCount = 8;
class roomStatus {
  constructor(
    io, roomId,
  ){
    this.io = io;
    this.roomId = roomId;
    this.hideTime = undefined;
    this.watchCount = undefined;
    this.random = undefined;
    this.hideFlg = true;
    this.startFlg = false;
    this.endFlg = true;
    this.autoID = undefined;
    this.hideID = undefined;
    this.menberList = {};
    this.winner = undefined;
    this.roopID = setInterval(() =>{
        io.to(this.roomId).emit('update',
        this.hideTime,
        this.watchCount,
        this.menberList,
        this.winner,
        )
      },1000);
  }
}
const rooms = []; 
io.on('connection', (socket) => {
  // 接続切断処理
  socket.on('disconnect', () => {
    if(!io.sockets.adapter.rooms[socket.roomId]){
      if(rooms.indexOf(socket.roomId) !== -1){
        clearInterval(rooms[socket.roomId].hideID);
        clearInterval(rooms[socket.roomId].autoID);
        clearInterval(rooms[socket.roomId].roopID);
        rooms.splice(rooms.indexOf(socket.roomId), 1);
        delete rooms[socket.roomId];
      }
    };
    console.log("disconnect", socket.userName, rooms);
  });

  socket.on('login', () => {
    if(socket.roomId)return;
    // 旧
    io.to(socket.id).emit('delete');
    // 新
    socket.displayReset = true;
    // 部屋の有無を判定
    if(rooms.length >= 1){
      // 待機中の部屋を検索
      socket.roomId = rooms.find(room => io.sockets.adapter.rooms[room].length < 3);
    }
    if(!socket.roomId){
      // 新しい部屋を生成
      socket.roomId = makeKey();
      rooms.push(socket.roomId);
      rooms[socket.roomId] = new roomStatus(io, socket.roomId);
    }
    socket.join(socket.roomId);

    console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName, rooms);

    let id = Object.keys(io.sockets.adapter.rooms[socket.roomId].sockets);
    id.forEach(id => {
      if(id !== socket.id){
        io.to(socket.id).emit('add player', io.sockets.sockets[id].userName);
      }
    });
    // 旧
    io.to(socket.id).emit('roomNumber', socket.roomId);
    io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
    socket.broadcast.to(socket.roomId).emit('add player', socket.userName);
    // 新
    rooms[socket.roomId].menberList[socket.id] = {name: io.sockets.sockets[socket.id].userName};
  });

  socket.on('logout', () => {
    if(!socket.roomId)return;
    socket.leave(socket.roomId, () => {
      // 新
      socket.displayReset = true;
      delete rooms[socket.roomId].menberList[socket.id];

      if(!io.sockets.adapter.rooms[socket.roomId]){
        clearInterval(rooms[socket.roomId].roopID);
        rooms.splice(rooms.indexOf(socket.roomId), 1);
        delete rooms[socket.roomId];
      }
      // 旧
      io.to(socket.id).emit('delete');
      io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
      socket.broadcast.to(socket.roomId).emit('remove player', socket.userName);

      delete socket.roomId;
      console.log(rooms)
    });
  });

  socket.on('setUserName',  (userName) => {
    if(!userName) {userName = '匿名';}
    socket.userName = userName;
    console.log (userName);
    // 旧
    io.to(socket.id).emit('myName', socket.userName);
  });

  socket.on('move', () => {
    if(!socket.roomId)return;
    if(rooms[socket.roomId].endFlg)return;
    if(rooms[socket.roomId].hideFlg){
      socket.moveFlg = true;
      // 旧
      io.to(socket.id).emit('move', socket.distance);
      // 新
      rooms[socket.roomId].menberList[socket.id].distance = socket.distance;
      moveCount();
  } else {
      out();
    }
  });

  socket.on('stop', () => {
    if(!socket.roomId)return;
    if(rooms[socket.roomId].endFlg)return;
    socket.moveFlg = false;
    clearInterval(socket.moveID);
    // 旧
    io.to(socket.id).emit('stop', socket.distance);
    socket.broadcast.to(socket.roomId).emit('player', socket.userName, socket.distance);
    // 新
    rooms[socket.roomId].menberList[socket.id].distance = socket.distance;
  });

  socket.on('hide', () => {
    if(!socket.roomId)return;
    hide();
  });

  socket.on('watch', () => {
    if(!socket.roomId)return;
    watch();
  });

  socket.on('start', () => {
    if(!socket.roomId)return;
    rooms[socket.roomId].endFlg = false;
    // 旧
    io.to(socket.roomId).emit('start');
    // 新
    rooms[socket.roomId].startFlg = true;
  });

  socket.on('auto', () => {
    if(!socket.roomId)return;
    rooms[socket.roomId].endFlg = false;
    rooms[socket.roomId].hideFlg = false;
    // 旧
    io.to(socket.roomId).emit('start');
    // 新
    rooms[socket.roomId].startFlg = true;

    auto();
  });

  socket.on('reset', () => {
    if(!socket.roomId)return;
    socket.moveFlg = false;
    rooms[socket.roomId].hideFlg = false;
    rooms[socket.roomId].endFlg = true;
    clearInterval(socket.moveID);
    clearInterval(rooms[socket.roomId].hideID);
    clearInterval(rooms[socket.roomId].autoID);
    rooms[socket.roomId].watchCount = defaultWatchCount;
    rooms[socket.roomId].hideTime = defaultHideTime;
    // 旧
    io.to(socket.roomId).emit('set', rooms[socket.roomId].hideTime, rooms[socket.roomId].watchCount);
  });

  socket.on('join', () => {
    socket.distance = defaultDistance;
    // 旧
    io.to(socket.id).emit('join', socket.distance);
    socket.broadcast.to(socket.roomId).emit('player', socket.userName, socket.distance);
    // 新
    rooms[socket.roomId].menberList[socket.id].distance = socket.distance;
    console.log(rooms[socket.roomId].menberList[socket.id]);
  });

  function getRoomMenberName () {
    if(!io.sockets.adapter.rooms[socket.roomId])return;
    let id = Object.keys(io.sockets.adapter.rooms[socket.roomId].sockets);
    return id.map(id => io.sockets.sockets[id].userName);
  }

  function distanceCountDown () {
    socket.distance -= 10;
    if(socket.distance === 0 ){
      socket.moveFlg = false;
      rooms[socket.roomId].hideFlg = true;
      rooms[socket.roomId].endFlg = true;
      clearInterval(socket.moveID);
      clearInterval(rooms[socket.roomId].hideID);
      clearInterval(rooms[socket.roomId].autoID);
      // 旧
      io.to(socket.id).emit('result', 'distance');
      socket.broadcast.to(socket.roomId).emit('result player', socket.userName);
      // 新
      rooms[socket.roomId].winner = socket.id;
    }
  }

  function hideTimeCountDown () {
    rooms[socket.roomId].hideTime -= 10;
    if(rooms[socket.roomId].hideTime === 0 ){
      socket.moveFlg = false;
      rooms[socket.roomId].hideFlg = true;
      rooms[socket.roomId].endFlg = true;
      clearInterval(socket.moveID);
      clearInterval(rooms[socket.roomId].hideID);
      clearInterval(rooms[socket.roomId].autoID);
      // 旧
      io.to(socket.roomId).emit('result', 'hideTime');
      // 新
      rooms[socket.roomId].winner = socket.id;
    }
  }

  function moveCount () {
    if(rooms[socket.roomId].endFlg)return;
    socket.moveID = setTimeout(moveCount, 10);
    distanceCountDown();
  }

  function hideCount () {
    if(rooms[socket.roomId].endFlg)return;
    rooms[socket.roomId].hideID = setTimeout(hideCount, 10);
    hideTimeCountDown();
  }

  function hide () {
    if(rooms[socket.roomId].endFlg)return;
    rooms[socket.roomId].hideFlg = true;
    // 旧
    io.to(socket.roomId).emit('hide');
    io.to(socket.roomId).emit('hideTime', rooms[socket.roomId].hideTime);
    hideCount();
  }

  function watch () {
    if(rooms[socket.roomId].endFlg || rooms[socket.roomId].watchCount === 0)return;
    rooms[socket.roomId].hideFlg = false;
    clearInterval(rooms[socket.roomId].hideID);
    rooms[socket.roomId].watchCount -= 1;
    // 旧
    io.to(socket.roomId).emit('watch', rooms[socket.roomId].watchCount);
    io.to(socket.roomId).emit('hideTime', rooms[socket.roomId].hideTime);
    if(socket.moveFlg){
      out();
    }
  }

  function out () {
    socket.moveFlg = false;
    clearInterval(socket.moveID);
    socket.distance = defaultDistance;
    // 旧
    io.to(socket.id).emit('out');     
    io.to(socket.id).emit('distance', socket.distance); 
    socket.broadcast.to(socket.roomId).emit('player', socket.userName, socket.distance);
    // 新
    rooms[socket.roomId].menberList[socket.id].distance = socket.distance;
    rooms[socket.roomId].menberList[socket.id].outFlg = true;
  }

  function auto () {
    rooms[socket.roomId].random = 500 + Math.floor(Math.random() * 3500);
    rooms[socket.roomId].autoID = setTimeout(auto, rooms[socket.roomId].random);
    if(rooms[socket.roomId].hideFlg){
      watch();
    } else {
      hide();
      if(rooms[socket.roomId].watchCount === 0){
        clearInterval(rooms[socket.roomId].autoID);
      }
    }
  };

  function makeKey () {
    let key = '';
    let maxLen = 10;
    let src = '0123456789'
    + 'abcdefghijklmnopqrstuvwxyz'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < maxLen; i++) {
      key += src[Math.floor(Math.random() * src.length)];
    }
    return key;
  }

});

http.listen(port, () => {
  console.log('listening on *:' + port);
});