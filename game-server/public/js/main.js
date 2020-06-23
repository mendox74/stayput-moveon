$(function () {
//======================================================================================================
// 変数
  let roopID;
  let roopFlg  = false;
  let socket = io();

  let hide;
  let hidef;
  let mydist;
  let watch;
  let win;
  let roomId;
  let list;
  let endFlg;

//======================================================================================================
// イベント
  $(window).on('beforeunload', () => {
    socket.disconnect();
  });

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

  $('#nameChange').on('click', () => {
    $('#userName').text(prompt('ユーザー名を入力してください'));
  });

  $('#login').on('click', () => {
    $('#myName').text($('#userName').text() + '：');
    socket.emit('login', $('#userName').text());
    if(!roopFlg){
      updateRoop();
      displayDelete();
    };
    roopFlg = true;
    $('#login').hide();
    $('#logout').show();
  });

  $('#logout').on('click', () => {
    $('#myName').text('');
    socket.emit('logout');
    roopFlg = false;
    clearInterval(roopID);
    displayDelete();
    roomId = undefined;
    $('#login').show();
    $('#logout').hide();
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
  socket.on('update', (hideTime, watchCount , menbarList, winner, hideFlg, id, end) =>{
    hide = hideTime;
    watch = watchCount;
    mydist = menbarList[socket.id].distance;
    win = winner;
    hidef = hideFlg;
    roomId = id;
    list = menbarList;
    endFlg = end;
  })

  socket.on('connect', () => {
    console.log('connect');
  });

  socket.on('disconnect', () =>{
    roopFlg = false;
    clearInterval(roopID);
    roomId = undefined;
  })

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
      
      if(endFlg){
        if($('#start').is(':hidden')){
          $('#start').show();
          $('#auto').show();
        };
      } else {
        if($('#start').is(':visible')){
          $('#start').hide();
          $('#auto').hide();
        };
      }

      // 入室者監視
      let idList;
      let playerList = $('#player').children('div')
      .toArray()
      .map((e) => {
        return $(e).attr('id');
      })
      let playerName;
      if(list){
        playerName = Object.keys(list).map(id => {return list[id].name})
        $('#roomMenber').text(playerName);
        idList = Object.keys(list);

        idList.forEach((id) => {
            if(id !== socket.id && !$('#' + list[id].name).length){
              $('#player').append('<div id="' + list[id].name + '"><span>' + list[id].name + '：</span><span id="' + list[id].name + 'distance"></span></div>');
            }
        });
        playerList.forEach((e) =>{
          if(playerName.indexOf(e) === -1){
            $('#' + e).remove()
          };
        });
      }

      // 勝利判定
      if(win){
        if(win === socket.id){
          if($('#distance').text() !== 'win'){
            $('#distance').text('win');
          }
        } else {
          if($('#' + list[win].name + 'distance').text() !== 'win'){
            $('#' + list[win].name + 'distance').text('win');
          }
        }
        $('#child').text('stop');
        $('#parent').text('watch');
      } else {
        if(list){
          idList.forEach((id) => {
            if(id === socket.id){
              $('#distance').text(list[id].distance);
            } else {
              $('#' + list[id].name + 'distance').text(list[id].distance);
            }
          });
        }
      }
      console.log(hide, mydist, watch, win, hidef, playerList, playerName);
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