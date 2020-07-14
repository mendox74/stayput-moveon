$(function () {
//======================================================================================================
// 変数
  let roopID;
  let roopFlg  = false;
  let autoModeFlg = true;
  let autoID;
  let autoMoveFlg = false;
  let autoBehavior = true;
  let socket = io();

  let hide;
  let hidef;
  let roomId;
  let list;
  let endFlg;
  let winner = [];
  // let watchWin;
  // let touchWin;
  let stanbyFlg;
  let stanbyCount;

//======================================================================================================
// イベント
  $(window).on('beforeunload', () => {
    socket.disconnect();
  });

  $('#auto').click(() => {
    socket.emit('auto');
  });

  $('#autoMode').click(() => {
    autoModeFlg = !autoModeFlg;
    $('#autoMode').text(autoModeFlg? 'on':'off')
  });

  $('#join').click(() => {
    socket.emit('join');
  });

  $('#nameChange').on('click', () => {
    $('#userName').text(prompt('ユーザー名を入力してください'));
  });

  $('#login').on('click', () => {
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
    socket.emit('repose');
  }).on('touchstart mousedown', () => {
    $('#child').text(hidef ? 'move':'out');
    socket.emit('behavior');
  }).on('touchcancel mouseout', () => {
    if($('#child').text() === 'mvoe'){
      $('#child').text(hidef ? 'stop':'out');
    }
    socket.emit('repose');
  });

//======================================================================================================
// 通信処理
  socket.on('update', (hideTime, watchC , menbarList, hideFlg, id, end, win, stanbyF, stanbyC) =>{
    hide = hideTime;
    watchCount = watchC;
    list = menbarList;
    hidef = hideFlg;
    roomId = id;
    endFlg = end;
    winner = win
    // watchWin = watch;
    // touchWin = touch;
    stanbyFlg = stanbyF;
    stanbyCount = stanbyC;
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
      $('#watchCount').text(watchCount);
      $('#roomNumber').text(roomId);

      if(!hidef){
        if($('#child').text() === 'move'){$('#child').text('out')}
      }
      
      if(!endFlg){
        if($('#auto').is(':hidden')){
          $('#auto').show();
        };
      } else {
        if($('#auto').is(':visible')){
          $('#auto').hide();
        };
      }

      if(stanbyFlg){
        $('#stanbyCount').text(stanbyCount);
      } else {
        if($('#stanbyCount').text() !== ''){
          $('#stanbyCount').text('');
        }
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
            if(!$('#' + id).length){
              $('#player').append('<div id="' + id + '"><span>' + list[id].name + '：</span><span id="' + id + 'distance"></span></div>');
            }
        });
        playerList.forEach((e) =>{
          if(idList.indexOf(e) === -1){
            $('#' + e).remove()
          };
        });
      }

      // 勝利判定
      if(winner.length){
        if($('#winner').text() === ''){
          $('#winner').text(winner[0] + ':' + winner[1]);
        }
        $('#child').text('stop');
      } else {
        if($('#winner').text() !== ''){$('#winner').text('')}
        if(list){
          idList.forEach((id) => {
              $('#' + id + 'distance').text(list[id].distance);
          });
        }
      }

      // オートモード制御
      if(autoModeFlg){
        if(endFlg){
          if(Object.keys(list).filter((e) => {return list[e].join === true}).length >= 1){
            if(!list[socket.id].join){
              socket.emit('join');
            }
          }
        } else {
          if(!list[socket.id].watcher){
            if(hidef){
              if(!autoMoveFlg){
                autoMoveFlg = true;
                randTime = 1 + Math.floor(Math.random() * 1000);
                autoID = setTimeout(autoMove,randTime);
              }
            } else {
              if(autoMoveFlg){
                autoMoveFlg = false;
                clearInterval(autoID);
                if(!autoBehavior){
                  socket.emit('repose');
                  autoBehavior = !autoBehavior;
                }
              }
            }
          }
        }
      }

      // console.log(hide, mydist, watch, hidef, playerList, playerName);
    },1000/30);
  }

  function autoMove () {
    autoMoveFlg = false;
    if(autoBehavior){
      socket.emit('behavior');
    } else {
      socket.emit('repose');
    }
    autoBehavior = !autoBehavior;
  }

  function displayDelete () {
    $('#watchCount').text('');
    $('#hideTime').text('');
    $('#winner').text('');
    $('#distance').text('');
    $('#roomNumber').text('');
    $('#roomMenber').text('');
    $('#player').empty()
    $('#auto').hide();
  };
});