import { computed, observable } from "mobx";

class StatusStore {
  defaultDistance = 400;
  defaultHideTime = 1500;
  defaultWatchCount = 6;
  @observable status = {hideTime:400, distance:1500};
  @observable watchCount = 8;
  @observable random;
  @observable moveFlg = false;
  @observable endFlg;
  @observable checkID;
  @observable moveID;
  @observable hideID;
  @observable child = 'statue';
  @observable parent = 'hide';
  start() {
    random = 500 + Math.floor(Math.random() * 2500);
    checkID = setTimeout(getStart, random);
  }
  countDown() {
    this.status.hideTime -= 1
  }

}

class Todo {
  @observable value
  @observable id
  @observable complete

  constructor(value) {
    this.value = value;
    this.id = Date.now();
    this.complete = false;
  }
}

class TodoStore {
  @observable todos = [];
  @observable filter = "";
  @computed get filteredTodos() {
    var matchesFilter = new RegExp(this.filter, "i");
    return this.todos.filter(todo => !this.filter || matchesFilter.test(todo.value));
  }
  createTodo(value) {
    this.todos.push(new Todo(value));
  }
  clearComplete = () => {
    const incompleteTodos = this.todos.filter(todo => !todo.complete);
    this.todos.replace(incompleteTodos);
  }
}

let store = new StatusStore();

export default store;