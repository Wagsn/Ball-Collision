# Ball-Adventure

## quickstart

## 源码目录介绍
```
./libs
├── action_queue.js                        // 行为队列
├── console.js                             // 控制台交互
├── event_manager.sj                       // 事件管理器：事件的注册和注销，设置和取消事件监听
├── extension.js                           // 原生JS的扩展
├── mat.js                                 // 矩阵
├── message.js                             // 消息
├── pool.js                                // 简易的对象池：对象的重用
├── symbol.js                              // ES6 Symbol简易兼容
└── weapp-adapter.js                       // 小游戏适配器
./res
├── audio                                  // 音频
│   ├── bgm.mp3
│   ├── boom.mp3
│   └── bullet,mp3
├── image                                  // 图像
└── video                                  // 视频
./src
├── base                                  
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs                                    
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── npc
│   └── enemy.js                           // 敌机类
├── player
│   ├── bullet.js                          // 子弹类
│   └── index.js                           // 玩家类
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态
└── main.js                                // 游戏入口主函数

```
## libs
## res
## src
### runtime
#### music.js
[全局音效管理器](./src/runtime/music.js)

