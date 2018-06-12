
let instance

/**
 * 全局唯一的的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio() // weapp-adapter.js 
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'res/audio/bgm.mp3'

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'res/audio/bullet.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'res/audio/boom.mp3'

    this.playBgm()

    // TODO：databus.addEventListener('game_play', ()=>{ this.playBgm() })
    wx.onShow(() => { this.playBgm()})  // 当界面显示的时候播放背景音乐
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }
  
}
