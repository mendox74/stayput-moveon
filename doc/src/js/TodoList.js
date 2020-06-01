import React, { useState, useRef, useEffect } from "react";

function Moveon(e) {
  const defaultDistance = 400;
  const [distance, setDistance] = useState(defaultDistance);
  const [delay, setDelay] = useState(10);
  const [moveFlg, setMoveFlg] = useState(false);
  const [childStatus, setChildStatus] = useState('STAY!');

  useEffect(() => {
    if(e.resetFlg){
      setMoveFlg(false);
      setChildStatus('STAY!');
      setDistance(defaultDistance);
    }
  },[e.resetFlg])

  useEffect(() => {
    if(e.startFlg){
      if(distance === 0){
        setChildStatus('TOUCH');
        e.setStartFlg(false);
      } else {
        if(moveFlg){
          if(e.parentFlg){
            setTimeout(() => setDistance(distance -1), delay);
          } else {
            setChildStatus('OUT!')
            setDistance(defaultDistance)
          }
        }
      }
    }
  },[distance, moveFlg]);

  function childMove(state, flg) {
    if(distance !== 0 && e.startFlg){
      setChildStatus(state);
      setMoveFlg(flg);
    }
  }

  return (
    <div>
      <div>{distance}</div>
      <button 
      onMouseDown={() => childMove('MOVE!', true)} 
      onMouseUp={() => childMove('STAY!', false)} 
      onMouseOut={() => childMove('STAY!', false)}>{childStatus}</button>
    </div>
  );
}

function Parent(e) {
  const [parentFlg, setParentFlg] = useState(true);
  const [parentStatus, setParentStatus] = useState('HIDE');
  const [hideTime, setHideTime] = useState(1500);
  const [randomDelay, setRandomDelay] = useState(500 + Math.floor(Math.random() * 3500));
  const [watchCount, setWatchCount] = useState(8);
  const refId = useRef();

  useEffect(() => {
    if(e.resetFlg){
      setParentFlg(true);
      setParentStatus('HIDE');
      setHideTime(1500);
      setWatchCount(8);
    }
  },[e.resetFlg])

  useEffect(() => {
    if(e.startFlg){
      setRandomDelay(500 + Math.floor(Math.random() * 3500));
      console.log(parentFlg, randomDelay);
      refId.current = setTimeout(() => {
      changeParentStatus();
      }, randomDelay);
    } else {
      clearInterval(refId.current);
    }
  },[parentFlg, e.startFlg])

  useEffect(() => {
    if(e.startFlg){
      if(hideTime === 0){
        setParentStatus('PROTECT')
        e.setStartFlg(false);
      } else {
        if(parentFlg){
          setTimeout(() => {setHideTime(hideTime -1);}, 10);
        }
      }
    }
  },[hideTime, parentFlg, e.startFlg]);

  function changeParentStatus() {
    if(watchCount > 0 && e.startFlg){
      setParentFlg(!parentFlg);
      setParentStatus(parentFlg ? 'WATCH': 'HIDE');
      parentFlg ? setWatchCount(watchCount -1): null;
    }
  }

  return<div>
    <div>{watchCount}</div>
    <div>{hideTime}</div>
    <Moveon 
    parentFlg={parentFlg} 
    startFlg={e.startFlg} resetFlg={e.resetFlg}
    setStartFlg={() => e.setStartFlg()}/>
    <div>{parentStatus}</div>
  </div>
}

function Game() {
  const [startFlg, setStartFlg] = useState(false);
  const [resetFlg, setResetFlg] = useState(true);

  function start() {
    setStartFlg(true);
    setResetFlg(false);
  }
  function reset() {
    setStartFlg(false);
    setResetFlg(true);
  }

  return<div>
    <Parent 
    startFlg={startFlg} resetFlg={resetFlg}
    setStartFlg={() => setStartFlg()}/>
    <button onClick={() => start()}>実行</button>
    <button onClick={() => reset()}>リセット</button>
  </div>
}

export default class TodoList extends React.Component {
  render() {
    return <div>
      <Game />
    </div>;
  };
}