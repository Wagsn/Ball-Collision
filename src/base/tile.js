import DataBus from "../databus";


let databus = new DataBus();
const TAU = 2 * Math.PI;

/**
 * 地图每格的瓦片类
 */
export default class Tile {
  constructor() { }
  /**
   * 地图每格元素类
   * 传入所需的小护士话数据
   * @param {*} o 
   */
  init(o) {
    // 创建离屏画布，作为缓存
    this.offCanvas = wx.createCanvas();
    this.id = o.id || 0
    this.type = o.type || 'flat'  // 根据type产生的一些数据
    // 地图坐标，为整数
    this.mx = o.mx || this.mx || 0
    this.my = o.my || this.my || 0
    // 显示位置
    this.sx = o.sx || 10;
    this.sy = o.sy || 10;
    this.sw = o.sw || 10;
    this.sh = o.sh || 10;
    //this.s_x0 = this.s_x + this.s_w / 2; // 当传入矩形计算圆心坐标
    //this.s_y0 = this.s_y + this.s_h / 2;;
    this.sr = o.sr || (this.s_w > this.s_h ? this.s_h / 2 : this.s_w / 2) || 15;
    // 根据tpe选择颜色
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
    this.visible = true;  // 表示可见性
    this.isAlive = true;  // 表示是否需要被回收

    // 先将自身绘制到离屏画布上
    let offctx =this.offCanvas.getContext('2d');
    offctx.beginPath();
    offctx.fillStyle = this.color;
    offctx.arc(this.sx || 0, this.sy || 0, this.sr, 0, TAU, false);
    offctx.fill();
  }
  /**
   * 将自身绘制在canvas上
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx) {
    if (!this.visible) { return }
    //ctx.drawImage(this.offCanvas, 0, 0)
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.sx || 0, this.sy || 0, this.sr, 0, TAU, false);
    ctx.fill();
  }
  /**
   * 逻辑刷新
   */
  update() {
  }
}