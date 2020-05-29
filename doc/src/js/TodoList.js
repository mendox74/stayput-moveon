import React from "react";
import { observer } from "mobx-react";

@observer
export default class TodoList extends React.Component {
  start() {
    console.log('OK');
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
    const defaultDistance = 400;
    const defaultHideTime = 1500;
    const defaultWatchCount = 8;
    const status = {};
    let watchCount;
    let random;
    let moveFlg = false;
    let endFlg;
    let checkID;
    let moveID;
    let hideID;
    let child = 'statue';
    let parent = 'hide';

    return <div>
      <div id="watchCount"></div>
      <div id="hideTime"></div>
      <div id="distance"></div>
      <div><button id="child">{child}</button></div>
      <div id="parentStatus" name="watch">{parent}</div>
      <div id="parentStatus" name="hide" hidden>{parent}</div>
      <div><button id="start" onClick={this.start.bind()}>実行</button></div>
    </div>;
  };
}