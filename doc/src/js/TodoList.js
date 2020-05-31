import React, { useState, useRef, useEffect } from "react";

function Moveon(parentFlg) {
  const [distance, setDistance] = useState(400);
  const [delay, setDelay] = useState(10);
  const [moveFlg, setMoveFlg] = useState(false);
  const [childStatus, setChildStatus] = useState('STAY!');

  useEffect(() => {
    console.log('useEffect');
    if(distance === 0){
      setChildStatus('CHILD-WIN');
    } else {
      if(moveFlg){
        if(parentFlg.parentFlg){
          setTimeout(() => setDistance(distance -1), delay);
        } else {
          setChildStatus('OUT!')
          setDistance(400)
        }
      }
    }
  },[distance, moveFlg]);

  function childMove(state, flg) {
    if(distance !== 0 ){
      setChildStatus(state);
      setMoveFlg(flg);
    }
  }

  function onMouseDown() {
    console.log('down');
    childMove('MOVE!', true);
  }
  function onMouseUp() {
    console.log('up');
    childMove('STAY!', false);
  }
  function onMouseOut() {
    console.log('out');
    childMove('STAY!', false);
  }

  return (
    <div>
      <div>{distance}</div>
      <button 
      onMouseDown={() => onMouseDown()} 
      onMouseUp={() => onMouseUp()} 
      onMouseOut={() => onMouseOut()}>{childStatus}</button>
    </div>
  );
}

function Parent() {
  const [parentFlg, setParentFlg] = useState(true);
  const [parentStatus, setParentStatus] = useState('HIDE');
  const [hideTime, setHideTime] = useState(1500);
  const [randomDelay, setRandomDelay] = useState(500 + Math.floor(Math.random() * 3500));
  const [watchCount, setWatchCount] = useState(8);

  useEffect(() => {
    setRandomDelay(500 + Math.floor(Math.random() * 3500));
    console.log(parentFlg, randomDelay);
    setTimeout(() => {
      changeParentStatus();
    }, randomDelay);
  },[parentFlg])

  useEffect(() => {
    if(hideTime !== 0){
      if(parentFlg){
        setTimeout(() => {setHideTime(hideTime -1);}, 10);
      }
    } else {
      setParentStatus('PARENT-WIN')
    }
  },[hideTime, parentFlg]);

  function changeParentStatus() {
    if(watchCount !== 0){
      setParentFlg(!parentFlg);
      setParentStatus(parentFlg ? 'WATCH': 'HIDE');
      parentFlg ? setWatchCount(watchCount -1): null;
    }
  }

  return<div>
    <div>{watchCount}</div>
    <div>{hideTime}</div>
    <Moveon parentFlg={parentFlg} />
    <div>{parentStatus}</div>
  </div>
}


export default class TodoList extends React.Component {

  start() {
    console.log('ok');
  }

  render() {
    return <div>
      <Parent />
      <div><button id="start" onClick={() => this.start()}>実行</button></div>
    </div>;
  };
}