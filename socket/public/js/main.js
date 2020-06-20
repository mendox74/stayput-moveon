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
  let roomId;
  let list;

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
    if(!roopFlg){
      updateRoop();
      displayDelete();
    };
    roopFlg = true;
  });

  $('#logout').on('click', () => {
    socket.emit('logout');
    roopFlg = false;
    clearInterval(roopID);
    displayDelete();
    roomId = undefined;
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
  socket.on('update', (hideTime, watchCount , menbarList, winner, hideFlg, id) =>{
    hide = hideTime;
    watch = watchCount;
    mydist = menbarList[socket.id].distance;
    win = winner;
    hidef = hideFlg;
    roomId = id;
    list = menbarList;
  })

  socket.on('connect', () => {
    userName = prompt('ユーザー名を入力してください');
    if(!userName) {userName = '匿名';}
    $('#myName').text(userName + '：');
    socket.emit('setUserName', userName);
  });

  socket.on('disconnect', () =>{
    roopFlg = false;
    clearInterval(roopID);
    roomId = undefined;
  })

  socket.on('roomMenber', (menberName) => {
    $('#roomMenber').text(menberName);
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

  socket.on('remove player', (name) => {
    $('#' + name + '').remove();
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
      $('#watchCount').text(watch);
      $('#roomNumber').text(roomId);

      $('#parent').text(hidef? 'hide':'watch');
      if(!hidef){
        if($('#child').text() === 'move'){$('#child').text('out')}
      }

    let playerList = $('#player').children();
    if(list){
      Object.keys(list).forEach((id) => {
        if(id === socket.id){
          $('#distance').text(list[id].distance);
        } else {
          if(!$('#' + list[id].name).length){
            $('#player').append('<div id="' + list[id].name + '"><span>' + list[id].name + '：</span><span id="' + list[id].name + 'distance"></span></div>');
          }
          $('#' + list[id].name + 'distance').text(list[id].distance);
        }
      });
    }
      console.log(hide, mydist, watch, win, hidef, playerList);
    },1000/30);
  }

  function displayDelete () {
    $('#watchCount').text('');
    $('#hideTime').text('');
    $('#distance').text('');
    $('#roomNumber').text('');
    $('#roomMenber').text('');
    $('#player').empty()
    $('#start').hide();
    $('#auto').hide();
  };
});