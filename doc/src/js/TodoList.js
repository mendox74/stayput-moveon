import React from "react";
import { observer } from "mobx-react";

@observer
export default class TodoList extends React.Component {
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
    
    // const { clearComplete, filter, filteredTodos, todos } = this.props.store;

    // const todoList = filteredTodos.map(todo => (
    //   <li key={todo.id}>
    //     <input type="checkbox" onChange={this.toggleComplete.bind(this, todo)} value={todo.complete} checked={todo.complete} />{todo.value}
    //   </li>
    // ));
    return <div>
      <div id="watchCount"></div>
      <div id="hideTime"></div>
      <div id="distance"></div>
      <div><button id="child">statue</button></div>
      <div id="parentStatus" name="watch">watch</div>
      <div id="parentStatus" name="hide" hidden>hide</div>
      <div><button id="start">実行</button></div>
    </div>;
  };
}