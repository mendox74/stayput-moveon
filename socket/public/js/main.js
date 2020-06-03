$(function () {
//======================================================================================================
// 変数
  let userName;
  let socket = io({autoConnect:false});
//======================================================================================================
// イベント
  $('#send').click(() => {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  });

  $('#login').on('click', () => {
    socket.connect();
    socket.emit('login')
  });

  $('#logout').on('click', () => {
    socket.emit('logout');
  });

  $('#start').on('click', () => {
    socket.emit('countStart');
  });

  $('#stop').on('click', () => {
    socket.emit('countStop');
  });
//======================================================================================================
// 通信処理
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
});