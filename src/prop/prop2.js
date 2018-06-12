

import Point from '../base/point'
import DataBus from '../databus'
import Util from '../util/util';


let w = window.innerWidth
let h = window.innerHeight

let databus = new DataBus()
const TAU = 2 * Math.PI;

export default class Prop {

  constructor() {
    // 坐标
    this.r = 20;
    this.color = "#000";
    // 选中标志位
    this.check = 0;

    this.touchstart =false;

    // 事件监听初始化
    this.initEvent();
  }
  init(o) {
    // 坐标
    this.id = o.id;
    this.x = o.x;
    this.y = o.y;
    // 半径
    this.r = o.r;
    switch (o.type) {
      case 'wall':
        this.color = '#ffcc99'
        break;
      case 'iron':
        this.color = '#99ff00'
        break;
      case 'flat':
        this.color = '#ff6600'
        break;
      default:
        this.color = '#cc33cc'
        break;
    }
  }

  /**
   * 逻辑刷新
   */
  update() {
    // 判断是否选中
    let end_positionX = this.end_positionX 
    let end_positionY = this.end_positionY
  
    }
/**
 * 重绘自身
 * @param {CanvasRenderingContext2D} ctx 
 */
draw(ctx) {
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, this.r, 0, TAU, false);
  ctx.fillStyle = this.color;
  if(this.check === 1){
  	ctx.strokeStyle = "red";
  	ctx.stroke();
  }
  ctx.fill();
}
/**
 * 事件监听初始化
 */
initEvent() {
  databus.eventManager.addListener('touchstart', (e) => {
    this.positionX = e.touches[0].clientX
    this.positionY = e.touches[0].clientY
    this.last_touch_x =e.touches[0].clientX
    this.last_touch_y =e.touches[0].clientY
    if (Util.distanceBetweenTwoPoints(this.x, this.y, e.changedTouches[0].clientX, e.changedTouches[0].clientY)< this.r) {
      this.touchstart =true;
    }
  })
  databus.eventManager.addListener('touchmove', (e) => {
    this.positionX = e.touches[0].clientX
    this.positionY = e.touches[0].clientY
  })
  databus.eventManager.addListener('touchend', (e) => {
    this.end_positionX = this.positionX;
    this.end_positionY = this.positionY;
    if (this.touchstart ===true && Util.distanceBetweenTwoPoints(this.x, this.y, e.changedTouches[0].clientX, e.changedTouches[0].clientY)< this.r) {
      if (this.check===0 && (databus.ballIsRun !== undefined && databus.ballIsRun === false) ) {
        this.check =1;
      } else {
        this.check =0;
      }
    }
    this.touchstart =false;
  })
}
}