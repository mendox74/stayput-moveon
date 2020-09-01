$(function () {
//======================================================================================================
// 変数
  let userName = undefined;
  let icon;
  let color;
  let getRoomId;
  let category = null;
  let roopID;
  let roopFlg  = false;
  let autoModeFlg = true;
  let autoID;
  let autoMoveFlg = false;
  let autoBehavior = true;
  let protect = false;
  let socket = io({autoConnect: false, reconnection: false});

  let hide;
  let hidef;
  let roomId;
  let list = {};
  let endFlg;
  let winner = [];
  let stanbyFlg;
  let stanbyCount;
  let autoFlg = false;
  let ranking = {};

//======================================================================================================
// イベント
  $(window).on('beforeunload', () => {
    socket.close();
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
    userName = $('#userName').text();
    icon = $('option:selected').val();
    color = $('#colorSelect').val();
    category = null;
    if(socket.connected){
      socket.close();
      return;
    }
    socket.io.uri = 'http://localhost:8080';
    socket.open();
  });

  $('#logout').on('click', () => {
    socket.emit('logout');
    socket.close()
    roopFlg = false;
    clearInterval(roopID);
    displayDelete();
    roomId = undefined;
    $('#login').show();
    $('#logout').hide();
  });

  $('#generateRoomId').on('click', () => {
    $.get('generateRoomId', (data) => {
      $('#server').text(data.hostname);
      $('#idResult').text(data.roomId);
    });
  });

  $('#createRoom').on('click', () => {
    userName = $('#userName').text();
    icon = $('option:selected').val();
    color = $('#colorSelect').val();
    getRoomId = $('#idResult').text();
    category = 'create';
    if(!getRoomId){
      alert('RoomIDが作成されていません。');
      return;
    }
    if(socket.connected){
      socket.close();
      return;
    }
    socket.io.url = 'http://localhost:8080';
    socket.open();
  });

  $('#assignRoom').on('click', () => {
    userName = $('#userName').text();
    icon = $('option:selected').val();
    color = $('#colorSelect').val();
    getRoomId = $('#assignRoomId').val();
    category = 'assign';
    if(!getRoomId){
      alert('RoomIDが入力されていません');
      return;
    }
    if(socket.connected){
      socket.close();
      return;
    }
    socket.io.url = 'http://localhost:8080';
    socket.open();
  });

  $('#protect').on('click', () => {
    protect = !protect
    $('#protect').text(protect? 'on': 'off');
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

  $('#colorSelect').on('change', () => {
    $('#iconColor').text($('#colorSelect').val());
  });

  $('#iconColor').text($('#colorSelect').val());

//======================================================================================================
// 通信処理
  socket.on('update', (hideTime, watchC , menbarList, hideFlg, id, end, win, stanbyF, stanbyC, autoF, rank) =>{
    hide = hideTime;
    watchCount = watchC;
    list = menbarList;
    hidef = hideFlg;
    roomId = id;
    endFlg = end;
    winner = win
    stanbyFlg = stanbyF;
    stanbyCount = stanbyC;
    autoFlg = autoF;
    ranking = rank? rank: {};
  })

  socket.on('connect', () => {
    console.log('connect');
      socket.emit('login', category, userName, icon, color, getRoomId, protect);
  });

  socket.on('disconnect', () =>{
    roopFlg = false;
    clearInterval(roopID);
    displayDelete();
    roomId = undefined;
    $('#login').show();
    $('#logout').hide();
  });

  socket.on('success', () => {
    if(!roopFlg){
      updateRoop();
      displayDelete();
    };
    roopFlg = true;
    $('#login').hide();
    $('#logout').show();
  });

  socket.on('connect_error', () => {
    socket.close();
  })

  socket.on('connect_timeout', () => {
    socket.close();
  })

  socket.on('error', () => {
    socket.close();
  })

  socket.on('loginError', () => {
    socket.close();
  })
//======================================================================================================
// ローカル関数

  function updateRoop () {
    roopID = setInterval(() => {
      if($('#hideTime').text() !== String(hide)){
        $('#hideTime').text(hide);
      }
      if($('#watchCount').text() !== String(watchCount)){
        $('#watchCount').text(watchCount);
      }
      if($('#roomNumber').text() !== String(roomId)){
        $('#roomNumber').text(roomId);
      }
      if($('#autoFlg').text() !== String(autoFlg)){
        $('#autoFlg').text(autoFlg);
      }

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

      let rankText = '';
      let entryText = ''
      if(Object.keys(ranking).length){
        Object.keys(ranking).forEach(id => {
          rankText += list[id].name + ':' + ranking[id];
        });
        entryText = Object.keys(ranking).length;
      }
      if($('#ranking').text() !== rankText){
        $('#ranking').text(rankText);
      }
      if($('#entry').text() !== entryText){
        $('#entry').text(entryText);
      }

      if(stanbyFlg){
        if($('#stanbyCount').text() !== String(stanbyCount)){
          $('#stanbyCount').text(stanbyCount);
        }
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
        if($('#roomMenber').text() !== String(playerName)){
          $('#roomMenber').text(playerName);
        }
        idList = Object.keys(list);

        idList.forEach((id) => {
            if(!$('#' + id).length){
              $('#player').append('<div id="' + id + '"><span>' + list[id].name + '：</span><span id="' + id + 'distance"></span><span id="' + id + 'join"></span><span id="' + id + 'watcher"></span></div>');
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
      } else {
        if($('#winner').text() !== ''){$('#winner').text('')}
        if(list){
          idList.forEach((id) => {
            if($('#' + id + 'distance').text() !== String(list[id].distance)){
              $('#' + id + 'distance').text(list[id].distance);
            }
            if($('#' + id + 'join').text() !== String(list[id].join)){
              $('#' + id + 'join').text(list[id].join);
            }
            if($('#' + id + 'watcher').text() !== String(list[id].watcher)){
              $('#' + id + 'watcher').text(list[id].watcher);
            }
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