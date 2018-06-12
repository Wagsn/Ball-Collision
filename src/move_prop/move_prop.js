

import Point from '../base/point'
import DataBus from '../databus'
import Util from '../util/util';
import Tile from '../base/tile'

let databus = new DataBus()
const TAU = 2 * Math.PI;

export default class Prop {

  constructor() {
    // 坐标
    this.r = 10;
    this.color = "#000";
    // 选中标志位
    this.check = 0;
    this.ok = false;
    this.touchstart = false;
		this.move_prop_moving = false;
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

      case 'flat':
        this.color = '#008080'
        break;
      case 'bloom':
        this.color = '#66CC00'
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
  create(){
  	
  }
  /**
   * 重绘自身
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, this.r, 0, TAU, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  /**
   * 事件监听初始化
   */
  initEvent() {

    databus.eventManager.addListener('touchstart', (e) => {
    	if(this.ok||databus.player.check2 === 1){
  		return
  	}
      if (Util.distanceBetweenTwoPoints(this.x, this.y, e.changedTouches[0].clientX, e.changedTouches[0].clientY) < this.r) {
        this.touchstart = true;
      }
    })
    databus.eventManager.addListener('touchmove', (e) => {
    	if(this.ok||databus.player.check2 === 1){
  		return
  	}
      if (this.touchstart === true) {	
        this.x = e.changedTouches[0].clientX;
        this.y = e.changedTouches[0].clientY;
        this.move_prop_moving = true;
      }
    })
    databus.eventManager.addListener('touchend', (e) => {

      if (!databus.ballIsRun && this.touchstart === true && Util.distanceBetweenTwoPoints(this.x, this.y, e.changedTouches[0].clientX, e.changedTouches[0].clientY) < this.r) {
			if(this.ok||databus.player.check2 === 1){
  		return
  	}
  	let tile = {
       	sx:e.changedTouches[0].clientX,
       	sy:e.changedTouches[0].clientY,
       	sr:15,
       	type:this.type
       }
       let temp = new Tile();
       temp.init(tile);
       databus.game_map.data.push(temp)
       this.ok = true;
       this.touchstart = false;
       this.move_prop_moving = false;
      }
    })
  }
}