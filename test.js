$(function() {
  const defaultDistance = 400;
  const defaultHideTime = 1500;
  const defaultWatchCount = 6;
  const status = {};
  let watchCount;
  let random;
  let moveFlg = false;
  let endFlg;
  let checkID;
  let moveID;
  let hideID;

  function getStart () {
    random = 500 + Math.floor(Math.random() * 2500);
    checkID = setTimeout(getStart, random);
    $('#parentStatus[name="watch"]').toggle();
    $('#parentStatus[name="hide"]').toggle();
    if($('#parentStatus[name="hide"]').is(':visible')){
      hideID = setInterval(() => {
        countdown(status.hideTime -1, 'hideTime', 'protect');
      }, 10);
      if(watchCount === 0){
        clearInterval(checkID);
      }
    } else {
      watchCount -= 1;
      $('#watchCount').text(watchCount);
      clearInterval(hideID);
    }
    if(moveFlg){
      if($('#parentStatus[name="watch"]').is(':visible')){
        $('#child').text('out');
        console.log('out');
        countdown(defaultDistance, 'distance', 'touch');
        moveFlg = false;
        clearInterval(moveID);
      }
    }
  }

  $('#child').mouseup(() => {
    if(moveFlg){ $('#child').text('statue'); }
      moveFlg = false;
      clearInterval(moveID);
  }).mousedown(() => {
    if(endFlg)return;
    if($('#parentStatus[name="watch"]').is(':visible')){
      $('#child').text('out'); 
      console.log('out');
      countdown(defaultDistance, 'distance', 'touch');
      moveFlg = false;
      clearInterval(moveID);
    } else {
      $('#child').text('move');
      moveFlg = true;
      moveID = setInterval(() => {
        countdown(status.distance -1, 'distance', 'touch');}, 10);
    }
  }).mouseout(() => {
    if(moveFlg){ $('#child').text('statue'); }
    moveFlg = false;
    clearInterval(moveID);
  });

  function countdown (sub, name, result) {
    status[name] = sub;
    $('#' + name).text(status[name]);
    if(status[name] === 0 ){
      $('#' + name).text('');
      $('#' + name).append('<span>' + result + '</span>');
      clearInterval(moveID);
      clearInterval(hideID);
      clearInterval(checkID);
      $('#parentStatus[name="hide"]').hide();
      $('#parentStatus[name="watch"]').show();
      endFlg = true;
      moveFlg = false;
      $('#start').show();
    }
  }

  $('#start').click(() => {
    endFlg = false;
    watchCount = defaultWatchCount;
    status.hideTime = defaultHideTime;
    status.distance = defaultDistance;
    $('#watchCount').text(watchCount);
    $('#hideTime').text(status.hideTime);
    $('#distance').text(status.distance);
    $('#start').hide();
    getStart();
  });
});