

import Point from '../base/point'
import DataBus from '../databus'
import Util from '../util/util';
import Circle from '../base/circle';

let databus = new DataBus()

/**
 * 道具类，
 * 在弹射球选中之前可以被选中，
 * 在弹射球发射之后，被选中的道具将调用作用函数作用于弹射球，并且在道具组中移出
 */
export default class Prop {
  constructor(o) {
    if (o !== undefined) { this.init(o); } else { this.init({}); }
    // 事件监听初始化
    this.initEvent();
  }
  /**
   * 初始化
   * @param {Object} o 
   */
  init(o) {
    this.id = o.id || 0;  // 0 表示默认id
    this.color = "#000";
     // 选中标志位
    this.checked = false;
    // 当发生touchstart事件时，该道具
    this.touchstart = false;
    // 显示所占区域
    this.sx = o.sx || 0;
    this.sy = o.sy || 0;
    this.sr = o.sr || 30;
    // 地图所占区域
    this.mx = o.mx || 0;
    this.my = o.my || 0;
    this.mr = o.mr || 30;
    this.type =o.type || '';    
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
  update() {}
  /**
   * 重绘自身
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx) {
    // 绘制自身
    Circle.drawFillCircle(ctx, this.color, (0.5 + this.sx)|0, (0.5 + this.sy)|0, this.sr);
    // 绘制选中圈
    if (this.checked === true) {
      Circle.drawStrokeCircle(ctx, "red", (0.5 + this.sx)|0, (0.5 + this.sy)|0, this.sr, 8);
    }
  }
  /**
   * 事件监听初始化
   */
  initEvent() {
    databus.eventManager.addListener('touchstart', (e) => {
      if (Util.distanceBetweenTwoPoints(this.sx, this.sy, e.changedTouches[0].clientX, e.changedTouches[0].clientY) < this.sr) {
        this.touchstart = true;
      }
    })
    databus.eventManager.addListener('touchend', (e) => {
      if (!databus.ballIsRun && this.touchstart === true && Util.distanceBetweenTwoPoints(this.sx, this.sy, e.changedTouches[0].clientX, e.changedTouches[0].clientY) < this.sr) {
        if (this.checked === true) {
          this.check = false;
        } else {
          this.check = true;
        }
      }
      this.touchstart = false;
    })
  }
}