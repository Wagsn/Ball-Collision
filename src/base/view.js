import DataBus from "../databus";
import Point from "./point";

let databus =new DataBus();

const __ ={
  text: Symbol('text')
}

/**
 * 在屏幕上显示的单元，TODO：子视图只能再父视图之内显示，父视图不可见时，子视图不可以被点击
 */
export default class View {
  constructor(o=null){
    o===null ? this.init({}) : this.init(o);
    // click_register
    let click_reg = { 
      type: 'view_click',
      wrap: (e) => {  // 当发生点击事件时这个函数才会被调用
        // 点击事件产生的view id
        e.viewId = this.id;
        console.log('View click event launcher, the id is: '+this.id);
      },
      events: ['touchstart', 'touchend'],
      callback: {
        touchstart: (e) => {  // 我实在想不明白，当按下一个手指没动之后再按下一个手指还会触发第一个手指的touchmove事件
          console.log('click_register ==> touchstart');
          // 如果当前视图或其存在的父视图不可见，该视图将不产生点击事件，TODO：优化视图事件树，避免每个视图都自己判断是否产生点击事件
          if( !this.visible || (this.parent != null && !this.parent.visible)) {
            return false;
          }
          if(click_reg.detail.touchId === -1){  // 首次按下
            // 如果点击到该view便记录该touchId，最先点击到该view的作为本次有效点击，TODO：允许多个点击事件同时发生在该view上
            if (Point.inRect(e.changedTouches[0].clientX,e.changedTouches[0].clientY, (this.parent !== null ? this.sx+this.parent.sx : this.sx), (this.parent !== null ? this.sy+this.parent.sy : this.sy), this.sw, this.sh)) {
              click_reg.detail.touchId = e.changedTouches[0].identifier; 
              this.color =this.onColor
            }
          }
          return false;
        },
        touchend: (e) => {
          console.log('click_register ==> touchend');
          // 之前按这个view的手指抬起，相等表示刚才点击该view的手指离开屏幕
          if(e.changedTouches[0].identifier === click_reg.detail.touchId){  
            click_reg.detail.touchId = -1;  // 复位
            this.color =this.dfColor
            // 点击事件产生
            if (Point.inRect(e.changedTouches[0].clientX,e.changedTouches[0].clientY, (this.parent !== null ? this.sx+this.parent.sx : this.sx), (this.parent !== null ? this.sy+this.parent.sy : this.sy), this.sw, this.sh)) {
              return true;
            }
          }
          return false;
        }
      },
      detail: {
        touchId: -1,
      }
    }
    databus.eventManager.login(click_reg) 
    this.initEvent();
  }
  
  /**
   * 初始化
   * @param {*} o 
   */
  init(o){
    // 全局唯一标识符
    this.id =o.id || 0;
    // 可见性
    this.visible =o.visible || true;
    // 在屏幕上的显示区域
    this.sx =o.sx || 0;
    this.sy =o.sy || 0;
    this.sw =o.sw || 0;
    this.sh =o.sh || 0;
    // 背景颜色
    this.dfColor =o.dfColor || '#00FF80';  // 默认颜色
    this.onColor =o.onColor || '#FF5983';  // 按下颜色
    this.color =this.dfColor
    // 文字
    this.hasText = o.text !== undefined // 如果不想显示文字，将其改成false
    this[__.text] = o.text || 'start'  // this[__.text]
    this.textColor = 'black'

    this.parent = o.parent || null 
    // 子view
    this.childs =[]
  }
  /**
   * 添加子view
   * @param {View} v 
   */
  addChild(v) {
    v.parent = this;
    this.childs.push(v);
  }
  /**
   * 移出子view
   * @param {View} v 
   */
  removeChild(v){
    let view = this.childs.remove(v)  // let i =indexof(v) -> let view =splice(i, 1)
    view.parent =null;
    return view;
  }
  set text(v){
    this.hasText =true;
    this[__.text] = v;
  }
  get text(){
    return this[__.text];
  }
  /**
   * 
   * @param {Function} listener 
   */
  addClickListener(listener){
    databus.eventManager.addListener('view_click', ((e)=>{
      if (e.viewId === this.id) {
        listener(e);  
      }
    }).bind(this));
  }
  /**
   * 时间初始化
   */
  initEvent(){}
  /**
   * 在屏幕上绘制自身，如果parent存在，则相对于parent绘制，不存在则相对于整个屏幕
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx){
    if (!this.visible) { return }  // 不可见
    // 实际显示区域
    let sx =this.sx, sy =this.sy;
    if (this,this.parent !== null) {
      sx += this.parent.sx;
      sy += this.parent.sy;
    }
    // 先画自身
    ctx.fillStyle = this.color;//填充颜色,默认是黑色
    ctx.fillRect(sx, sy, this.sw, this.sh);
    if (this.hasText) {
      ctx.font = '20px serif';
      ctx.fillStyle = this.textColor
      ctx.textAlign = 'center'
      ctx.fillText(this[__.text], sx + this.sw / 2, sy + this.sh / 2)
    }
    // 再画子view
    this.childs.forEach(((item)=>{
      item.drawTo(ctx);
    }).bind(this));
  }
}