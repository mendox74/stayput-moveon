$(function () {
//======================================================================================================
// 変数
  let userName;
  let hideTime;
  let distance;
  let socket = io({autoConnect:false});

//======================================================================================================
// イベント
  $('#start').click(() => {
    socket.emit('start');
  });

  $('#auto').click(() => {
    socket.emit('auto');
  });

  $('#reset').click(() => {
    socket.emit('reset');
  });

  $('#login').on('click', () => {
    socket.connect();
    socket.emit('login');
  });

  $('#logout').on('click', () => {
    socket.emit('logout');
  });

  $('#child').on('touchend mouseup', () => {
    socket.emit('stop');
  }).on('touchstart mousedown', () => {
    socket.emit('move');
  }).on('touchcancel mouseout', () => {
    socket.emit('stop');
  });

  $('#parent').on('touchend mouseup', () => {
    socket.emit('watch');
  }).on('touchstart mousedown', () => {
    socket.emit('hide');
  }).on('touchcancel mouseout', () => {
    socket.emit('watch');
  });

//======================================================================================================
// 通信処理
  socket.on('connect', () => {
    userName = prompt('ユーザー名を入力してください');
    socket.emit('setUserName', userName);
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
    $('#watchCount').text('');
    $('#hideTime').text('');
    $('#distance').text('');
    $('#roomNumber').text('');
    $('#roomMenber').text('');
  });

  socket.on('set', (status, watchCount) => {
    $('#watchCount').text(watchCount);
    $('#hideTime').text(status.hideTime);
    $('#distance').text(status.distance);
    $('#start').show();
    $('#auto').show();
    hideTime = status.hideTime;
    distance = status.distance;
  });

  socket.on('start', () => {
    $('#start').hide();
    $('#auto').hide();
  });

  socket.on('distance', (count) => {
    $('#distance').text(count);
    distance = count;
  });

  socket.on('hideTime', (count) => {
    $('#hideTime').text(count);
    hideTime = count;
  });

  socket.on('hide', () => {
    displayHideTime();
    $('#parent').text('hide');
  });

  socket.on('watch', (watchCount) => {
    clearInterval(hideTimeID);
    $('#watchCount').text(watchCount);
    $('#parent').text('watch');
  });

  socket.on('move', () => {
    displayDistance();
    $('#child').text('move');
  });
  socket.on('stop', () => {
    if($('#child').text() === 'move' ){clearInterval(distanceID)};
    $('#child').text('stop');
  });
  socket.on('out', () => {
    if($('#child').text() === 'move' ){clearInterval(distanceID)};
    $('#child').text('out');
  });
  
  socket.on('result', (name) => {
    if($('#parent').text() === 'hide') clearInterval(hideTimeID);
    if($('#child').text() === 'move'){clearInterval(distanceID)};
    $('#child').text('stop');
    $('#parent').text('watch');
    $('#' + name).text('');
    if(name === 'distance'){
      $('#' + name).append('<span>touch</span>');
    } else {
      $('#' + name).append('<span>protect</span>');
    }
  });

//======================================================================================================
// ローカル関数
  function displayHideTime () {
    hideTime -= 10;
    $('#hideTime').text(hideTime);
    hideTimeID = setTimeout(displayHideTime, 10);
  }

  function displayDistance () {
    distance -= 10;
    $('#distance').text(distance);
    distanceID = setTimeout(displayDistance, 10);
  }

});