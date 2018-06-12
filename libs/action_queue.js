
const ws_gobal_queues = new WeakMap();
const WS_gobal_actions = new WeakMap();
/**
 * 消息队列，通过行为状态来决定执行哪个回调函数，
 * TODO：改造成系统每次都执行一次行为队列的执行函数，
 * 在元素中创建一个行为并把它放进全局行为管理器中，然后通过调用函数就可以控制行为的状态
 */
export default class ActionQueue {
  // 先执行各个状态的函数，如果状态改变就把它移入新的状态集中
  constructor() {
    ws_gobal_queues.set(this, new Map())  // actions: Map
    WS_gobal_actions.set(this, new Map());
  }
  // rockerAction status inShow checked rockered  [1] [1,2] [1,2,3]  
  addAction(a){
    let actions =WS_gobal_actions.get(this);
    if(!actions){
      actions =new Map();
      WS_gobal_actions.set(this, actions);
    }
    //actions.set()
  }
  /**
   * 添加行为监听，{id: <行为的唯一标识符>, type: <行为类型>, state: <监听的状态>, listener: <监听的hi掉函数>}
   * @param {*} o 
   */
  addListener(o){
    //
  }
  removeListener(o){}
  /**
   * 添加行为，添加的行为将不断执行
   */
  add(a) {
    let actions = ws_gobal_queues.get(this)
    if (!actions) {
      actions = new Map()
      ws_gobal_queues.set(this, actions)
    }
    actions.set(a.type, a) // 同类型的行为，新的覆盖旧的
  }
  /**
   * 从行为队列中移除行为
   */
  remove(a) {
    let actions = ws_gobal_queues.get(this)
    if (actions && actions.size > 0) {
      actions.delete(a.type)
    }
  }
  /**
   * TODO：未完成，
   * 改变行为的状态
   */
  change(a){
    //
  }
  /**
   * 处理行为，不提供外部调用，
   * Action: {type: moveTo, state:start|play|pause|stop, callback: {start: fn, ...}, detail: {start: }}
   */
  handle(a) {
    a.callback[a.state](a.detail[a.state])
  }
  /**
   * 执行行为队列中的行为，
   */
  update() {
    let actions = ws_gobal_queues.get(this)
    actions.forEach(this.handle)
  }
}

// nwq Action({});
class Action {
  constructor(a){
    this.id =a.id || 0;
    this.state = 'ready';
    this.playcallback =a.play;
    this.pausecallback =a.pause;
    this.startcallback =a.start;
    this.stopcallback =a.stop;
    this.detail =a.detail;
  }
  /**
   * 只是改变状态，函数执行有队列来管
   */
  start(){
    this.state ='start';
    this.startcallback(this.detail);
    this.play();
  }
  play(){
    this.state ='play';
    this.playcallback(this.detail);
  }
  pause(){
    this.state ='pause';
    this.pausecallback(detail);
  }
  stop(){
    this.state ='stop';
    this.stopcallback(this.detail);
  }
}