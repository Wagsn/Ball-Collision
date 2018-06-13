
import DataBus from './databus'
import BackGround from './runtime/back-ground'
import Play_UI from './runtime/play-ui';

let ctx = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 球球对撞游戏主函数，
 * 因为此游戏是回合制且在一个屏幕内显示游戏画面，所以不用帧动画框架
 */
export default class Main {
  constructor() {
    this.aniId = 0
    this.restart()
  }
  restart() {
    databus.reset()
    // 游戏初始化
    this.bg = new BackGround()
    this.playUI = new Play_UI({
      sy: 0,
      sy: 0,
      sw: databus.screenWidth,
      sh: databus.screenHeight
    });
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

  update() {
    this.playUI.update();
  }
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.drawToCanvas(ctx)
    this.playUI.drawTo(ctx)
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