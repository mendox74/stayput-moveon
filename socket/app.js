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
    hideTime,watchCount,random,
    autoID,hideID,
  ){
    this.hideTime = hideTime;
    this.watchCount = watchCount;
    this.random = random;
    this.hideFlg = true;
    this.endFlg = true;
    this.autoID = autoID;
    this.hideID = hideID;
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
        rooms.splice(rooms.indexOf(socket.roomId), 1);
        delete rooms[socket.roomId];
      }
    };
    console.log("disconnect", socket.userName, rooms);
  });

  socket.on('login', () => {
    if(socket.roomId)return;
    io.to(socket.id).emit('delete');
    // 部屋の有無を判定
    if(rooms.length >= 1){
      // 待機中の部屋を検索
      socket.roomId = rooms.find(room => io.sockets.adapter.rooms[room].length < 3);
    }
    if(!socket.roomId){
      // 新しい部屋を生成
      socket.roomId = makeKey();
      rooms.push(socket.roomId);
      rooms[socket.roomId] = new roomStatus();
    }
    socket.join(socket.roomId);

    console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName, rooms);
    let id = Object.keys(io.sockets.adapter.rooms[socket.roomId].sockets);
    id.forEach(id => {
      if(id !== socket.id){
        io.to(socket.id).emit('add player', io.sockets.sockets[id].userName);
      }
    });

    io.to(socket.id).emit('roomNumber', socket.roomId);
    io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
    socket.broadcast.to(socket.roomId).emit('add player', socket.userName);
  });

  socket.on('logout', () => {
    if(!socket.roomId)return;
    socket.leave(socket.roomId, () => {
      if(!io.sockets.adapter.rooms[socket.roomId]){
        rooms.splice(rooms.indexOf(socket.roomId), 1);
        delete rooms[socket.roomId];
      }
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
    io.to(socket.id).emit('myName', socket.userName);
  });

  socket.on('move', () => {
    if(!socket.roomId)return;
    if(rooms[socket.roomId].endFlg)return;
    if(rooms[socket.roomId].hideFlg){
      socket.moveFlg = true;
      io.to(socket.id).emit('move', socket.distance);
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
    io.to(socket.id).emit('stop', socket.distance);
    socket.broadcast.to(socket.roomId).emit('player', socket.userName, socket.distance);
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
    io.to(socket.roomId).emit('start');
  });

  socket.on('auto', () => {
    if(!socket.roomId)return;
    rooms[socket.roomId].endFlg = false;
    rooms[socket.roomId].hideFlg = false;
    io.to(socket.roomId).emit('start');
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
    io.to(socket.roomId).emit('set', rooms[socket.roomId].hideTime, rooms[socket.roomId].watchCount);
  });

  socket.on('join', () => {
    socket.distance = defaultDistance;
    io.to(socket.id).emit('join', socket.distance);
    socket.broadcast.to(socket.roomId).emit('player', socket.userName, socket.distance);
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
      io.to(socket.id).emit('result', 'distance');
      socket.broadcast.to(socket.roomId).emit('result player', socket.userName);
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
      io.to(socket.roomId).emit('result', 'hideTime');
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
    io.to(socket.roomId).emit('hide');
    io.to(socket.roomId).emit('hideTime', rooms[socket.roomId].hideTime);
    hideCount();
  }

  function watch () {
    if(rooms[socket.roomId].endFlg || rooms[socket.roomId].watchCount === 0)return;
    rooms[socket.roomId].hideFlg = false;
    clearInterval(rooms[socket.roomId].hideID);
    rooms[socket.roomId].watchCount -= 1;
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
    io.to(socket.id).emit('out');     
    io.to(socket.id).emit('distance', socket.distance); 
    socket.broadcast.to(socket.roomId).emit('player', socket.userName, socket.distance);
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