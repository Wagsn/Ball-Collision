


/**
 * 一个圆用于显示，包含颜色，屏幕显示区域
 */

export default class Circle {
  constructor(o){
    this.color =o.color||'#F00'
    this.radius =o.radius||30
    this.point =o.point||new this.point(o.point.x, o.point.y) // 
    this.visible =o.visible||true
  }
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx){
    if (!this.visible) { return }  // 不可见
    //画一个实心圆
    ctx.beginPath();
    ctx.arc(this.point.x, this.point.y, this.radius, 0, 2*Math.PI, false); // 顺时针
    ctx.fillStyle = this.color;//填充颜色,默认是黑色
    //console.log(this.color)
    ctx.fill();//画实心圆
  }
  /**
   * 简单的碰撞检测定义：
   * @param{Circle} ci: Circle 的实例
   */
  isCollideWith(ci) {
    if (!this.visible || !ci.visible)
      return false
    // 如果圆心距小于半径之和，则两个圆相交
    return ( this.point.distance(ci.point) < this.radius + ci.radius )
  }
  /**
   * 画一个实心圆
   * @param {CanvasRenderingContext2D} ctx canvas 的 2D 上下文
   * @param {String} color 圆的颜色 格式为 '#FFFFFF'
   * @param {Number} x 圆的x坐标值
   * @param {Number} y 圆的y坐标值
   * @param {Number} r 圆的半径
   */
  static drawFillCircle(ctx, color, x, y, r){
    ctx.fillStyle =color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.fill()  //画实心圆
  }
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {*} color 
   * @param {*} x 
   * @param {*} y 
   * @param {*} r 
   * @param {*} lw 
   */
  static drawStrokeCircle(ctx, color, x, y, r, lw){
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.stroke();
  }
}