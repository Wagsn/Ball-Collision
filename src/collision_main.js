
import DataBus from './databus'
import BackGround from './runtime/back-ground'
import GameMap from './base/game_map'
import PropMap from './base/prop_map'
import Player from './player/player'
import Prop from './prop/prop'
import Play_UI from './runtime/play-ui';
import Main_UI from './runtime/main-ui';
let ctx = canvas.getContext('2d')
let databus = new DataBus()
let w = window.innerWidth
let h = window.innerHeight

/**
 * 球球对撞游戏主函数，
 * 因为此游戏是回合制且在一个屏幕内显示游戏画面，所以不用帧动画框架
 */
export default class Main {
  constructor() {
    this.aniId = 0
    this.restart()
    //道具使用标志位
    this.propChange = 0
    //game_map data 初始化
  }
  restart() {
    databus.reset()
    // 游戏初始化
    this.bg = new BackGround()
    let map2 =
      {
        id: 1001,
        cols: 9,
        rows: 6,
        data:this.randomMap(6, 9)
      }
    let prop_map =
      {
        id: 1001,
        columns: 5,
        rows: 1,
        data:  // type
        [
          ['wall'], ['wall'], ['prop'], ['prop'], ['wall'],
        ]
      }
    // 游戏地图
    let g_map = map2
    g_map.s_y = 40;
    g_map.s_w = databus.screenWidth;
    g_map.s_h = databus.screenHeight / 2;
    //this.game_map = new GameMap(g_map)
    //databus.game_map = this.game_map 
    // 道具地图
    let p_map = prop_map
    //this.prop_map = new PropMap(p_map)
    this.tileProp = {
      x: 55,
      y: 14 * h / 15,
      r: 0,//this.prop_map.s_r,
      type: 0
    }
    // p map 2
    let p_map2 =
      {
        id: 1002,
        cols: 9,
        rows: 1,
        data:this.randomMap(1, 9)
      }
    let p_ui = {
      pId: 1, 
      sx: 10,
      sy: 20,
      sw: databus.screenWidth -20,
      sh: databus.screenHeight -40,
      gmap: g_map,
      pmap: p_map2
    }
    this.play_ui = new Play_UI(p_ui);

    this.player = new Player();
    // 游戏主界面 // 含有 game start button
    this.mainUI = new Main_UI({sw: databus.screenWidth, sh: databus.screenHeight});
    // 游戏循环绑定
    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false
    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);
    // 动画帧 id，将 canvas 绘制到动画帧上
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  /**
   * 随机地图
   */
  randomMap(rows, cols) {
    let data1 = [];
    let data2 = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let ballRandom = Math.floor(Math.random() * 5 - 0.1);
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
        } else {
          data2.push('ice')
        }
      }
      data1.push(data2);
      data2 = [];
    }
    return data1;
  }
   
  collisionDetection() {
    // 每个Tile与player进行检测
    if (this.player.check2 === 1) {
      this.game_map.data.forEach((item) => {
        if (this.player.isCollideToTile(item)) {
          this.player.changeDir(item);
          this.player.count--;
          if(item.type === "prop"){
          this.tileProp.type = item.type;
          let newProp = new Prop();
          newProp.init(this.tileProp);
          this.prop_map.data.push(newProp);
          }
          console.log(this.prop_map.data.length)
          item.isAlive = false;
          item.visible = false;
        }
      });
    }
    if (this.player.check2 === 1) {
      for (let i = 0; i < this.prop_map.data.length; i++) {
        if (this.prop_map.data[i].check === 1) {
          this.prop_map.data.splice(i, 1);
        }
        this.propChange = 1;
      }
    }
    if (this.propChange === 1) {
      for (let i = 0; i < this.prop_map.data.length; i++) {
        this.prop_map.data[i].x = this.prop_map.s_x + this.prop_map.style.padding_left + i * (this.prop_map.style.horizontal_space + this.prop_map.inner_width)
      }
      this.propChange === 0
    }
  }

  update() {
    this.player.update()
    this.collisionDetection()
  }
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.drawToCanvas(ctx)
    //this.game_map.drawTo(ctx)

    //this.prop_map.drawTo(ctx)
    this.play_ui.drawTo(ctx);
    this.mainUI.drawTo(ctx)
    //this.player.draw(ctx)

  }
  loop() {
    databus.frame++
    this.update() // 逻辑处理
    this.render() // 屏幕重绘
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}