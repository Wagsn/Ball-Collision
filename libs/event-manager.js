
import Point from '../src/base/point'

const ws_gobal_events = new WeakMap()  // 全局事件集，可以添加到 databus

/**
 * 游戏全局事件管理器，（事件是瞬时发生的），
 * 维护事件队列，当发生某个事件时，在事件队列中注入事件type及其附带信息，
 * 如果事件发生则调用事件处理器，
 * 依赖于 weapp-adapter.js 需要在其后面 import，
 */
export default class EventManager{
  constructor(){
    console.log('In EventManager.Constructor')
    this.targets = new WS_EventTarget()
    this.events = []  // events: [move: {type: player_move_normal, direction: 3.14}]
    // 格式：register:{type:'btn_checked',wrap:fn,events:['touchstart','touchend'],callback:{touchstart:fn,touchend:fn},detail:{lastTouch:{x,y}}}
    let register =
    {
      type:'btn_checked',
      wrap:(e)=>{},
      events:['touchstart','touchend'],
      callback:{
        touchstart:(e)=>{},
        touchend:(e)=>{}
      },
      detail:{
        lastTouch:{
          x: 10,
          y: 10
        }
      }
    }
    this.registers = []  // 事件登记表
    // this.responses = new Map()  // 响应事件表，每种响应类型（events中的type） 作为key
    this.initEvent()  // 将自定义事件绑定在系统事件上
  }
  /**
   * 供外部调用，
   * 添加事件监听器
   */
  addListener(type, listener){
    this.targets.addEventListener(type, listener)
  }
  /**
   * 供外部调用
   * 移除事件监听器
   */
  removeListener(type, listener){
    this.targets.removeEventListener(type, listener)
  }
  /**
   * 不提供外部调用
   * 将自定义事件处理器绑定到 canvas 上，TODO：这些事件都是仅调用一次回调函数
   */
  initEvent() {
    //将 touchstart 事件交由后面传入的 handler 函数执行， e 表示为事件及其所携带的数据
    canvas.addEventListener('touchstart', this.eventHandlerFactory('touchstart'))
    canvas.addEventListener('touchmove', this.eventHandlerFactory('touchmove'))
    canvas.addEventListener('touchend', this.eventHandlerFactory('touchend'))
    // wx.onTouchCancel(this.eventHandlerFactory('touchcancel'))
  }
  /**
   * 提供外部调用，
   * 事件登记，传入登记表（包含类型以及触发规则），
   * 格式：register:{type:'btn_checked',wrap:(e)=>{},reason:{events:['touchstart','touchend'],callback:{touchstart:fn,touchend:fn},detail:{lastTouch:{x,y}}}}
   * TODO：将不同的触发事件分成各个数组，每次遇到触发事件调用回调函数，trigger，action，
   */
  login(register){
    // TODO: 安全检测，相同（type）事件不可重复登记
    this.registers.push(register)
  }
  /**
   * 提供外部调用，
   * 移除此（type）类型事件（event）的登记（register）
   */
  logout(type){
    for(let i= this.registers.length - 1; i>-1; i-- ){
      if (registers[i].type === type) {
        registers.splice(i, 1)
        break
      }
    }
  }
  /**
   * 不提供外部调用，
   * 根据系统事件（sys event）返回本地事件集（local events），
   * 利用事件注册表（registers[]）判定事件的发生，
   * 事件的链式触发，如：touch=>rocker_checked=>player_move_normal（原有逻辑是两个事件分别判断是否被touch事件触发），
   * 注意：不能创建循环触发事件，即A被B触发而B又A触发，
   * e: WS_Event
   */
  response(e) { // 传入触发事件 WS_Event 
    let events = [] // 被触发事件集
    events.push(e) // 将传入事件装入触发事件集
    // 遍历登记表，计算被传入事件触发的事件，
    // TODO：将触发事件分组，如：registers[e.type]: [Register,Register,Register]表示响应e.type事件的register数组
    // registers: {touchmove: [Register], touchend: [], ...}
    // registers
    //this.registers[e.type].forEach((item)=>{})
    this.registers.forEach((item) => { // item 表示各个 register
      // 如果存在触发事件的判定函数，且判定函数返回值为true（表示该登记表的事件被触发）
      
      if (item.callback[e.type] !== undefined && item.callback[e.type](e)) { // 判断事件是否被触发
        let event = new WS_Event(item.type, e)
        // 增加附带信息
        item.wrap(event)
        //console.log(event)
        // 调用响应函数收集被该事件触发的事件集
        let inner_events = this.response(event)
        for (let i = inner_events.length; i > -1; i--) {
          events.push(inner_events[i])
        }
        inner_events = null
      }
    })
    return events
  }
  /**
   * 不提供外部调用
   * 事件处理工厂函数，
   * 系统事件和本地事件的连接器与缓冲区
   */
  eventHandlerFactory(type) { // 返回一个 event handler 函数
    return (e) => {
      // TODO：这里可以取消掉，直接在response中完成所有封装
      let event = new WS_Event(type, e)  // 根据原生 event 封装自己的 event, 

      // let events = this.wrapEvent(type, event)  // TODO: 根据原生事件可能产生多个本地事件
      let events = this.response(event) // 自己的事件
      //console.log(events)
      events.forEach((item)=>{
        this.targets.dispatchEvent(item)
      })
    }
  }
}
/**
 * 事件封装
 */
class WS_Event{
  constructor(type, e){  // e 是系统事件
    this.target = window.canvas
    this.currentTarget = window.canvas
    this.touches = e.touches
    this.targetTouches = Array.prototype.slice.call(e.touches)
    this.changedTouches = e.changedTouches
    this.timeStamp = e.timeStamp

    this.type = type
  }
}

/**
 * 不提供外部创建，
 * 唯一的事件监听管理器：
 * 用于为某type事件添加、删除、唤醒事件监听器
 */
class WS_EventTarget { // 此类型的事件集
  constructor() {
    ws_gobal_events.set(this, {}) // 在全局事件集中注入本事件集，当本对象被销毁时，其关联的事件集也会被回收，加快回收速度
  }
  /**
   * 添加type类型的事件listener
   */
  addEventListener(type, listener) {
    //
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

    let events = ws_gobal_events.get(this) 

    if (!events) {
      events = {}
      ws_gobal_events.set(this, events)
    }
    if (!events[type]) {
      events[type] = [] // 一个type事件一个监听器集
    }
    events[type].push(listener)

    if (options.capture) {
      console.warn('EventTarget.addEventListener: options.capture is not implemented.')
    }
    if (options.once) {
      console.warn('EventTarget.addEventListener: options.once is not implemented.')
    }
    if (options.passive) {
      console.warn('EventTarget.addEventListener: options.passive is not implemented.')
    }
  }
  /**
   * 移除type类型的事件listener
   */
  removeEventListener(type, listener) {
    let listeners = ws_gobal_events.get(this)[type]  // 获取type事件的监听者集

    if (listeners && listeners.length > 0) {
      for (let i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1)
          break
        }
      }
    }
  }
  /**
   * 唤醒type事件的监听者，需要传入event(事件，包含type以及监听者处理事件所需的参数)
   */
  dispatchEvent() {
    let event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

    let listeners = ws_gobal_events.get(this)[event.type]

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event)
      }
    }
  }
}