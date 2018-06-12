
import Point from '../base/point'
import DataBus from '../databus'

let databus = new DataBus()
let w = window.innerWidth
let h = window.innerHeight
const TAU = 2 * Math.PI;
/**
 * 游戏背景类
 * 提供update和render函数实现背景功能
 */
export default class BackGround {
  constructor(){
  	//大屏幕
    this.color = databus.color.bg_default
    this.start_x =0
    this.start_y =0
    this.width = databus.screenWidth
    this.height = databus.screenHeight
    //道具区
    this.x = 0;
    this.y = 7 * h / 8;;
    this.w = w;
    this.h = h / 8;
    this.prop_color = "#ccffcc"
    //弹球
    this.const_x = w / 2;
    this.const_y = 3 * h / 4;
    this.const_r = 5;
    this.const_color = "#fff";
  }
  /**
   * 逻辑，TODO：颜色渐变
   */
  update() {
  }
  /**
   * 将矩形绘制在canvas上
   */
  drawToCanvas(ctx) {
    //画一个实心矩形
    ctx.beginPath();
    ctx.fillStyle = this.color;//填充颜色,默认是黑色
    ctx.rect(this.start_x, this.start_y, this.width, this.height-this.h)
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = this.prop_color;//填充颜色,默认是黑色
    ctx.rect(this.x, this.y, this.w, this.h)
    ctx.fill();
    ctx.beginPath();
    ctx.arc((0.5 + this.const_x) | 0, (0.5 + this.const_y) | 0, this.const_r, 0, TAU, false);
    ctx.fillStyle = this.const_color;
    ctx.fill();
  }
}