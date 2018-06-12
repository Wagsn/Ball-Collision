

import Point from '../base/point'
import DataBus from '../databus'
import Util from '../util/util';


let w = window.innerWidth
let h = window.innerHeight

let databus = new DataBus()
const TAU = 2 * Math.PI;

export default class Player {

  constructor() {
    // 坐标
    this.x = w / 2;
    this.y = 3 * h / 4;
    // 偏移量
    this.xr = 0;
    this.yr = 0;
    // 半径
    this.r = 10;
    this.color = "#000";
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
    //限制器
    this.limit = 200;
  }
  /**
   * 简单的碰撞检测定义：
   * @param{Tile} ti: Tile 的实例
   */
  isCollideToTile(ti) {
    if (!ti.isAlive) { return false }
    this.collision = Util.isCircleIntersectBall(this.x, this.y, ti.s_x, ti.s_y, this.r, ti.s_r);
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
    this.rad = Util.computeReflectionAngle(this.x, this.y, this.direction, ti.s_x, ti.s_y);
    this.yr = Math.sin(this.rad) * this.speed;
    this.xr = Math.cos(this.rad) * this.speed;
  }

  /**
   * 逻辑刷新
   */
  update(type,moving_prop) {
  	
    // 判断是否选中
    if (this.end_positionX == 0 && this.end_positionY == 0) {
      if (this.positionX < (w / 2 + 20) && this.positionX > (w / 2 - 20) && this.positionY > (3 * h / 4 - 20) && this.positionY < (3 * h / 4 + 20)) {
        this.check = 1;
      }
      if (this.check == 1) {
        // 不要管 
        this._x = (w / 2 - this.positionX);
        this._y = (3 * h / 4 - this.positionY);
        this.distance = Math.abs(this._x) + Math.abs(this._y);
        this.speed = this.distance / 20 > 7 ? this.distance / 20 : 7;
        this.lineWidth = (30 - this.speed) / 3;
        this.x = this.positionX;
        this.y = this.positionY;
        if (this.y < this.limit) {
          this.y = this.limit;
        }
        if (this.y > h - this.r) {
          this.y = h - this.r;
        }
        if (this.x < this.r) {
          this.x = this.r;
        }
        if (this.x > w - this.r) {
          this.x = w - this.r;
        }
      }
    } else {
      if (this.check == 1) {
        this.check2 = 1;
        if(type === "prop"){
			  		this.color = "#00FFCC"
			  	}else if(type === "flat"){
			  		this.color = "#FF9999"
			  	}else if(type === "ice"){
			  		this.color = "#9966CC"
			  	}else if(type === "bloom"){
			  		this.color = "#66CC00"
			  	}
        if (this.xr === 0 && this.yr === 0) {
          //计算方向和速度
          this._x = (w / 2 - this.end_positionX);
          this._y = (3 * h / 4 - this.end_positionY);
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
        if (this.x - this.r < 0 || this.x + this.r > w) {
          this.xr = -this.xr;
          this.count = this.count - 1;
        }
        if (this.y + this.r < h - 230) {
          this.check3 = 1;
        } else if (this.y + this.r > h) {
          this.yr = -this.yr;
        }
        if (this.y - this.r < 0 || this.y + this.r > h - 230 && this.check3 === 1) {
          this.yr = -this.yr;
          this.count = this.count - 1;
        }

        //球移动
        this.x += this.xr
        this.y += this.yr
        //碰撞完毕 恢复函数
        if (this.count < 1) {
          this.x = w / 2;
          this.y = 3 * h / 4;
          this.xr = 0;
          this.yr = 0;
          this.r = 10;
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
    if (this.y < this.limit && this.check2 != 1) {
      ctx.arc((0.5 + this.x) | 0, (0.5 + this.limit) | 0, this.r, 0, TAU, false);
    } else {
      ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, this.r, 0, TAU, false);
    }
    ctx.fillStyle = this.color;
    if (this.count == 0) {
      ctx.moveTo(w / 2, 3 * h / 4);
      if (this.y > this.limit) {
        ctx.lineTo(this.x, this.y);
      } else {
        ctx.lineTo(this.x, this.limit);
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