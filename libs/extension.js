
/**
 * 对原生类型的扩展
 */

if (!Array.prototype.indexOf){
  Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) return i;
    }
    return -1;
  };
}

if (!Array.prototype.remove){
  Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
      return this.splice(index, 1);
    }
  };
}