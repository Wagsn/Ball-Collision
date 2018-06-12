

import Point from '../base/point'
import DataBus from '../databus'
import Util from '../util/util';

let databus = new DataBus()
const TAU = 2 * Math.PI;

export default class Prop {

  constructor() {
    // 坐标
    this.r = 10;
    this.color = "#000";
    // 选中标志位
    this.check = 0;

    this.touchstart = false;
		
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
    this.type = o.type;
    switch (o.type) {
      case 'wall':
        this.color = '#F17C67'
        break;
      case 'prop':
        this.color = '#00FFCC'
        break;
      case 'flat':
        this.color = '#FF9999'
        break;
      case 'bloom':
        this.color = '#66CC00'
        break;
      case 'ice':
        this.color = '#9966CC'
        break;
      default:
        this.color = '#CC6699'
        break;
    }
  }

  /**
   * 逻辑刷新
   */
  update() {

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
    if (this.check === 1) {
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
      if (Util.distanceBetweenTwoPoints(this.x, this.y, e.changedTouches[0].clientX, e.changedTouches[0].clientY) < this.r) {
        this.touchstart = true;
      }
    })
    databus.eventManager.addListener('touchend', (e) => {
      if (!databus.ballIsRun && this.touchstart === true && Util.distanceBetweenTwoPoints(this.x, this.y, e.changedTouches[0].clientX, e.changedTouches[0].clientY) < this.r) {
        if (this.check === 0) {
          this.check = 1;
        } else {
          this.check = 0;
        }
      }
      this.touchstart = false;
    })
  }
}