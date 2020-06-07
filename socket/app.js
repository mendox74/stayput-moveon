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
const status = {};
let watchCount;
let random;
let moveFlg = false;
let hideFlg = true;
let endFlg = true;
let autoID;
let moveID;
let hideID;

let rooms = [];
io.on('connection', (socket) => {
  // 接続切断処理
  socket.on('disconnect', () => {
    if(!io.sockets.adapter.rooms[socket.roomId]){
      rooms.splice(rooms.indexOf(socket.roomId), 1);
      endFlg = true;
      moveFlg = false;
      hideFlg = true;
      clearInterval(moveID);
      clearInterval(hideID);
      clearInterval(autoID);
    };
    console.log("disconnect", socket.userName, rooms);
  });

  socket.on('login', () => {
    if(socket.roomId)return;
    io.to(socket.id).emit('delete');
    // 部屋の有無を判定
    if(rooms.length >= 1){
      // 人数が1人の部屋を検索
      socket.roomId = rooms.find(key => io.sockets.adapter.rooms[key]);
    }
    if(!socket.roomId){
      // 新しく部屋番号を生成
      socket.roomId =  Math.floor( Math.random() * 1000);
      rooms.push(socket.roomId);
    } 
    socket.join(socket.roomId);

    console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName);

    // io.to(socket.id).emit('myName', socket.userName);
    io.to(socket.id).emit('roomNumber', socket.roomId);
    io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
    // io.to(socket.roomId).emit('chat message', socket.userName　+　'さんが入室されました。');
  });

  socket.on('logout', () => {
    socket.leave(socket.roomId, () => {
      if(!io.sockets.adapter.rooms[socket.roomId]){
        rooms.splice(rooms.indexOf(socket.roomId), 1);
      }
      io.to(socket.roomId).emit('roomMenber', getRoomMenberName());
      io.to(socket.id).emit('delete');
      io.to(socket.id).emit('start');
      delete socket.roomId;
    });
  });

  socket.on('setUserName',  (userName) => {
    if(!userName) {userName = '匿名';}
    socket.userName = userName;
    console.log (userName);
    io.to(socket.id).emit('myName', socket.userName);
  });

  socket.on('move', () => {
    if(endFlg)return;
    if(hideFlg){
      moveFlg = true;
      moveCount();
      io.to(socket.roomId).emit('move');
    } else {
      out();
    }
  });

  socket.on('stop', () => {
    if(endFlg)return;
    moveFlg = false;
    clearInterval(moveID);
    io.to(socket.roomId).emit('stop');
  });

  socket.on('hide', () => {
    hide();
  });

  socket.on('watch', () => {
    watch();
  });

  socket.on('start', () => {
    endFlg = false;
    io.to(socket.roomId).emit('start');
    hide();
  });

  socket.on('auto', () => {
    endFlg = false;
    hideFlg = false;
    io.to(socket.roomId).emit('start');
    auto();
  });

  socket.on('reset', () => {
    endFlg = true;
    moveFlg = false;
    hideFlg = true;
    clearInterval(moveID);
    clearInterval(hideID);
    clearInterval(autoID);
    watchCount = defaultWatchCount;
    status.hideTime = defaultHideTime;
    status.distance = defaultDistance;
    io.to(socket.roomId).emit('set', status, watchCount);
  });

  function getRoomMenberName () {
    if(!io.sockets.adapter.rooms[socket.roomId])return;
    let id = Object.keys(io.sockets.adapter.rooms[socket.roomId].sockets);
    return id.map(id => io.sockets.sockets[id].userName);
  }

  function countDown (name) {
    status[name] -= 100;
    io.to(socket.roomId).emit(name, status[name]);
    if(status[name] === 0 ){
      endFlg = true;
      moveFlg = false;
      hideFlg = true;
      clearInterval(moveID);
      clearInterval(hideID);
      clearInterval(autoID);
      io.to(socket.roomId).emit('result', name);
    }
  }

  function moveCount () {
    if(endFlg)return;
    moveID = setTimeout(moveCount, 100);
    countDown('distance');
  }

  function hideCount () {
    if(endFlg)return;
    hideID = setTimeout(hideCount, 100);
    countDown('hideTime');
  }

  function hide () {
    if(endFlg)return;
    hideFlg = true;
    hideCount();
    io.to(socket.roomId).emit('hide');
  }

  function watch () {
    if(endFlg || watchCount === 0)return;
    hideFlg = false;
    clearInterval(hideID);
    watchCount -= 1;
    io.to(socket.roomId).emit('watch', watchCount);
    if(moveFlg){
      out();
    }
  }

  function out () {
    moveFlg = false;
    clearInterval(moveID);
    status.distance = defaultDistance;
    io.to(socket.roomId).emit('distance', status.distance); 
    io.to(socket.roomId).emit('out');     
  }

  function auto () {
    random = 500 + Math.floor(Math.random() * 3500);
    autoID = setTimeout(auto, random);
    if(hideFlg){
      watch();
    } else {
      hide();
      if(watchCount === 0){
        clearInterval(autoID);
      }
    }
  };

});

http.listen(port, () => {
  console.log('listening on *:' + port);
});