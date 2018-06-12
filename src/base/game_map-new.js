// game_map.js

import Tile from './tile'
import DataBus from '../databus';

const inner_side_length_default = 45
const padding_default = 15

let databus = new DataBus();

/**
 * @author Wagsn
 * 类名风格：Game_Map，方法风格：drawToCanvas，属性风格：start_x。
 * 表示一个房间，也可以是一个关卡，数组有一个隐含key就是索引，可以大大减少 type等重复出现，
 */
export default class Game_Map {
  /**
   * m.data: Mat 
   */
  constructor(m) {
    // Important information on a map
    this.p_id = m.pId; // player id: String
    this.id = m.id;
    this.cols = m.cols;  // 
    this.rows = m.rows    // 
    // The size of a map on the interface，在屏幕上的显示区域
    this.sx = m.sx || 0;  // top-left
    this.sy = m.sy || 0;
    this.sw = m.sw || 200;
    this.sh = m.sh || 200;
    console.log('x:'+this.sx+', y:'+this.sy+', w:'+this.sw+', h:'+this.sh);
    // the size of map，在地图上所占区域
    this.mx = m.mx || 0;
    this.my = m.my || 100;
    this.mw = m.mw || 900;
    this.mh = m.mh || 1300;

    this.scale = this.sw / this.mw || 1;

    // 地图的样式风格
    this.style = {
      // 内部元素之间的间距，根据输入的 map size 动态计算
      h_space: m.h_space || 3,
      v_space: m.v_space || 3,
      // 与内部元素的距离
      padding: m.padding,
      padding_top: m.paddingTop || m.padding || padding_default,
      padding_bot: m.paddingBottom || m.padding || padding_default,
      padding_lef: m.paddingLeft || m.padding || padding_default,
      padding_rig: m.paddingRight || m.padding || padding_default
    }
    console.log('padding: '+m.padding)
    // inner element size, also can be dynamic calculation by Interface size
    this.inner_width = m.innerWidth || inner_side_length_default
    this.inner_height = m.innerHeight || inner_side_length_default
    this.inner_r = m.innerR || 15;
    // A simpler way to change the arrangement of internal elements
    // ['default']：采用默认方式绘制内部元素
    // ['no_inner_space']：采用内部无间隔
    // ['dynamic_space']：内部元素长宽不变，其间距动态计算
    // ['dynamic_size']
    // ['dynamic_size_space']：动态计算内部元素的尺寸和间隔，保证所有元素在界面上显示
    this.draw_style = ['default']
    let draw_style_tag = 'dynamic_size'
    if (draw_style_tag === 'no_inner_space') {
      this.style.h_space = 0
      this.style.v_space = 0
    }
    else if (draw_style_tag == 'dynamic_size') { // 间距固定
      this.style.h_space = 3
      this.style.v_space = 3
      // 每格的最大宽度
      let max_w = (this.mw - this.style.padding_lef - this.style.padding_rig - (this.cols - 1) * this.style.h_space) / this.cols
      let max_h = (this.mh - this.style.padding_top - this.style.padding_bot - (this.rows - 1) * this.style.v_space) / this.rows
      let max_s = (max_h > max_w) ? max_w : max_h;
      this.inner_width = max_s;
      this.inner_height = max_s;
      this.inner_r = max_s / 2;
    }
    else if (draw_style_tag === 'dynamic_space') {  // 在内部元素不超过最大尺寸限制时，以其尺寸为标准计算其间隔
      let max_w = (this.sw - this.style.padding_lef - this.style.padding_rig) / this.cols
      let d_w = max_w > this.inner_width ? this.inner_width : max_w
      let max_h = (this.sh - this.style.padding_top - this.style.padding_bot) / this.rows
      let d_h = this.inner_height > max_h ? max_h : this.inner_height
      // 计算内部元素的绘制尺寸
      let d_s = this.inner_width = this.inner_height = d_w > d_h ? d_h : d_w
      this.style.h_space = (this.sw - this.style.padding_lef - this.style.padding_rig - this.inner_width * this.cols) / (this.cols - 1)
      this.style.v_space = (this.sh - this.style.padding_top - this.style.padding_bot - this.inner_height * this.rows) / (this.rows - 1)
    }
    // 初始化地图每格的显示位置及地图数据
    this.data = [];
    console.log(m.data);
    for (let i = 0; i < m.data.length; i++) {  // 行数
      for (let j = 0; j < m.data[i].length; j++) {  // 列数
          let temp = new Tile();
          let tile = {
            mx: this.mx + (this.style.padding_lef + this.inner_r + j * (this.style.h_space + 2 * this.inner_r)),
            my: this.my + (this.style.padding_top + this.inner_r + i * (this.style.v_space + 2 * this.inner_r)),
            sx: this.sx + (this.style.padding_lef + this.inner_r + j * (this.style.h_space + 2 * this.inner_r)) * this.scale,
            sy: this.sy + (this.style.padding_top + this.inner_r + i * (this.style.v_space + 2 * this.inner_r)) * this.scale,
            sw: this.inner_width * this.scale,
            sh: this.inner_height * this.scale,
            sr: this.inner_r * this.scale || 15,
            type: m.data[i][j]
          };
          temp.init(tile);
          this.data.push(temp);
        
      }
    }
  }
  /**
   * 检查对象回收，可以隔段时间检查一次
   */
  checkRecover() {
    for (let i = this.data.length; i > -1; i--) {
      if (!this.data[i].isAlive) {
        databus.recoverToPool('tile', this.data.splice(i, 1))
      }
    }
  }
  /**
   * draw the map to canvas 
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx) {
    // 绘制每一个元素
    ctx.fillStyle = '#ccff66'
    ctx.fillRect(this.sx, this.sy, this.sw, this.sh);
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].drawTo(ctx);
    }
  }
  /**
   * 根据持久化存储对象初始化运行时对象
   * @param {Object} data 
   */
  init(data) {
  }
  /**
   * 返回持久化存储对象
   */
  data() {
  }
} 