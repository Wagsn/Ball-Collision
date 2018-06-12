// prop_map.js

import Prop from '../prop/prop'
import DataBus from '../databus';

const inner_side_length_default = 45
const padding_default = 40

let databus = new DataBus();
let w = window.innerWidth
let h = window.innerHeight
/**
 * 道具地图，包含道具组的显示，对已使用道具的回收
 */
export default class Prop_Map {
  /**
   * 初始化，并计算每个道具的位置
   */
  constructor(m) {
    // Important information on a map
    this.p_id = m.pId || 0;
    this.id = m.id || 0;
    this.cols = m.cols;  // 显示的列数
    this.rows = m.rows;  // 显示的行数 多余的不显示，少的填空位
    this.mat_data = m.data
    // The size of a map on the interface
    this.sx = 0;  // top-left
    this.sy = 9 * h / 10;
    this.sw = w;
    this.sh = 9 * h / 10;
    this.sr = 15;
    // 地图的样式风格
    this.style = {
      // 内部元素之间的间距，根据输入的 map size 动态计算
      horizontal_space: m.horizontal_space || 5,
      vertical_space: m.vertical_space || 5,
      // 与内部元素的距离
      padding: m.padding,
      padding_top: m.paddingTop || padding_default,
      padding_bottom: m.paddingBottom || padding_default,
      padding_left: m.paddingLeft || padding_default,
      padding_right: m.paddingRight || padding_default
    }
    // inner element size, also can be dynamic calculation by Interface size
    this.inner_width = m.innerWidth || inner_side_length_default
    this.inner_height = m.innerHeight || inner_side_length_default
    // A simpler way to change the arrangement of internal elements
    // ['default']：采用默认方式绘制内部元素
    // ['no_inner_space']：采用内部无间隔
    // ['dynamic_space']：内部元素长宽不变，其间距动态计算
    // ['dynamic_size']
    // ['dynamic_size_space']：动态计算内部元素的尺寸和间隔，保证所有元素在界面上显示
    this.draw_style = ['default']
    let draw_style_tag = 'dynamic_space'
    if (draw_style_tag === 'no_inner_space') {
      this.style.horizontal_space = 0
      this.style.vertical_space = 0
    } else if (draw_style_tag == 'dynamic_size_space') { }
    else if (draw_style_tag === 'dynamic_space') {  // 在内部元素不超过最大尺寸限制时，以其尺寸为标准计算其间隔
      let max_w = (this.sw - this.style.padding_left - this.style.padding_right) / this.cols
      let d_w = max_w > this.inner_width ? this.inner_width : max_w
      let max_h = (this.sh - this.style.padding_top - this.style.padding_bottom) / this.rows
      let d_h = this.inner_height > max_h ? max_h : this.inner_height
      // 计算内部元素的绘制尺寸
      let d_s = this.inner_width = this.inner_height = d_w > d_h ? d_h : d_w
      this.style.horizontal_space = (this.sw - this.style.padding_left - this.style.padding_right - this.inner_width * this.cols) / (this.cols - 1)
      this.style.vertical_space = (this.sh - this.style.padding_top - this.style.padding_bottom - this.inner_height * this.rows) / (this.rows - 1)
    }
    // 初始化地图每格的显示位置及地图数据
    this.data = [];
    for (let i = 0; i < m.data.length; i++) {
      if (m.data[i].length > 0) {
        let temp = new Prop();
        let props = {
          sx: this.sx + this.style.padding_left + i * (this.style.horizontal_space + this.inner_width),
          sy: 14 * h / 15,
          sr: this.sr,
          type: m.data[i][0]
        };
        temp.init(props);
        this.data.push(temp);
      }

    }
  }
  /**
   * Calculating position，
   * 需要data，显示区域
   */
  calLoc(){}
  /**
   * 当弹射球发射时调用，回收已使用道具，重新计算每个道具的位置
   */
  update(){}
  /**
   * 检查对象回收，可以隔段时间检查一次
   */
  checkRecover() {
    for (let i = this.data.length; i > -1; i--) {
      if (!this.data[i].isAlive) {
        databus.recoverToPool('prop', this.data.splice(i, 1))
      }
    }
  }
  /**
   * draw the map to canvas 
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx) {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].drawTo(ctx);
    }
  }
  /**
   * 根据持久化存储对象初始化运行时对象
   * @param {Object} o 
   */
  init(o) {
  }
  /**
   * 返回持久化存储对象
   */
  data() {
  }
} 