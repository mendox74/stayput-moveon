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
    autoID,moveID,hideID,
  ){
    this.hideTime = hideTime;
    this.watchCount = watchCount;
    this.random = random;
    this.moveFlg = false;
    this.hideFlg = true;
    this.endFlg = true;
    this.autoID = autoID;
    this.moveID = moveID;
    this.hideID = hideID;
  }
}
const rooms = []; 
io.on('connection', (socket) => {
  // 接続切断処理
  socket.on('disconnect', () => {
    if(!io.sockets.adapter.rooms[socket.roomId]){
      let index = rooms.indexOf(socket.roomId);
      if(index >= 0){
        clearInterval(rooms[socket.roomId].moveID);
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
      // 人数が1人の部屋を検索
      socket.roomId = rooms.find(room => io.sockets.adapter.rooms[room]);
    }
    if(!socket.roomId){
      // 新しい部屋を生成
      socket.roomId = makeKey();
      rooms.push(socket.roomId);
      rooms[socket.roomId] = new roomStatus();
    } 
    socket.join(socket.roomId);

    console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName, rooms);

    io.to(socket.id).emit('roomNumber', socket.roomId);
    io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
  });

  socket.on('logout', () => {
    if(!socket.roomId)return;
    socket.leave(socket.roomId, () => {
      if(!io.sockets.adapter.rooms[socket.roomId]){
        rooms.splice(rooms.indexOf(socket.roomId), 1);
        delete rooms[socket.roomId];
      }
      io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
      io.to(socket.id).emit('delete');
      io.to(socket.id).emit('start');
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
    if(!rooms[socket.roomId])return;
    if(rooms[socket.roomId].endFlg)return;
    if(rooms[socket.roomId].hideFlg){
      rooms[socket.roomId].moveFlg = true;
      moveCount();
      io.to(socket.id).emit('move');
      io.to(socket.id).emit('distance', socket.distance);
  } else {
      out();
    }
  });

  socket.on('stop', () => {
    if(rooms[socket.roomId].endFlg)return;
    rooms[socket.roomId].moveFlg = false;
    clearInterval(rooms[socket.roomId].moveID);
    io.to(socket.id).emit('stop');
    io.to(socket.id).emit('distance', socket.distance);
  });

  socket.on('hide', () => {
    hide();
  });

  socket.on('watch', () => {
    watch();
  });

  socket.on('start', () => {
    rooms[socket.roomId].endFlg = false;
    io.to(socket.roomId).emit('start');
    hide();
  });

  socket.on('auto', () => {
    rooms[socket.roomId].endFlg = false;
    rooms[socket.roomId].hideFlg = false;
    io.to(socket.roomId).emit('start');
    auto();
  });

  socket.on('reset', () => {
    rooms[socket.roomId].endFlg = true;
    rooms[socket.roomId].moveFlg = false;
    rooms[socket.roomId].hideFlg = false;
    clearInterval(rooms[socket.roomId].moveID);
    clearInterval(rooms[socket.roomId].hideID);
    clearInterval(rooms[socket.roomId].autoID);
    rooms[socket.roomId].watchCount = defaultWatchCount;
    rooms[socket.roomId].hideTime = defaultHideTime;
    socket.distance = defaultDistance;
    io.to(socket.roomId).emit('set', {distance: socket.distance, hideTime: rooms[socket.roomId].hideTime}, rooms[socket.roomId].watchCount);
  });

  function getRoomMenberName () {
    if(!io.sockets.adapter.rooms[socket.roomId])return;
    let id = Object.keys(io.sockets.adapter.rooms[socket.roomId].sockets);
    return id.map(id => io.sockets.sockets[id].userName);
  }

  function distanceCountDown () {
    socket.distance -= 10;
    if(socket.distance === 0 ){
      rooms[socket.roomId].endFlg = true;
      rooms[socket.roomId].moveFlg = false;
      rooms[socket.roomId].hideFlg = true;
      clearInterval(rooms[socket.roomId].moveID);
      clearInterval(rooms[socket.roomId].hideID);
      clearInterval(rooms[socket.roomId].autoID);
      io.to(socket.id).emit('result', 'distance');
    }
  }

  function hideTimeCountDown () {
    rooms[socket.roomId].hideTime -= 10;
    if(rooms[socket.roomId].hideTime === 0 ){
      rooms[socket.roomId].endFlg = true;
      rooms[socket.roomId].moveFlg = false;
      rooms[socket.roomId].hideFlg = true;
      clearInterval(rooms[socket.roomId].moveID);
      clearInterval(rooms[socket.roomId].hideID);
      clearInterval(rooms[socket.roomId].autoID);
      io.to(socket.roomId).emit('result', 'hideTime');
    }
  }

  function moveCount () {
    if(rooms[socket.roomId].endFlg)return;
    rooms[socket.roomId].moveID = setTimeout(moveCount, 10);
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
    if(rooms[socket.roomId].moveFlg){
      out();
    }
  }

  function out () {
    rooms[socket.roomId].moveFlg = false;
    clearInterval(rooms[socket.roomId].moveID);
    socket.distance = defaultDistance;
    io.to(socket.roomId).emit('out');     
    io.to(socket.roomId).emit('distance', socket.distance); 
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