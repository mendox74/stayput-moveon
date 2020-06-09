$(function () {
//======================================================================================================
// 変数
  let userName;
  let hideTime;
  let hideTimeID;
  let distance;
  let distanceID;
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

  $('#join').click(() => {
    socket.emit('join');
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
    $('#myName').text(userName + '：');
  });

  socket.on('delete', () => {
    $('#watchCount').text('');
    $('#hideTime').text('');
    $('#distance').text('');
    $('#roomNumber').text('');
    $('#roomMenber').text('');
    $('#player').empty()
    $('#start').hide();
    $('#auto').hide();
  });

  socket.on('set', (getHideTime, watchCount) => {
    $('#watchCount').text(watchCount);
    $('#hideTime').text(getHideTime);
    $('#start').show();
    $('#auto').show();
    clearInterval(hideTimeID);
    clearInterval(distanceID)
    hideTime = getHideTime;
  });

  socket.on('join', (getDistance) => {
    $('#distance').text(getDistance);
    clearInterval(distanceID)
    distance = getDistance;
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

  socket.on('move', (count) => {
    distance = count;
    displayDistance();
    $('#child').text('move');
  });
  socket.on('stop', (count) => {
    if($('#child').text() === 'move' ){clearInterval(distanceID)};
    distance = count;
    $('#child').text('stop');
    $('#distance').text(count);
  });
  socket.on('out', () => {
    if($('#child').text() === 'move' ){clearInterval(distanceID)};
    $('#child').text('out');
  });
  
  socket.on('result', (name) => {
    if($('#parent').text() === 'hide'){clearInterval(hideTimeID)};
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

  socket.on('add player', (name) => {
    $('#player').append('<div id="' + name + '"><span>' + name + '：</span><span id="' + name + 'distance"></span></div>');
  });

  socket.on('remove player', (name) => {
    $('#' + name + '').remove();
  });

  socket.on('player', (name, distance) => {
    $('#' + name + 'distance').text(distance);
  });

  socket.on('result player', (name) => {
    $('#' + name + 'distance').text('touch');
    if($('#parent').text() === 'hide'){clearInterval(hideTimeID)};
    if($('#child').text() === 'move'){clearInterval(distanceID)};
    $('#child').text('stop');
    $('#parent').text('watch');
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