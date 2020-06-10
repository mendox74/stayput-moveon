import React, { PureComponent, useState, useEffect } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {transports: ['websocket']} );

function Display() {
  const [watchCount, setWatchCount] = useState();
  const [toucher, setToucher] = useState('STOP');
  const [watcher, setWatcher] = useState('WATCH');
  const [moveFlg, setMoveFlg] = useState(false);
  const [hideFlg, setHideFlg] = useState(false);
  const [watcherResult, setWatcherResult] = useState('');
  const [toucherResult, setToucherResult] = useState('');

  socket.on('watch', (count) => {
    setHideFlg(false);
    setWatchCount(count);
    setWatcher('WATCH');
  });
  socket.on('result', (name) => {
    if(toucher === 'MOVE'){setMoveFlg(false)};
    if(watcher === 'HIDE'){setHideFlg(false)};
    setToucher('STOP');
    setWatcher('WATCH');
    if(name === 'distance'){
      setToucherResult('TOUCHER-WIN');
    } else {
      setWatcherResult('WATCHER-WIN');
    }
  });

  socket.on('hide', () => {
    setWatcher('HIDE');
    setHideFlg(true);
  });
  socket.on('move', () => {
    setToucher('MOVE');
    setMoveFlg(true);
  });
  socket.on('stop', () => {
    if(toucher === 'MOVE'){setMoveFlg(false)};
    setToucher('STOP');
  });
  socket.on('out', () => {
    if(toucher === 'MOVE'){setMoveFlg(false)};
    setToucher('OUT');
  });

  socket.on('set', (hideTime, watchCount) => {
    setToucherResult('');
    setWatcherResult('');
    setWatchCount(watchCount);
    setMoveFlg(false);
    setHideFlg(false);
  });

  socket.on('join', () => {
    setMoveFlg(false);
  })

  socket.on('delete', () => {
    setWatchCount();
  });

  socket.on('result player', () => {
    if(toucher === 'move'){setMoveFlg(false)};
    if(watcher === 'hide'){setHideFlg(false)};
    setToucher('STOP');
    setWatcher('WATCH');
  });

  return (
    <div>
      <HideTime hideFlg={hideFlg}/>
      <div>{watchCount}</div>
      <Distance moveFlg={moveFlg}/>
      <button
        onMouseDown={() => socket.emit('hide')}
        onMouseUp={() => socket.emit('watch')}
      >{watcher}</button>
      <button
        onMouseDown={() => socket.emit('move')}
        onMouseUp={() => socket.emit('stop')}
        onMouseOut={() => socket.emit('stop')}
      >{toucher}</button>
    </div>
  )
}

function Distance(e) {
  const [distance, setDistance] = useState(5000);
  const [moveFlg, setMoveFlg] = useState(false);

  useEffect(() =>{
    console.log('distance');
    if(e.moveFlg){
    setTimeout(() => setDistance(distance - 10), 10);
    }
  },[e.moveFlg, distance]);

  socket.on('distance', (count) => {
    setDistance(count);
  });
  socket.on('move', (count) => {
    setDistance(count);
  });
  socket.on('stop', (count) => {
    setDistance(count);
  });
  socket.on('join', (count) => {
    setDistance(count);
  });
  socket.on('delete', () => {
    setDistance();
  });
  return(
  <div>{distance}</div>
  )
}

function HideTime(e) {
  const [hideTime, setHideTime] = useState();
  const [hideFlg, setHideFlg] = useState(false);

  useEffect(() => {
    console.log('hideTime');
    if(e.hideFlg){
    setTimeout(() => setHideTime(hideTime - 10), 10);
    }
  },[e.hideFlg, hideTime]);

  socket.on('hideTime', (count) => {
    setHideTime(count);
  });
  socket.on('delete', () => {
    setHideTime();
  });
  socket.on('set', (count) => {
    setHideTime(count);
  });

  return(
  <div>{hideTime}</div>
  )
}


function Join() {
  const [player, setPlayer] = useState(['test']);

  socket.on('add player', (name) => {

  });
  socket.on('remove player', (name) => {

  });
  socket.on('player', (name,distance) => {

  });
  socket.on('result player', (name) => {

  });

  return
}

function Room() {
  const [userName, setUserName] = useState('hitoshi');
  const [roomNumber, setRoomNumber] = useState('10');
  const [roomMenber, setRoomMenber] = useState();

  useEffect(() => {
    console.log('room');
  });

  socket.on('roomNumber', (key) => {
    setRoomNumber(key);
  });
  socket.on('roomMenber', (menber) => {
    setRoomMenber(menber);
  });
  socket.on('myName', (userName) => {
    setUserName(userName);
  });
  socket.on('delete', () =>{
    setRoomMenber();
    setRoomNumber();
  });

  return(
    <div>
      <div >{userName}</div>
      <div >{roomMenber}</div>
      <div >{roomNumber}</div>
    </div>
  )
}

export default class App extends PureComponent {
  constructor() {
    super();
  }

  render() {
    socket.on('connect', () => {
      socket.emit('setUserName');
    })
    return (
      <div>
          <Display />
          <button onClick={() => socket.emit('start')}>START</button>
          <button onClick={() => socket.emit('auto')}>AUTO</button>
          <button onClick={() => socket.emit('reset')}>RESET</button>
          <button onClick={() => socket.emit('join')}>JOIN</button>
          <Room />
          <button onClick={() => socket.emit('login')}>IN</button>
          <button onClick={() => socket.emit('logout')}>OUT</button>
      </div>
    );
  }
}
