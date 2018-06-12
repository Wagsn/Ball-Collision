import Pool from '../libs/pool'
import EventManager from '../libs/event-manager'

let instance //全局管理器的唯一实例

// 记录屏幕尺寸，当尺寸改变时才会发生变化
let screenWidth = window.innerWidth
let screenHeight = window.innerHeight

/**
 * 全局状态管理器，TODO: 游戏配置文件 config
 */
export default class DataBus {
  constructor() {  // 单例模式
    if ( instance )
      return instance
    instance = this
    // 初始化全局变量
    this.initGobalData()
    // 对象池，TODO: 改成Pool加PoolManager组合使用
    this.pool = new Pool()  
    // 全局事件管理器
    this.eventManager = new EventManager() 
    // 当前局游戏数据重置
    this.reset()
  }
  /**
   * 初始化全局变量
   */
  initGobalData(){
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight
    console.log('w: '+this.screenWidth+', h: '+this.screenHeight)
    this.version = '1.0.3'
    this.ballIsRun =false;
    this.color ={
      bg_default: "#EEE8AB"
    }
  }
/**
 * 每局的游戏状态
 */
  reset() {
    this.frame      = 0
    this.animations = []
    this.gameOver   = false
  }
  /**
   * 通用的 actor 回收到对象池函数，外部需要保证已经切除引用
   */
  recoverToPool(type, actor){
    // let temp = this.actors[type].remove(actor) // actors 全局对象集

    // temp.isAlive = false;  // 对象存活标记，当为false则需要被放入对象池

    this.pool.recover(type, actor);  // 将对象放进对象池
  }
}
