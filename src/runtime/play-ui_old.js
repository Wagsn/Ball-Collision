import Game_Map from "../base/game_map-new";

/**
 * 游戏界面
 */
export default class Play_UI {
  constructor(o){ if (o !== undefined) { this.init(o) } } 
  /**
   * 初始化
   * @param {*} o 
   */
  init(o){
    this.pId = o.pId || 0;
    // 屏幕显示区域，地图在其左上角显示  传入的是可以显示区域，需要计算实际显示区域
    this.sx =o.sx || 0;
    this.sy =o.sy || 0;
    this.sw =o.sw || 900;
    this.sh =o.sh || 1600;
    // 如果比较宽
    if(this.sw/this.sh>9/16) {
      this.sh = this.sw* (16/9);
    }else{
      this.sw = this.sh* (9/16);
    }
    // 所占地图面积(固定)，默认长宽比 16:9
    this.mx =0;
    this.my =0;
    this.mw =900;
    this.mh =1600;
    // 比例尺=>显示坐标:地图坐标
    this.scale =(this.sw/this.mw);
    // 背景颜色
    this.color =o.color || 'green';
    // 菜单
    // TODO:
    // 游戏地图:Game_Map，o.gmap: json对象
    let gmap =o.gmap;  // Rectangle:(x:0, y:100, w:900, h:1300)
    // 计算所占地图区域
    gmap.mx =this.mx;
    gmap.my =this.my + 100;
    gmap.mw =900;
    gmap.mh =1300;
    // 计算所占显示区域
    gmap.sx = this.sx + (gmap.mx - this.mx)*this.scale;
    gmap.sy = this.sy + (gmap.my)*this.scale;
    gmap.sw = gmap.mw*this.scale;
    gmap.sh = gmap.mh*this.scale;
    this.gmap = new Game_Map(gmap);
    // 球
    // TODO:
    // 道具地图:Prop_Map，需要计算相对位置
    let pmap =o.pmap;  // Rectangle:(x:0, y:1500, w:900, h:100)
    pmap.padding =1;
    // 计算所占地图区域
    pmap.mx =this.mx;
    pmap.my =this.my + 1500;
    pmap.mw =900;
    pmap.mh =100;
    // 计算所占显示区域
    pmap.sx = this.sx + (pmap.mx -this.mx)*this.scale;
    pmap.sy = this.sy + (pmap.my -this.my)*this.scale;
    pmap.sw = pmap.mw*this.scale;
    pmap.sh = pmap.mh*this.scale;
    this.pmap = new Game_Map(pmap);
  }
  /**
   * 绘制自身,
   * draw self
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawTo(ctx){
    // 1st draw back ground
    ctx.fillStyle =this.color;
    ctx.fillRect(this.sx, this.sy, this.sw, this.sh);
    // 2nd draw game map
    this.gmap.drawTo(ctx);
    // 3rd draw prop map
    this.pmap.drawTo(ctx);
  }
} 
 