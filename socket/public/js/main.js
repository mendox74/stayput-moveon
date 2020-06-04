$(function () {
//======================================================================================================
// 変数
  let userName;
  let socket = io({autoConnect:false});

  let random;
  let moveFlg = false;
  let endFlg;
  let checkID;
  let moveID;
  let hideID;
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

  socket.on('distance', (count) => {
    $('#distance').text(count);
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
    $('#watchCount').text(watchCount);
    $('#hideTime').text(status.hideTime);
    $('#distance').text(status.distance);
    $('#start').hide();
    // getStart();
  });

//======================================================================================================
// ローカル関数
  function getStart () {
    random = 500 + Math.floor(Math.random() * 3500);
    checkID = setTimeout(getStart, random);
    $('#parentStatus[name="watch"], #parentStatus[name="hide"]').toggle();
    if($('#parentStatus[name="hide"]').is(':visible')){
      hideID = setInterval(() => {
        countdown(status.hideTime -1, 'hideTime', 'protect');
      }, 10);
      if(watchCount === 0){
        clearInterval(checkID);
      }
    } else {
      watchCount -= 1;
      $('#watchCount').text(watchCount);
      clearInterval(hideID);
    }
    if(moveFlg){
      if($('#parentStatus[name="watch"]').is(':visible')){
        $('#child').text('out');
        console.log('out');
        countdown(defaultDistance, 'distance', 'touch');
        moveFlg = false;
        clearInterval(moveID);
      }
    }
  }

  $('#child').mouseup(() => {
    if(moveFlg){ $('#child').text('statue'); }
      moveFlg = false;
      socket.emit('moveStop');
      // clearInterval(moveID);
  }).mousedown(() => {
    // if(endFlg)return;
    // if($('#parentStatus[name="watch"]').is(':visible')){
    //   $('#child').text('out'); 
    //   console.log('out');
    //   countdown(defaultDistance, 'distance', 'touch');
      // moveFlg = false;
      // socket.emit('countStop');
      // clearInterval(moveID);
    // } else {
      $('#child').text('move');
      moveFlg = true;
      socket.emit('moveStart');
    //   moveID = setInterval(() => {
    //     countdown(status.distance -1, 'distance', 'touch');}, 10);
    // }
  }).mouseout(() => {
    if(moveFlg){ $('#child').text('statue'); }
    moveFlg = false;
    socket.emit('moveStop');
    // clearInterval(moveID);
  });

  function countdown (sub, name, result) {
    status[name] = sub;
    $('#' + name).text(status[name]);
    if(status[name] === 0 ){
      endFlg = true;
      moveFlg = false;
      clearInterval(moveID);
      clearInterval(hideID);
      clearInterval(checkID);
      $('#' + name).text('');
      $('#' + name).append('<span>' + result + '</span>');
      $('#parentStatus[name="hide"]').hide();
      $('#parentStatus[name="watch"]').show();
      $('#start').show();
    }
  }

});