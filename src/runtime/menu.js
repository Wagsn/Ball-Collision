
import Sh_Rectangle from '../base/shape_rectangle'
import Ar_Rectangle from '../base/area_rectangle'
import Point from '../base/point'

import DataBus from '../databus'

let databus =new DataBus()

/**
 * 游戏菜单，
 * 全局菜单，进入游戏所面对的界面，包括选择模式，角色以及存档，查看旁行榜等等
 * popMenu 弹出式按钮
 * floatMenu 浮动按钮
 * button 按钮 style draw 
 */

export default class Menu extends Sh_Rectangle{
  constructor(){
    super('#C1D169', new Ar_Rectangle(new POint(0, 0))) //芥末色
  }
}