

import Point from '../base/point'
import DataBus from '../databus'
import Util from '../util/util';


let w = window.innerWidth
let h = window.innerHeight

let databus = new DataBus()
const TAU = 2 * Math.PI;

export default class Player {

  constructor(o) {
    // 坐标
    this.sx = o.sx || w / 2;
    this.sy = o.sy || 3 * h / 4;
    this.sr = o.sr;
    this.color = "#000";
    // 地图坐标 
    this.mx = o.mx || 0;
    this.my = o.my || 0;
    this.limit = o.limit || 200;
    this.mr = o.mr || 0;
    // 偏移量
    this.xr = 0;
    this.yr = 0;
    // 半径
    this.speed = 5;
    this.lineWidth = 2;
    this.direction = 0;
    // 撞击次数
    this.count = 0;
    // 选中标志位
    this.check = 0;
    this.check2 = 0;
    this.check3 = 0;
    this.collision = false;
    // 点击坐标
    this.positionX = 0;
    this.positionY = 0;
    // 抬手坐标
    this.end_positionX = 0;
    this.end_positionY = 0;
    // 事件监听初始化
    this.initEvent();
  }

  /**
   * 简单的碰撞检测定义：
   * @param{Tile} ti: Tile 的实例
   */
  isCollideToTile(ti) {
    if (!ti.isAlive) { return false }
	  this.collision = Util.isCircleIntersectBall(this.sx, this.sy, ti.sx, ti.sy, this.sr, ti.sr);
    return this.collision;
  }
  /**
   * 小球反弹定义：
   * @param{Tile} ti: Tile 的实例
   */
  changeDir(ti) {
    if (!this.collision) {
      return;
    }
    this.direction = Util.directionBetweenTwoPoints(0, 0, this.xr, this.yr);
    this.rad = Util.computeReflectionAngle(this.sx, this.sy, this.direction, ti.sx, ti.sy);
    this.yr = Math.sin(this.rad) * this.speed;
    this.xr = Math.cos(this.rad) * this.speed;
  }

  /**
   * 逻辑刷新
   */
  update() {
    // 判断是否选中
    if (this.end_positionX == 0 && this.end_positionY == 0) {
      if (this.positionX < (databus.player_sx + 20) && this.positionX > (databus.player_sx - 20) && this.positionY > (databus.player_sy - 20) && this.positionY < (databus.player_sy + 20)) {
        this.check = 1;
      }
      if (this.check == 1) {
        // 不要管 
        this._x = (databus.player_sx - this.positionX);
        this._y = (databus.player_sy - this.positionY);
        this.distance = Math.abs(this._x) + Math.abs(this._y);
        this.speed = this.distance / 20 > 7 ? this.distance / 20 : 7;
        this.lineWidth = (30 - this.speed) / 3;
        this.sx = this.positionX;
        this.sy = this.positionY;
        if (this.sy < this.limit-databus.pui_sy) {
          this.sy = this.limit;
        }
        if (this.sy > databus.pui_sh-databus.pui_sy - this.sr) {
          this.sy = databus.pui_sh - this.sr;
        }
        if (this.sx < this.sr+databus.pui_sx) {
          this.sx = this.sr;
        }
        if (this.sx > databus.pui_sw - this.sr-databus.pui_sy) {
          this.sx = databus.pui_sw - this.sr;
        }
      }
    } else {
      if (this.check == 1) {
        this.check2 = 1;
        if (this.xr === 0 && this.yr === 0) {
          //计算方向和速度
          this._x = (databus.player_sx - this.end_positionX);
          this._y = (databus.player_sy - this.end_positionY);
          this.distance = Math.abs(this._x) + Math.abs(this._y);
          this.speed = this.distance / 20 > 7 ? this.distance / 20 : 7;
          this.lineWidth = 10 - this.speed;
          this.R = Math.sqrt((Math.pow(this._x, 2) + Math.pow(this._y, 2)));
          this.sin = this._x / this.R;
          this.cos = this._y / this.R;
          this.xr = this.sin * this.speed;
          this.yr = this.cos * this.speed;
          this.count = 3;
        }
        //判断边界碰撞
        if (this.sx - this.sr+databus.pui_sx < 0 || this.sx + this.sr > databus.pui_sw-databus.pui_sx) {
          this.xr = -this.xr;
          this.count = this.count - 1;
        }
        if (this.sy + this.sr+databus.pui_sy < databus.pui_sh - 230*databus.scale) {
          this.check3 = 1;
        } else if (this.sy + this.sr > databus.pui_sh) {
          this.yr = -this.yr;
        }
        if (this.sy - this.sr < h-databus.pui_sh || this.sy + this.sr > databus.pui_sh - 230*databus.scale && this.check3 === 1) {
          this.yr = -this.yr;
          this.count = this.count - 1;
        }

        //球移动
        this.sx += this.xr
        this.sy += this.yr
        //碰撞完毕 恢复函数
        if (this.count < 1) {
          this.sx = databus.player_sx;
          this.sy = databus.player_sy; 
          this.xr = 0;
          this.yr = 0;
          this.sr = databus.player_sr;
          this.color = "#000";
          this.speed = 5;
          this.count = 0;
          this.check = 0;
          this.check2 = 0;
          this.check3 = 0;
          this.positionX = 0;
          this.positionY = 0;
          this.end_positionX = 0;
          this.end_positionY = 0;
        }

      } else {
        this.end_positionX = 0;
        this.end_positionY = 0;
      }
    }
    databus.ballIsRun = this.check2 === 1;
  }
  /**
   * 重绘自身
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    if (this.sy < this.limit && this.check2 != 1) {
      ctx.arc((0.5 + this.sx) | 0, (0.5 + this.limit) | 0, this.sr, 0, TAU, false);
    } else {
      ctx.arc((0.5 + this.sx) | 0, (0.5 + this.sy) | 0, this.sr, 0, TAU, false);
    }
    ctx.fillStyle = this.color;
    if (this.count == 0) {
      ctx.moveTo(databus.player_sx, databus.player_sy);
      if (this.sy > this.limit) {
        ctx.lineTo(this.sx, this.sy);
      } else {
        ctx.lineTo(this.sx, this.limit);
      }
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = "#fff"
      ctx.stroke()
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
    })
    databus.eventManager.addListener('touchmove', (e) => {
      this.positionX = e.touches[0].clientX
      this.positionY = e.touches[0].clientY
    })
    databus.eventManager.addListener('touchend', (e) => {
      this.end_positionX = this.positionX;
      this.end_positionY = this.positionY;
    })
  }
}