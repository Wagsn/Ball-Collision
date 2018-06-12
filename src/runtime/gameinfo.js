const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

/**
 * 全局游戏信息管理，用于游戏信息的显示
 */
export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#A16D35"
    ctx.font      = "40px Arial"

    ctx.fillText(
      score,
      10,
      50
    )
  }

  renderGameOver(ctx, score) {

    ctx.fillStyle = "#A16D35" // 沙棕色(较暗)
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )



    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }
}

