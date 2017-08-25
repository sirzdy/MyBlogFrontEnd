var Util = {
  formatTime: function(time, type) {
    function fix(n) {
      return n < 10 ? '0' + n : n;
    }
    var time = new Date(time);
    if (type == 'date') {
      return time.getFullYear() + '-' + fix(time.getMonth() - 0 + 1) + '-' + fix(time.getDate());
    }
    if (type == 'time') {
      return fix(time.getHours()) + ':' + fix(time.getMinutes()) + ':' + fix(time.getSeconds());
    }
    return time.getFullYear() + '-' + fix(time.getMonth() - 0 + 1) + '-' + fix(time.getDate()) + ' ' + fix(time.getHours()) + ':' + fix(time.getMinutes()) + ':' + fix(time.getSeconds());
  },
  //获取光标位置
  getCursorPos: function(ctrl) {
    var pos = 0; // IE Support
    if (ctrl.selection) {
      var Sel = ctrl.selection.createRange();
      Sel.moveStart('character', -ctrl.value.length);
      pos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
      pos = ctrl.selectionStart;
    return (pos);
  },
  //设置光标位置
  setCursorPos: function(ctrl, pos) {
    if (ctrl.setSelectionRange) {
      ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  },
  commentToSave: function(input) {
    var reg = new RegExp('<img src="' + 'http://localhost:3333/expression/emoji/' + '([^\.]*).png" style="width:20px;height:20px;">', 'g');
    return input ? input.replace(reg, '[[$1]]') : '';
  },
  commentToShow: function(input) {
    return input ? input.replace(/\[\[(([A-Za-z0-9_-])*)\]\]/g, '<img src="http://localhost:3333/expression/emoji/$1.png" class="emoji">') : '';
  },
  deepCopy: function(source) {
    var result = {};
    for (var key in source) {
      // console.log(source[key]);
      // if (typeof source[key] === 'object') {
      //   // 
      //   result[key] = this.deepCopy(source[key])
      // } else {
      //   result[key] = source[key];
      // }
      result[key] = (result[key] instanceof Object ? this.deepCopy(source[key]) : source[key]);
    }
    return result;
  },
  getPageArr: function(pages, page, count) {
    var arr = [];
    count % 2 != 0 && --count;
    count = count > pages ? pages : count;
    if (pages <= count) {
      for (var i = 0; i < count; i++) {
        arr[i] = i + 1;
      }
    } else {
      if (page <= count / 2) {
        for (var i = 0; i < count - 1; i++) {
          arr[i] = i + 1;
        }
        arr[i] = '...';
      } else if (page >= pages - count / 2) {
        arr[0] = '...';
        for (var i = 1; i < count; i++) {
          arr[i] = pages + i - count + 1;
        }
      } else {
        arr[0] = '...';
        for (var i = 1; i < count - 1; i++) {
          arr[i] = page - count / 2 + i;
        }
        arr[i] = '...';
      }
    }
    return arr;
  },
  min: function(a, b) {
    return a < b ? a : b;
  },
  max: function(a, b) {
    return a > b ? a : b;
  },
  getAge: function(birthday,sign) {
    // 字符串 1994-12-25
    var now = new Date();
    var birth = new Date(birthday);
    //还没有出生
    if (now - birth < 0) {
      return -1;
    }
    //获取当前月份天数 下个月的第零天就是这个月份的最后一天
    var days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    var yearDiff = now.getFullYear() - birth.getFullYear();
    var monthDiff = now.getMonth() - birth.getMonth();
    var dateDiff = now.getDate() - birth.getDate();
    //不足一月退位
    if (dateDiff < 0) {
      dateDiff = days + dateDiff;
      monthDiff--;
    }
    //不足一年退位
    if (monthDiff < 0) {
      monthDiff = 12 + monthDiff;
      yearDiff--;
    }
    // return ({ year: yearDiff, month: monthDiff, date: dateDiff });
    if(sign=='y'){
      return yearDiff;
    }
    if(sign=='m'){
      return monthDiff;
    }
    if(sign=='d'){
      return dateDiff;
    }
  }
}
module.exports = Util;
