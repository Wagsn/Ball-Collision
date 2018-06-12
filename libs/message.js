
/**
 * 行为类
 */
export default class Action{
  constructor(state, callback, detail){
    this.state =state
    this.callback =callback
    this.detail =detail
  }
}