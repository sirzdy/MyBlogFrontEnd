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
  copyTextToClipboard: function(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      document.body.removeChild(textArea);
      return '文本复制成功';
    } catch (err) {
      console.log('Oops, unable to copy');
      document.body.removeChild(textArea);
      return '无法复制！';
    }

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
    var reg = new RegExp('<img src="' + global.serverUrl + 'expression/emoji/' + '([^\.]*).png" style="width:20px;height:20px;">', 'g');
    return input ? input.replace(reg, '[[$1]]') : '';
  },
  commentToShow: function(input) {
    return input ? input.replace(/\[\[(([A-Za-z0-9_-])*)\]\]/g, '<img src="' + global.serverUrl + 'expression/emoji/$1.png" class="emoji">') : '';
  },
  deepCopy: function(source) {
    var result = {};
    for (var key in source) {
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
  getAge: function(birthday, sign) {
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
    if (sign == 'y') {
      return yearDiff;
    }
    if (sign == 'm') {
      return monthDiff;
    }
    if (sign == 'd') {
      return dateDiff;
    }
  },
  hint: function(msg, duration, type) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    var backgroundColor;
    if (type == 'suc') {
      backgroundColor = "#3c763d";
      color = "#ffffff";
    } else if (type == 'fail') {
      backgroundColor = "#8a6d3b";
      color = "#ffffff";
    } else {
      backgroundColor = "#1296db";
      color = "#ffffff";
    }
    m.style.cssText = "width: 60%;min-width: 150px;opacity: 0.9;height: 30px;color: " + color + ";line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 60px;left: 50%;transform:translateX(-50%);z-index: 999999;background: " + backgroundColor + ";font-size: 12px;";
    document.body.appendChild(m);
    setTimeout(function() {
      var d = 0.5;
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      m.style.opacity = '0';
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
  },
  msg: function(msg, fn, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "word-break:break-all;padding-left:5px;padding-right:15px;width: 200px;min-width: 150px;opacity: 0.7;height: 60px;color: rgb(255, 255, 255);line-height: 30px;text-align: left;border-radius: 5px;position: fixed;top: 50px;right: 10px;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;text-overflow:ellipsis;overflow:hidden;";
    var close = document.createElement('i');
    close.className = "fa fa-close";
    close.style.cssText = "position:absolute;right:5px;top:5px;";
    document.body.appendChild(m);
    m.appendChild(close);
    var removeTimeout;
    setTimeout(function() {
      var d = 0.5;
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      m.style.opacity = '0';
      removeTimeout = setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
    close.onclick = function() {
      var e = window.event;
      event.stopPropagation();
      document.body.removeChild(m);
      clearTimeout(removeTimeout);
    }
    m.onclick = function() {
      fn && fn();
    }
  },
  scroll: function() {
    if (!$(global.anchor).length) {
      global.anchor = '#comment';
    }
    $("html, body").animate({
      scrollTop: $(global.anchor).offset().top + "px"
    }, {
      duration: 500,
      easing: "swing"
    });
    console.log($(global.anchor).text());
    $(global.anchor).css({ 'font-weight': 'bold' });
    delete global.anchor;
  }
}
module.exports = Util;
