import View from "../base/view";
import DataBus from "../databus";

let databus = new DataBus()

/**
 * 游戏主界面
 */
export default class Main_UI {
  constructor(o=null){
    o===null ? this.init({}) : this.init(o);
    this.initEvent();
  }
  /**
   * 初始化
   * @param {*} o 
   */
  init(o){
    // 可见性
    this.visible =true;
    // 在屏幕上显示区域，矩形
    this.sx = o.sx || 0;
    this.sy = o.sy || 0;
    this.sw = o.sw || 900;
    this.sh = o.sh || 1300;
    // 背景颜色
    this.color = o.color || '#EEE8AB';  // 'rgba(255, 0, 0, 0.5)';
    // 子view
    this.childs =[]; // View

    let logo = new View({
      id: 5,
      sx: (databus.screenWidth/2-150/2),
      sy: databus.screenHeight/4 -150/2,
      sw: 150,
      sh: 150
    })
    //logo.visible =false
    let tag =new View({
      id: 6,
      sx: 50,
      sy: 50,
      sw: 50,
      sh: 50,
      dfColor: 'white',
      onColor: 'black'
    })
    logo.addChild(tag)

    let btnw =100
    let btnh =50
    let startbtn = new View({
      id: 1,
      sx: (databus.screenWidth-btnw)/2,
      sy: (databus.screenHeight *2/3-btnh/2),
      sw: btnw,
      sh: btnh,
      text: '开始游戏'
    })
    startbtn.addClickListener((e)=>{
      this.visible =false;
    })
    let minbtnw =50;
    let orderbtn = new View({
      id: 2,
      sx: (databus.screenWidth*1/4-minbtnw/2),
      sy: (databus.screenHeight*4/5-btnh/2),
      sw: minbtnw,
      sh: btnh,
      text: '榜单'
    })
    let messagebtn = new View({
      id: 3,
      sx: (databus.screenWidth*2/4-minbtnw/2),
      sy: (databus.screenHeight*4/5-btnh/2),
      sw: minbtnw,
      sh: btnh,
      text: '消息'
    })
    let shopbtn = new View({
      id: 4,
      sx: (databus.screenWidth*3/4-minbtnw/2),
      sy: (databus.screenHeight*4/5-btnh/2),
      sw: minbtnw,
      sh: btnh,
      text: '商店'
    })
    shopbtn.addClickListener((e)=>{
      if(shopbtn.textColor ==='black') {
        shopbtn.textColor ='white'
      } else {
        shopbtn.textColor ='black'
      }
    })
    
    this.childs.push(logo)
    this.childs.push(startbtn);
    this.childs.push(orderbtn);
    this.childs.push(messagebtn);
    this.childs.push(shopbtn);
  }
  initEvent(){}
  /**
   * 在屏幕上绘制自身
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx){
    if (!this.visible) { return }  // 不可见
    //画一个实心矩形
    ctx.fillStyle = this.color;//填充颜色,默认是黑色
    ctx.fillRect(this.sx, this.sy, this.sw, this.sh);

    // 绘制子view
    this.childs.forEach(((item)=>{
      item.drawTo(ctx);
    }).bind(this))
  }
}