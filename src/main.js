
import DataBus from './databus'
import BackGround from './runtime/back-ground'
import GameMap from './base/game_map'

let ctx = canvas.getContext('2d')
let databus = new DataBus()


/**
 * 球球对撞游戏主函数，
 * 因为此游戏是回合制且在一个屏幕内显示游戏画面，所以不用帧动画框架
 */
export default class Main {
  constructor(){
    this.aniId = 0
    this.restart()
  }
  /**
   * 重新开始，第一次游戏也应该调用这个
   */
  restart(){
    databus.reset()
    // 游戏初始化
    this.bg = new BackGround()
    let map1 = 
    { 
      id: 1001, 
      columns: 3, 
      rows: 3, 
      data:  // type
      [ 
        [['wall'], ['iron'], ['flat']], 
        [['flat'], ['flat'], ['flat']], 
        [['flat'], ['wall'], ['iron']]
      ] 
    } 
    let map2 = 
    { 
      id: 1001, 
      columns: 6, 
      rows: 4, 
      data:  // type
      [ 
        [['wall'], ['iron'], ['flat'], ['iron'], ['wall'], ['flat']], 
        [['flat'], ['flat'], ['flat'], ['flat'], ['wall'], ['iron']], 
        [['flat'], ['wall'], ['iron'], ['flat'], ['wall'], ['flat']],
        [['iron'], ['wall'], ['flat'], ['flat'], ['flat'], ['iron']]
      ] 
    } 
    var map =map2
    map.s_y = 80;
    map.s_w = databus.screenWidth;
    map.s_h = databus.screenHeight/2.5;
    this.game_map =new GameMap(map)
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
   * 每帧的逻辑刷新
   */
  update(){
    // 1st 首先重绘最底层的背景
    this.bg.update()
  }
  /**
   * 每帧的界面重绘
   */
  render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 1st 首先重绘最底层的背景
    this.bg.drawToCanvas(ctx)
    // 2nd 其次重绘其上的游戏地图
    this.game_map.drawTo(ctx)
    // 3rd 重绘 player
    // this.player.drawToCanvas(ctx)
    // 4th 重绘 幕布菜单等
  }
  loop(){
    databus.frame++

    this.update() // 逻辑处理
    this.render() // 屏幕重绘

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}