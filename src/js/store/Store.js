export default class Store {
  constructor() {
    this.state = {};
    this.subscribers = {};
  }

  getState(state) {
    return this.state[state];
  }

  setState(state, value) {
    this.state[state] = value;
  }

  clearState(state) {
    if (Array.isArray(this.state[state])) this.state[state] = [];
    else this.state[state] = null;
  }
}
