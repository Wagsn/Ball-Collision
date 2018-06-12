/**
 * 游戏基础的坐标类，用来表示在屏幕上的一个点
 */
export default class Point {
  constructor(x, y) { 
    this.x = x
    this.y = y
  }
  equals(po){
    return (this.x === po.x && this.y === po.y)
  }
  toString(){
    return '{ x: '+this.x+', y: '+this.y+' }'
  }
  /**
   * The distance between point this and point po
   */
  distance(po){
    return Math.pow(Math.pow(this.x - po.x, 2) + Math.pow(this.y - po.y, 2), 0.5)
  }
  distanceXY(x, y) {
    return Math.pow(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2), 0.5)
  }
  /**
   * 坐标移动，通过方向与距离
   */
  move(direction, distance) { 
    // sin y cos x
    this.x += distance * Math.cos(direction)
    this.y += distance * Math.sin(direction)
  }
  /**
   * 坐标移动，通过xy轴偏移量
   */
  moveXY(shiftX, shiftY){
    this.x += shiftX
    this.y += shiftX
  }
  /**
   * 坐标移动，跳跃到某点
   */
  moveTo(po){
    this.moveToXY(po.x, po.y)
  }
  moveToXY(x, y){
    this.x = x
    this.y = y
  }
  /**
   * 计算方向
   */
  directionTo(po){
    this.directionToXY(po.x, po.y)
  }
  /**
   * 获得当前点到目标点的方向
   */
  directionToXY(x, y){
    let radian = 0
    if(y - this.y > 0){ // 1 2
      if(x - this.x > 0){  // 1 sin+ cos+
        radian = Math.asin((y - this.y)/(this.distanceXY(x, y)))
      }else{  // 2 sin+ cos-
        radian = Math.PI - Math.asin((y - this.y) / (this.distanceXY(x, y)))
      }
    }else{  // 2 4
      if (x - this.x > 0) {  // 4 sin- cos+
        radian = Math.asin((y - this.y) / (this.distanceXY(x, y)))
      } else {  // 3 sin- cos-
        radian = -Math.PI - Math.asin((y - this.y) / (this.distanceXY(x, y)))
      }
    }
    return radian
  }
  /**
   * 随机刷新坐标在输入范围内
   */
  randomIn(startX, startY, endX, endY){
    this.moveToXY(startX + Math.random() * (endX - startX), startY + Math.random() * (endY - startY))
  }
  /**
   * 判断是否在输入区域内
   */
  isIn(startX, startY, endX, endY){
    return (this.x > startX && this.y > startY && this.x < endX && this.y < endY)
  }
}