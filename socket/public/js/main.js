$(function () {
//======================================================================================================
// 変数
  let userName;
  let roopID;
  let roopFlg  = false;
  let socket = io({autoConnect:false});

  let hide;
  let hidef;
  let mydist;
  let watch;
  let win;

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
    if(!roopFlg)updateRoop();
    roopFlg = true;
    socket.connect();
    socket.emit('login');
  });

  $('#logout').on('click', () => {
    roopFlg = false;
    clearInterval(roopID);
    socket.emit('logout');
  });

  $('#child').on('touchend mouseup', () => {
    $('#child').text(hidef ? 'stop':'out');
    socket.emit('stop');
  }).on('touchstart mousedown', () => {
    $('#child').text(hidef ? 'move':'out');
    socket.emit('move');
  }).on('touchcancel mouseout', () => {
    if($('#child').text() === 'mvoe'){
      $('#child').text(hidef ? 'stop':'out');
    }
    socket.emit('stop');
  });

  $('#parent').on('touchend mouseup', () => {
    socket.emit('watch');
  }).on('touchstart mousedown', () => {
    socket.emit('hide');
  });

//======================================================================================================
// 通信処理
  socket.on('update', (hideTime, watchCount , menbarList, winner, hideFlg) =>{
    hide = hideTime;
    watch = watchCount;
    mydist = menbarList[socket.id].distance;
    win = winner;
    hidef = hideFlg;
  })

  socket.on('connect', () => {
    userName = prompt('ユーザー名を入力してください');
    socket.emit('setUserName', userName);
  });

  socket.on('disconnect', () =>{
    roopFlg = false;
    clearInterval(roopID);
  })

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
    $('#start').show();
    $('#auto').show();
  });

  socket.on('start', () => {
    $('#start').hide();
    $('#auto').hide();
  });
    
  socket.on('result', (name) => {
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
    $('#child').text('stop');
    $('#parent').text('watch');
  });

//======================================================================================================
// ローカル関数

  function updateRoop () {
    roopID = setInterval(() => {
      $('#hideTime').text(hide);
      $('#distance').text(mydist);
      $('#watchCount').text(watch);
      $('#parent').text(hidef? 'hide':'watch');
      if(!hidef){
        if($('#child').text() === 'move'){$('#child').text('out')}
      }
      console.log(hide, mydist, watch, win, hidef);
    },1000/30);
  }
});