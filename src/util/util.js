
export default class Util {
  static randomPointIn(startX, startY, endX, endY) {
    return new Point(startX + Math.random() * (endX - startX), startY + Math.random() * (endY - startY))
  }
  // 计算两点之间的距离  
  static distanceBetweenTwoPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  /**
   * 计算方向通过偏移量
   * 点(x1,y1)到点(x2,y2)的方向
   * @param {Number} x1 p1.x
   * @param {Number} y1 p1.y
   * @param {Number} x2 p2.x
   * @param {Number} y2 p2.y
   */
  static directionBetweenTwoPoints(x1, y1, x2, y2) {
    let sx = x2 - x1, sy = y2 - y1;
    let radian = 0;
    if (sy > 0) { // 1 2
      if (sx > 0) {  // 1 sin+ cos+
        radian = Math.asin(sy / Math.sqrt(sx * sx + sy * sy))
      } else {  // 2 sin+ cos-
        radian = Math.PI - Math.asin(sy / Math.sqrt(sx * sx + sy * sy))
      }
    } else {  // 2 4
      if (sx > 0) {  // 4 sin- cos+
        radian = Math.asin(sy / Math.sqrt(sx * sx + sy * sy))
      } else {  // 3 sin- cos-
        radian = -Math.PI - Math.asin(sy / Math.sqrt(sx * sx + sy * sy))
      }
    }
    return radian
  }


  // 计算点(x, y)到经过两点(x1, y1)和(x2, y2)的直线的距离  
  static distanceFromPointToLine(x, y, x1, y1, x2, y2) {
    let a = y2 - y1;
    let b = x1 - x2;
    let c = x2 * y1 - x1 * y2;

    //assert(Math.abs(a) > 0.00001 || Math.abs(b) > 0.00001);  // 

    return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
  }

  // 计算两个向量的夹角，向量(x1, y1)(x2, y2)
  // θ=acos(v1⋅v2/||v1||||v2||) 向量积 = x1*x2+y1*y2
  /**
   * 计算 v2 到 v1 的方位角
   * 从v2到v1的夹角公式: θ=atan2(v2.y,v2.x)−atan2(v1.y,v1.x)
   * @param {Number} x1 v1.x
   * @param {Number} y1 v1.y
   * @param {Number} x2 v2.x
   * @param {Number} y2 v2.y
   */
  static computeAngleBetweenTwoVector(x1, y1, x2, y2) {
    return Math.atan2(y2, x2) - Math.atan2(y1, x1);
  }
  // 通过方位角获取单位向量
  static getVectorForDirection(direction) {
    let x = 1 * Math.cos(direction);
    let y = 1 * Math.sin(direction);
    return { x: x, y: y };
  }
  /**
   * 计算运动球的反射角，
   * 原理：等于运动球的方向的反角加上两倍的运动小球的方向到圆心向量（运动小球圆心到被撞球圆心）的方位角
   * @param {Number} x1 运动球的圆心的x值
   * @param {Number} y1 运动球的圆心的y值
   * @param {Number} dir1 运动球的方向
   * @param {Number} x2 被撞球的圆心的x值
   * @param {Number} y2 被撞球的圆心的y值
   */
  static computeReflectionAngle(x1, y1, dir1, x2, y2) {
    let p = Util.getVectorForDirection(dir1);
    return dir1 + Math.PI + 2 * Util.computeAngleBetweenTwoVector(p.x, p.y, x2 - x1, y2 - y1);
  }
  // 圆与矩形碰撞检测  
  // 圆心(x, y), 半径r, 矩形中心(x0, y0), 矩形上边中心(x1, y1), 矩形右边中心(x2, y2)  
  static isCircleIntersectRectangle(x, y, r, x0, y0, x1, y1, x2, y2) {
    let w1 = Util.distanceBetweenTwoPoints(x0, y0, x2, y2);
    let h1 = Util.distanceBetweenTwoPoints(x0, y0, x1, y1);
    let w2 = Util.distanceFromPointToLine(x, y, x0, y0, x1, y1);
    let h2 = Util.distanceFromPointToLine(x, y, x0, y0, x2, y2);

    if (w2 > w1 + r)
      return false;
    if (h2 > h1 + r)
      return false;

    if (w2 <= w1)
      return true;
    if (h2 <= h1)
      return true;

    return (w2 - w1) * (w2 - w1) + (h2 - h1) * (h2 - h1) <= r * r;
  }
  // 圆与圆碰撞检测  
  // 圆心(x, y), 半径r1, 另一个圆圆心(x0, y0),半径r2, 
  static isCircleIntersectBall(x1, y1, x2, y2, r1, r2) {
    let ca = x1 - x2;
    let cb = y1 - y2;
    let cc = r1 + r2;
    let cd = Math.pow(cc, 2);
    let ce = Math.pow(ca, 2) + Math.pow(cb, 2);
    if (ce < cd) {
      return true;
    }
  }
  /**
   * 求两个矩形相交的面积
   * @param {number} A: rect1.start.x
   * @param {number} B: rect1.start.y
   * @param {number} C: rect1.end.x
   * @param {number} D: rect1.end.y
   * @param {number} E: rect2.rect2.start.x
   * @param {number} F: rect2.start.y
   * @param {number} G: rect2.end.x
   * @param {number} H: rect2.end.y
   * @return {number}
   */
  static computeArea(A, B, C, D, E, F, G, H) {
    // use Vanilla JS if want to be faster
    // http://vanilla-js.com/
    var width = (C - A) + (G - E) - Math.abs(Math.max(G, C) - Math.min(E, A));
    width < 0 && (width = 0);

    var height = (D - B) + (H - F) - Math.abs(Math.max(H, D) - Math.min(F, B));
    height < 0 && (width = 0);

    return (C - A) * (D - B) + (G - E) * (H - F) - width * height;
  }
  static computeAreaNormal(A, B, C, D, E, F, G, H) {
    var width, height;

    if (C <= E || G <= A || D <= F || H <= B)
      width = height = 0;
    else {
      if (E > A) {
        width = G < C ? G - E : C - E;
      } else {
        width = C < G ? C - A : G - A;
      }

      if (F > B) {
        height = H < D ? H - F : D - F;
      } else {
        height = D < H ? D - B : H - B;
      }
    }

    return (C - A) * (D - B) + (G - E) * (H - F) - width * height;
  }
}

/**
 * @param {number} A
 * @param {number} B
 * @param {number} C
 * @param {number} D
 * @param {number} E
 * @param {number} F
 * @param {number} G
 * @param {number} H
 * @return {number}
 */
function computeArea(A, B, C, D, E, F, G, H) {
  let width, height;

  if (C <= E || G <= A || D <= F || H <= B)
    width = height = 0;
  else {
    var tmp = [A, C, E, G].sort(function (a, b) {
      return a - b;
    });

    width = tmp[2] - tmp[1];

    tmp = [B, D, F, H].sort(function (a, b) {
      return a - b;
    });

    height = tmp[2] - tmp[1];
  }

  return (C - A) * (D - B) + (G - E) * (H - F) - width * height;
}

// 矩形一 top-left 坐标 (A, B), C 为 width, D 为 height
// 矩形二 同上
// 如果没有相交，返回 [0, 0, 0, 0]
// 如果相交，假设相交矩形对角坐标 (x0, y0) (x1, y1) -- x1 > x0 & y1 > y0
// return [x0, y0, x1, y1]
function check(A, B, C, D, E, F, G, H) {
  // 转为对角线坐标
  C += A, D += B, G += E, H += F;

  // 没有相交
  if (C <= E || G <= A || D <= F || H <= B)
    return [0, 0, 0, 0];

  var tmpX, tmpY;

  if (E > A) {
    tmpX = G < C ? [E, G] : [E, C];
  } else {
    tmpX = C < G ? [A, C] : [A, G];
  }

  if (F > B) {
    tmpY = H < D ? [F, H] : [F, D];
  } else {
    tmpY = D < H ? [B, D] : [B, H];
  }

  return [tmpX[0], tmpY[0], tmpX[1], tmpY[1]];
}

// a, b 为精灵对象
// a, b 分别拥有键值 img(精灵图像 DOM元素), pos(精灵瞬间位置 top-left 坐标), size(wdith, height 数据)
// rect 参数为 check() 函数返回值
function checkInDetail(a, b, rect) {
  // 离屏 canvas
  var canvas = document.createElement('canvas');
  _ctx = canvas.getContext('2d');

  _ctx.drawImage(a.img, 0, 0, a.size.x, a.size.y);
  // 相对位置
  var data1 = _ctx.getImageData(rect[0] - a.pos.x, rect[1] - a.pos.y, rect[2] - rect[0], rect[3] - rect[1]).data;

  _ctx.clearRect(0, 0, b.size.x, b.size.y);
  _ctx.drawImage(b.img, 0, 0, b.size.x, b.size.y);
  var data2 = _ctx.getImageData(rect[0] - b.pos.x, rect[1] - b.pos.y, rect[2] - rect[0], rect[3] - rect[1]).data;

  canvas = null;

  for (var i = 3; i < data1.length; i += 4) {
    if (data1[i] > 0 && data2[i] > 0)
      return true; // 碰撞
  }

  return false;
}

// a, b 为精灵对象
// a, b 分别拥有键值 img(精灵图像 DOM元素), pos(精灵瞬间位置 top-left 坐标), size(wdith, height 数据)
// rect 参数为 check() 函数返回值
function _checkInDetail(a, b, rect) {
  // 离屏 canvas
  var canvas = document.createElement('canvas');
  _ctx = canvas.getContext('2d');

  // 将 (0, 0) 作为基准点，将 a 放入 (0, 0) 位置
  _ctx.drawImage(a.img, 0, 0, a.size.x, a.size.y);
  _ctx.globalCompositeOperation = 'source-in';
  _ctx.drawImage(b.img, b.pos.x - a.pos.x, b.pos.y - a.pos.y, b.size.x, b.size.y);

  var data = _ctx.getImageData(rect[0] - a.pos.x, rect[1] - a.pos.y, rect[2] - rect[0], rect[3] - rect[1]).data;

  canvas = null;

  // 改回来（虽然并没有什么卵用）
  _ctx.globalCompositeOperation = 'source-over';

  for (var i = 3; i < data.length; i += 4) {
    if (data[i])
      return true;  // 碰撞
  }

  return false;
}