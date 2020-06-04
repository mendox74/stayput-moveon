$(function () {
//======================================================================================================
// 変数
  let userName;
  let socket = io({autoConnect:false});

  let random;
  let moveFlg = false;
  let endFlg;
  let checkID;
//======================================================================================================
// イベント
  $('#start').click(() => {
    socket.emit('set start');
  });

  $('#send').click(() => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  });

  $('#login').on('click', () => {
    socket.connect();
    socket.emit('login');
  });

  $('#logout').on('click', () => {
    socket.emit('logout');
  });

//======================================================================================================
// socket通信処理
  socket.on('connect', function () {
    userName = prompt('ユーザー名を入力してください');
    socket.emit('setUserName', userName);
  });

  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('roomNumber', (key) => {
    $('#roomNumber').text(key);
  });

  socket.on('roomMenber', (menberName) => {
    $('#roomMenber').text(menberName);
  });

  socket.on('myName', (userName) => {
    $('#myName').text(userName);
  });

  socket.on('delete', () => {
    $('#myName').text('');
    $('#roomNumber').text('');
    $('#roomMenber').text('');
    $('#messages').children().remove();
  });

  socket.on('set start', (status, watchCount) => {
    endFlg = false;
    $('#watchCount').text(watchCount);
    $('#hideTime').text(status.hideTime);
    $('#distance').text(status.distance);
    $('#start').hide();
    getStart();
  });

  socket.on('distance', (count) => {
    $('#distance').text(count);
  });

  socket.on('hideTime', (count) => {
    $('#hideTime').text(count);
  });

  socket.on('watch count', (watchCount) => {
    $('#watchCount').text(watchCount);
  });

  socket.on('result', (name) => {
    endFlg = true;
    clearInterval(checkID);
    $('#' + name).text('');
    $('#parentStatus[name="hide"]').hide();
    $('#parentStatus[name="watch"]').show();
    $('#start').show();
    if(name === 'distance'){
      $('#' + name).append('<span>touch</span>');
    } else {
      $('#' + name).append('<span>protect</span>');
    }
  });

//======================================================================================================
// ローカル関数
  function getStart () {
    random = 500 + Math.floor(Math.random() * 3500);
    checkID = setTimeout(getStart, random);
    $('#parentStatus[name="watch"], #parentStatus[name="hide"]').toggle();
    if($('#parentStatus[name="hide"]').is(':visible')){
      socket.emit('hide');
      if(watchCount === 0){
        clearInterval(checkID);
      }
    } else {
      socket.emit('watch count');
      if(moveFlg){
          $('#child').text('out');
          socket.emit('distance reset');
          moveFlg = false;
      }
    }
  }

  $('#child').mouseup(() => {
    if(moveFlg){ $('#child').text('statue'); }
      moveFlg = false;
      socket.emit('moveStop');
  }).mousedown(() => {
    if(endFlg)return;
    if($('#parentStatus[name="watch"]').is(':visible')){
      $('#child').text('out'); 
      moveFlg = false;
      socket.emit('distance reset');
    } else {
      $('#child').text('move');
      moveFlg = true;
      socket.emit('moveStart');
    }
  }).mouseout(() => {
    if(moveFlg){ $('#child').text('statue'); }
    moveFlg = false;
    socket.emit('moveStop');
  });

});