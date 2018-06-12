
let nullMat

const __ ={
  width: Symbol('width'),
  height: Symbol('height'),
  data: Symbol('data')
}

/**
 * 矩阵，底层为二维数组
 */
export default class Mat {
  constructor(width =0, height =0, data =null){
    // width and height same is Number
    if (width instanceof Number && height instanceof Number){
      this[__.width] = width
      this[__.height] = height
      if(data instanceof Array && data[0] instanceof Array){
        this[__.data] = new Array(this[__.height])
        for (let i = 0; i < this[__.height]; i++) {
          this[__.data][i] = new Array(this[__.width])
          for (let j = 0; j < this[__.width]; j++){
            this[__.data][i][j] =data[i][j] || data[0][0]
          }
        }
      } else {
        this[__.data] = new Array(this[__.height])
        for (let i = 0; i < this[__.height]; i++) {
          this[__.data][i] = new Array(this[__.width])
        }
      }
    } 
    // width is Mat 
    else if (width instanceof Mat){
      return new Mat(width[__.width], width[__.height], width[__.data])
    } 
    // width is two dims Array
    else if (width instanceof Array && width[0] instanceof Array){
      return new Mat(width[0].length, width.length, width)
    }
    // non parameters
    else {
      return new Mat(0,0)
    }
  }
  get width(){
    return this[__.width] 
  }
  get height(){
    return this[__.height]
  }
  /**
   * width * height
   */
  get size() { return this[__.width] * this[__.height] } 
  /**
   * 获取，x: 1~width, y: 1~height
   */
  get(x,y){
    return this[__.data][y-1][x-1]
  }
  /**
   * 设置，x: 1~width, y: 1~height
   */
  set(x,y,v){
    this[__.data][y-1][x-1] =v
  }
}
