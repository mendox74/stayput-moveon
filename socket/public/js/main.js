$(function () {
    var socket = io();
    $('form').submit(() => {
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', (msg) => {
      $('#messages').append($('<li>').text(msg));
    });

    $('#login').on('click', () => {
      socket.emit('login')
    });

    $('#logout').on('click', () => {
      socket.emit('logout')
    });

    socket.on('connect', function () {
        socket.emit('setUserName', prompt('ユーザー名を入力してください'));
    });

    socket.on('roomNumber', (roomId) => {
      $('#roomNumber').text(roomId);
    });

    socket.on('roomMenber', (menberName) => {
      $('#roomMenber').append($('<p>' + menberName + '</p>'));
    });

    socket.on('myName', (userName) => {
      $('#myName').text(userName);
    });

    socket.on('delete', () => {
      $('#roomNumber').text('');
      $('#roomMenber').children('p').remove();
    });
  });