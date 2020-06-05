$(function () {
//======================================================================================================
// 変数
  let userName;
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

  $('#child').mouseup(() => {
    socket.emit('stop');
  }).mousedown(() => {
    socket.emit('move');
  }).mouseout(() => {
    socket.emit('stop');
  });

  $('#parent').mouseup(() => {
    socket.emit('hide');
  }).mousedown(() => {
    socket.emit('watch');
  }).mouseout(() => {
    socket.emit('hide');
  });

//======================================================================================================
// 通信処理
  socket.on('connect', function () {
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
  });

  socket.on('start', () => {
    $('#start').hide();
    $('#auto').hide();
  });

  socket.on('distance', (count) => {
    $('#distance').text(count);
  });

  socket.on('hideTime', (count) => {
    $('#hideTime').text(count);
  });

  socket.on('hide', () => {
    $('#parent').text('hide');
  });

  socket.on('watch', (watchCount) => {
    $('#watchCount').text(watchCount);
    $('#parent').text('watch');
  });

  socket.on('move', () => {
    $('#child').text('move');
  });
  socket.on('stop', () => {
    $('#child').text('stop');
  });
  socket.on('out', () => {
    $('#child').text('out');
  });
  
  socket.on('result', (name) => {
    $('#' + name).text('');
    $('#child').text('stop');
    if(name === 'distance'){
      $('#' + name).append('<span>touch</span>');
    } else {
      $('#' + name).append('<span>protect</span>');
    }
  });

//======================================================================================================
// ローカル関数
});