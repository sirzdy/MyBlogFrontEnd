<template>
  <div v-title data-title="聊天室">
    <Header></Header>
    <div class="chat flex-column flex-center">
      <div class="flex-column-emp" style="min-height:10px;"></div>
      <!-- user start -->
      <div class="chat-box flex-row flex-center">
        <div class="flex-row-emp" style="min-width:10px;"></div>
        <div class="user-panel flex-column flex-center">
          <div class="user-panel-head">
            通讯录
          </div>
          <div>
            当前共{{}}人在线
          </div>
          <div class="flex-column-emp"></div>
        </div>
        <!-- user end -->
        <div class="flex-row-emp" style="min-width:10px;max-width:50px;"></div>
        <!-- chat start -->
        <div class="chat-panel flex-column flex-center">
          <div class="chat-panel-head flex-row flex-center">
            <i class="fa fa-address-book-o fa-fw"></i>
            <div class="flex-row-emp"></div>
            张丹阳
            <div class="flex-row-emp"></div>
            <i class="fa fa-close fa-fw"></i>
          </div>
          <div class="flex-column-emp"></div>
          <div class="chat-panel-foot flex-column">
            <div class="chat-tools flex-row flex-start">
              <i tabindex="-1" class="fa fa-smile-o fa-lg fa-fw chat-tool" style="position: relative;outline:none;" v-on:click="toggleExpression($event)" v-on:blur="toggleExpression($event,false)">
                <div class="expression" style="cursor:auto;" onselect="return false">
                  <div >
                    <img class="emoji" v-bind:src="e.url" alt="" v-for="e in expression.emoji.list" v-on:click="addEmoji($event)">
                  </div>
                </div>
              </i>
              <i class="fa fa-photo fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-microphone fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-phone fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-video-camera fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-map-marker fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-info fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-at fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-save fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-trash-o fa-lg fa-fw chat-tool"></i>
              <div class="flex-row-emp"></div>
              <button class="btn btn-default" v-on:click="send($event)"><i class="fa fa-send-o"></i> 发送</button>
            </div>
            <iframe class="chat-iframe" frameborder="0" height="99" placeholder="请输入评论内容..." contenteditable="true">
            </iframe>
          </div>
        </div>
        <div class="flex-row-emp" style="min-width:10px;"></div>
      </div>
      <!-- chat end -->
      <div class="flex-column-emp" style="min-height:10px;"></div>
    </div>
  </div>
</template>
<script>
import Header from '../components/Header.vue'
export default {
  data() {
      return {
        User: null,
        expression: {
          emoji: {
            list: [],
            url: 'http://localhost:3333/expression/emoji/'
          }
        },
        chatRooms: [{
          id: '',
          name: ''
        }],
        curChat: {
          id: '',
          userlist: [],
          history: []
        }
      }
    },
    mounted() {
      this.activeChatIframe();
    },
    created() {
      this.User = global.User;
      /*初始化表情列表*/
      var url = this.expression.emoji.url;
      for (var i = 0; i < 30; i++) {
        this.expression.emoji.list[i] = {
          name: 'emoji-' + (i + 1),
          url: url + 'emoji-' + (i + 1) + '.png'
        }
      };
    },
    components: {
      Header
    },
    methods: {
      activeChatIframe() {
        var doms = $('.chat-iframe');
        for (var i = 0, len = doms.length; i < len; i++) {
          var _win = doms[i].contentWindow; // 我们用 _win 变量代替 iframe window
          var _doc = _win.document; // 用 _doc 变量代替 iframe的document 
          _doc.designMode = 'On';
        }
      },
      toggleExpression(e, sign) {
        console.log(e)
        if (sign === true) {
          $(e.target).find(".expression").show()
          $(e.target).focus();
        } else if (sign === false) {
          $(e.target).find(".expression").hide();
        } else {
          $(e.target).find(".expression").toggle();
          $(e.target).focus();
        }
      },
      addEmoji(e) {
        var _win = $($(e.target).parentsUntil(".chat-panel", ".chat-panel-foot")[0]).find(".chat-iframe")[0].contentWindow;
        // _win.document.getElementsByTagName('body')[0].innerHTML = '';
        if (navigator.userAgent.indexOf("MSIE") >= 0) {
          _win.selection.createRange().pasteHTML('<img src=' + e.target.src + ' style="width:20px;height:20px;">');
        } else {
          _win.focus();
          _win.document.execCommand('InsertHtml', '', '<img src=' + e.target.src + ' style="width:20px;height:20px;">');
        }
      },
      send(e) {
        var _win = $($(e.target).parentsUntil(".chat-panel", ".chat-panel-foot")[0]).find(".chat-iframe")[0].contentWindow;
        var content = _win.document.getElementsByTagName('body')[0].innerHTML;
        console.log(content)
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
  position: fixed;
  top: 50px;
  bottom: 0;
  width: 100%;
}

.chat-box {
  width: 100%;
  /*background: #ccc;*/
  height: 600px;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-start {
  justify-content: flex-start;
  align-items: center;
}

.flex-end {
  justify-content: flex-end;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column-emp {
  flex: 1;
  height: 100%;
}

.flex-row-emp {
  flex: 1;
  width: 100%;
}

.chat-panel {
  width: 800px;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  border: 2px solid #ccc;
}

.user-panel {
  width: 300px;
  min-width: 250px;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  border: 2px solid #ccc;
}

.chat-panel-head {
  height: 40px;
  min-height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding: 0 5px;
}

.user-panel-head {
  height: 40px;
  min-height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.chat-panel-foot {
  height: 140px;
  min-height: 140px;
  width: 100%;
  border-top: 1px solid #ccc;
}

.chat-tools {
  height: 40px;
  min-height: 40px;
  color: #666;
  background: #f8f8f8;
  /*border-bottom: 1px solid #ccc;*/
  padding: 0 5px;
}

.chat-tool:hover {
  color: #000;
}

.chat-iframe {
  background: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}


/*表情*/

.expression {
  position: absolute;
  text-align: left;
  bottom: 20px;
  left: 0px;
  max-width: 150px;
  min-width: 150px;
  border-radius: 5px;
  opacity: 0.9;
  background: #B0E2ff;
  border: 1px solid #408ff2;
  padding: 3px;
  display: none;
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  /* you could also put this in a class */
  -webkit-user-select: none;
  /* and add the CSS class here instead */
  -ms-user-select: none;
  user-select: none;
  /**禁止选中文字*/
}

img.emoji {
  width: 20px;
  height: 20px;
}
</style>
