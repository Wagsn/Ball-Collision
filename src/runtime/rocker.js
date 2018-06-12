
import Shape from '../base/shape'
import Ar_Circle from '../base/area_circle'
import Sh_Circle from '../base/shape_circle'
import Point from '../base/point'

import DataBus from '../databus'
import ActionQueue from '../../libs/action_queue'

let databus = new DataBus()

/**
 * 摇杆类
 */
export default class Rocker extends Shape{
  /**
   * 坐标和半径
   */
  constructor(radius, point) { 
    super({color:'#9BA88d', area: new Ar_Circle(radius, point)})
    // 格式：register:{type:'btn_checked',wrap:(e)=>{},reason:{events:['touchstart','touchend'],callback:{touchstart:fn,touchend:fn},detail:{lastTouch:{x,y}}}}
    let that =this
    let checked_register = { // TODO： 里面不要有this因为不知道其他对象是否监听这个事件
      type: 'rocker_checked',
      wrap: function(e){  // 这里传入的是 rocker_checked 类型事件
        e.direction = checked_register.reason.detail.direction
        e.checked = checked_register.reason.detail.checked
        console.log(e)
      },
      reason: {
        events: ['touchstart', 'touchmove', 'touchend'],
        callback: {
          touchstart: function(e){  // e 系统事件 event
            if (that.area.point.distanceXY(e.touches[0].clientX, e.touches[0].clientY) < that.area.radius){
              checked_register.reason.detail.checked = true
              checked_register.reason.detail.direction = that.area.point.directionToXY(e.touches[0].clientX, e.touches[0].clientY)
              return true
            }
            return false
          },
          touchmove: function(e){
            if (checked_register.reason.detail.checked === true){
              checked_register.reason.detail.checked = true
              checked_register.reason.detail.direction = that.area.point.directionToXY(e.touches[0].clientX, e.touches[0].clientY)
              return true
            }
            return false
          },
          touchend: function(e){  // 将摇杆取消也作为 rocker_checked 事件的一部分
            // 只有摇杆被 checked 状态才会触发一此
            if (checked_register.reason.detail.checked === true){
              that.checked = checked_register.reason.detail.checked = false
              return true
            }
            return false
          }
        },
        detail: {
          checked: false,
          direction: 0
        }
      }
    }
    let unchecked_register ={
      type: 'rocker_unchecked'
    }
    /*
    // TODO：确认一下是否这种格式较好
    let checked_register = {
      type: 'rocker_checked',
      wrap: (e)=>{},
      events: ['touchstart', 'touchmove', 'touchend'],
      touchstart: (e)=>{  // e 系统事件 event
        if (this.area.point.distanceXY(e.touches[0].clientX, e.touches[0].clientY) < this.area.radius){
          checked_register.checked = true
        }
      },
      touchmove: (e)=>{
        if (checked_register.checked === true){
          checked_register.direction = this.area.point.directionToXY(e.touches[0].clientX, e.touches[0].clientY)
          this.direction = this.area.point.directionToXY(e.touches[0].clientX, e.touches[0].clientY)
        }
      },
      touchend: (e)=>{
        checked_register.checked = false
      },
      checked: false,
      lastTouchPoint: {},
      direction: 0
    }
    */
    databus.eventManager.login(checked_register)    
    this.checked = false
    this.direction = 0 
    this.microCircle = new Sh_Circle({color:'#000A00', area: new Ar_Circle(10, new Point(point.x, point.y))})
    // 初始化行为队列
    //this.actionQueue = new ActionQueue()
    // 初始化事件监听器
    this.initEvent()
  }
  /**
   * 处理逻辑
   */
  update(){
    if (this.checked){
      this.microCircle.area.point.moveToXY(this.area.point.x + this.area.radius * Math.cos(this.direction), this.area.point.y + this.area.radius * Math.sin(this.direction))
    }else{
      this.microCircle.area.point.moveToXY(this.area.point.x, this.area.point.y )
    }
    //this.actionQueue.update()
  }
  /**
   * 将摇杆绘制在canvas上
   */
  drawToCanvas(ctx) {
    super.drawToCanvas(ctx)

    //画外圆
    ctx.beginPath();
    ctx.arc(this.area.point.x, this.area.point.y, this.area.radius, 0, 2 * Math.PI, false); // 顺时针
    ctx.fillStyle = this.color; // 填充颜色,默认是黑色
    ctx.fill(); // 画实心圆
    //画内圆
    this.microCircle.drawToCanvas(ctx)
  }
  /**
   * 玩家响应手指的触摸事件
   * 改变摇杆状态
   */
  initEvent() {
    
    databus.eventManager.addEventListener('rocker_checked', ((e)=>{
      console.log('Rocker.initEvent == rocker_checked')
      console.log('checked: '+e.checked+', direction: '+e.direction)
      this.checked = e.checked
      this.direction = e.direction
    }).bind(this))
  }
}
