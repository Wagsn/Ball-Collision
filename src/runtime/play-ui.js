
import DataBus from '../databus'
import BackGround from '../runtime/back-ground'
import GameMap from '../base/game_map'
import PropMap from '../base/prop_map'
import MovePropMap from '../base/move_prop_map'
import Player from '../player/player'
import Prop from '../prop/prop'
import MoveProp from '../move_prop/move_prop'

//let ctx = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 球球对撞游戏主函数，
 * 因为此游戏是回合制且在一个屏幕内显示游戏画面，所以不用帧动画框架
 */
export default class Play_UI {
  constructor(o) {
    o === null ? this.init({}) : this.init(o);
    //this.initEvent();
  }
  /**
   * 初始化
   * @param {*} o 
   */
  init(o) {
    //道具使用标志位
    this.propChange = 0
    //game_map data 初始化
    //道具种类标志位
    this.type = ''
    //执行数量
    this.propCount = 1
    //状态标志位
    this.ready = true
    this.set = false
    this.pull = false
    this.launch = false
    this.stop_move = false
    // 可见性
    this.visible = true;
    this.pId = o.pId || 0;
    // 屏幕显示区域，地图在其左上角显示  传入的是可以显示区域，需要计算实际显示区域
    this.sx = o.sx || 0;
    this.sy = o.sy || 0;
    this.sw = o.sw || 900;
    this.sh = o.sh || 1600;
    console.log(this.sw, this.sh)
    // 如果比较宽
    if (this.sw / this.sh > 9 / 16) {
      this.sw = this.sh * (9 / 16);
    } else {
      this.sh = this.sw * (16 / 9);
    }
    // 所占地图面积(固定)，默认长宽比 16:9
    this.mx = 0;
    this.my = 0;
    this.mw = 900;
    this.mh = 1600;
    // 比例尺=>显示坐标:地图坐标
    this.scale = (this.sw / this.mw);
    databus.scale = this.scale;
    databus.pui_sx = this.sx;
    databus.pui_sy = this.sy;
    databus.pui_sw = this.sw;
    databus.pui_sh = this.sh;
    // 背景颜色0
    this.color = o.color || 'rgba(0, 0, 0, 0.1)' // '#EEE8AB';  // 'rgba(255, 0, 0, 0.5)';
    this.restart()
  }
  restart() {
    databus.reset()
    // 游戏初始化
    let player = {
      // 地图坐标
      mx: this.mw / 2,
      my: this.mh * 5 / 6,
      // 坐标
      sx: this.sx + this.mw / 2 * this.scale,
      sy: this.sy + this.mh * 5 / 6 * this.scale,
      mr: 40,
      sr: 40 * this.scale,
      color: "#000",
      limit: this.sy + 300 * this.scale

    }
    let player_sx = this.sx + this.mw / 2 * this.scale
    let player_sy = this.sy + this.mh * 5 / 6 * this.scale
    let player_sr = 40 * this.scale
    databus.player_sx = player_sx
    databus.player_sy = player_sy
    databus.player_sr = player_sr
    this.player = new Player(player)
    databus.player = this.player
    databus.ready = this.ready

    let prop_map =
      {
        id: 1001,
        columns: 5,
        rows: 1,
        data:  // type
          [
            ['ice'], ['ice'], ['prop'], ['prop'], ['ice'],
          ]
      }
    let move_prop_map =
      {
        id: 1001,
        columns: 5,
        rows: 1,
        data:  // type
          [
            ['flat'], ['flat'], ['bloom'],
          ]
      }
    // 计算所占地图区域
    let game_map =
      {
        p_id: 1,
        id: 1001,
        cols: 12,
        rows: 8,
        data: this.randomMap(),
        mx: this.mx,
        my: this.my + 100,
        mw: 900,
        mh: 1300,
        // 计算所占显示区域
        sx: this.sx,
        sy: this.sy + (this.my + 100) * this.scale,
        sw: 900 * this.scale,
        sh: 1300 * this.scale
      }


    this.game_map = new GameMap(game_map)
    databus.game_map = this.game_map
    var p_map = prop_map
    this.prop_map = new PropMap(p_map)
    var m_p_map = move_prop_map
    this.move_prop_map = new MovePropMap(m_p_map)


    //传递tpye的东西
    this.move_tileProp = {
      x: 55,
      y: 4 * databus.screenHeight / 5,
      r: this.move_prop_map.s_r,
      type: 0
    }
    this.tileProp = {
      x: 55,
      y: 14 * databus.screenHeight / 15,
      r: this.prop_map.s_r,
      type: 0
    }
  }
  /**
   * game_map随机创建
   */
  randomMap() {
    let data1 = [];
    let data2 = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 12; j++) {
        let ballRandom = Math.floor(Math.random() * 15 - 0.1);
        if (ballRandom == 0) {
          data2.push('wall')
        } else if (ballRandom == 1) {
          data2.push('prop')
        } else if (ballRandom == 2) {
          data2.push('flat')
        } else if (ballRandom == 3) {
          data2.push('bloom')
        } else if (ballRandom == 4) {
          data2.push('ice')
        } else if (ballRandom == 5) {
          data2.push('wall')
        } else if (ballRandom == 6) {
          data2.push('wall')
        } else if (ballRandom == 7) {
          data2.push('wall')
        } else if (ballRandom == 8) {
          data2.push('wall')
        } else if (ballRandom == 9) {
          data2.push('wall')
        } else if (ballRandom == 10) {
          data2.push('')
        } else if (ballRandom == 11) {
          data2.push('')
        } else if (ballRandom == 12) {
          data2.push('')
        } else if (ballRandom == 13) {
          data2.push('')
        } else if (ballRandom == 14) {
          data2.push('')
        } else {
          data2.push('')
        }
      }
      data1.push(data2);
      data2 = [];
    }
    return data1;
  }
  //状态位管理
  count() {
    this.set = false
    this.pull = false
    this.launch = false
    this.stop_move = false
  }
  /**
 * 全局碰撞检测
 */
  collisionDetection() {
    // 每个Tile与player进行检测
    if (this.player.check2 === 1) {
      this.game_map.data.forEach((item) => {
        if (this.player.isCollideToTile(item)) {
          this.player.changeDir(item);
          this.player.count--;
          if (item.type !== "wall") {
            if (item.type === "prop" || item.type === "ice") {
              this.tileProp.type = item.type;
              let newProp = new Prop()
              newProp.init(this.tileProp);
              this.prop_map.data.push(newProp);
            } else {
              this.move_tileProp.type = item.type;
              let newMoveProp = new MoveProp()
              newMoveProp.init(this.move_tileProp);
              this.move_prop_map.data.push(newMoveProp);
            }
          }
          item.isAlive = false;
          item.visible = false;
          //重排
          this.after_launch();
        }
      });
    }
  }
  //发射前操作
  before_launch() {
    this.ready = true;
    for (let i = 0; i < this.move_prop_map.data.length; i++) {
      if (this.move_prop_map.data[i].move_prop_moving) {
        this.ready = false;
      }
    }
  }
  //发射后操作
  after_launch() {
    this.type = '';
    if (this.player.check2 === 1) {
      for (let i = 0; i < this.prop_map.data.length; i++) {
        if (this.prop_map.data[i].check === 1) {
          //传入使用道具的类型
          this.type = this.prop_map.data[i].type;
          this.prop_map.data.splice(i, 1)
        }
      }
      for (let i = 0; i < this.move_prop_map.data.length; i++) {
        if (this.move_prop_map.data[i].ok) {
          //传入使用道具的类型
          this.move_prop_map.data.splice(i, 1)
        }
      }
      //重排可道具区
      for (let i = 0; i < this.prop_map.data.length; i++) {
        this.prop_map.data[i].x = this.prop_map.s_x + this.prop_map.style.padding_left + i * (this.prop_map.style.horizontal_space + this.prop_map.inner_width)
      }
      //重排可移动道具区
      for (let j = 0; j < this.move_prop_map.data.length; j++) {
        this.move_prop_map.data[j].x = this.move_prop_map.s_x + this.move_prop_map.style.padding_left + j * (this.move_prop_map.style.horizontal_space + this.move_prop_map.inner_width)
        this.move_prop_map.data[j].y = 4 * databus.screenHeight / 5
      }
    }
  }
  update() {
    //	console.log(this.ready)
    if (this.ready) {
      this.player.update(this.type)
      this.count()
      this.after_launch();
      this.collisionDetection()
    }
    this.before_launch();
  }
  drawTo(ctx) {
    this.player.draw(ctx)
    this.game_map.drawTo(ctx)
    this.prop_map.drawTo(ctx)
    this.move_prop_map.drawTo(ctx)
    this.player.draw(ctx)
  }
}