import React from "react";
import { observer } from "mobx-react";

@observer
export default class TodoList extends React.Component {
  start() {
    console.log('ok');
  }

  moveOn() {
    // this.props.moveID = setInterval(() => {
    //   console.log('ok');
    // },100);
  }

  createNew(e) {
    if (e.which === 13) {
      this.props.store.createTodo(e.target.value);
      e.target.value = "";
    }
  }

  filter(e) {
    this.props.store.filter = e.target.value;
  }
  toggleComplete(todo) {
    todo.complete = !todo.complete;
  }

  changeStatus(status) {
    status = !status;
  }

  render() {
    const {child, parent, status, watchCount} = this.props.store;
    console.log(this.props.store);
    let random;
    let moveFlg = false;
    let endFlg;
    let checkID;
    let moveID;
    let hideID;

    return <div>
      <div id="watchCount">{watchCount}</div>
      <div id="hideTime">{status.hideTime}</div>
      <div id="distance">{status.distance}</div>
      <div><button id="child" onMouseDown={this.moveOn.bind()}>{child}</button></div>
      <div id="parentStatus" name="watch">{parent}</div>
      <div id="parentStatus" name="hide" hidden>{parent}</div>
      <div><button id="start" onClick={this.start()}>実行</button></div>
    </div>;
  };
}