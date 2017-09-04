<template>
  <div class="comment-iframe-div">
    <iframe class="comment-iframe" v-bind:id="'Iframe'+commentid" frameborder="0" height="50" placeholder="请输入评论内容..." contenteditable="true" v-on:keydown="editComment($event)">
    </iframe>
    <div class="comment-iframe-fn">
      <i class="fa fa-smile-o fa-lg" style="color:#408ff2;cursor:pointer;margin:0 10px" v-on:click="toggleExpression(commentid)">
        <div class="expression" style="cursor:auto;" onselect="return false" v-bind:id="'Expression'+commentid">
          <div id="emoji" >
            <img class="emoji" v-bind:src="e.url" alt="" v-for="e in expression.emoji.list" v-on:click="addEmoji($event,commentid)">
          </div>
        </div>
      </i>
      <div class="flex-row-emp"></div>
      <div class="flex-row-emp" style="color:#8a6d3b;text-align:right;" v-show="commentinfo.error">{{commentinfo.msg}}</div>
      <div class="flex-row-emp" style="color:#3c763d;text-align:right;" v-show="commentinfo.suc">{{commentinfo.msg}}</div>
      <div v-show="commentinfo.errsign" style="color:#8a6d3b;">当前未登录或登录超时，请
        <router-link :to="{ name: 'Signin'}"> 登录 </router-link>后评论</div>
      <button class="btn btn-default btn-xs" style="color:#408ff2;margin:0 10px" v-if="commentid==''" v-on:click="comment(commentid)"><i class="fa fa-paper-plane-o"></i> 评论</button>
      <button class="btn btn-default btn-xs" style="color:#408ff2;margin:0 10px" v-else v-on:click="comment(commentid)"><i class="fa fa-paper-plane-o"></i> 发送</button>
    </div>
  </div>
</template>
<script>
import Util from '../assets/js/util.js'

export default {
  props: ['commentid', 'commentinf'],
  data() {
    return {
      expression: {
        emoji: {
          list: [],
          url: ''
        }
      },
      // commentIframe: [],
      commentinfo: {
        suc: false,
        error: false,
        errsign: false,
        msg: ''
      }
    }
  },
  created() {
    this.User = global.User;
    this.expression.emoji.url = global.expression.emoji;
    /*初始化表情列表*/
    var url = this.expression.emoji.url;
    for (var i = 0; i < 30; i++) {
      this.expression.emoji.list[i] = {
        name: 'emoji-' + (i + 1),
        url: url + 'emoji-' + (i + 1) + '.png'
      }
    };
  },
  methods: {
    toggleExpression(id) {
      $("#Expression" + id).toggle();
    },
    addEmoji(e, id) {
      var _win = $("#Iframe" + id)[0].contentWindow;
      if (navigator.userAgent.indexOf("MSIE") >= 0) {
        _win.selection.createRange().pasteHTML('<img src=' + e.target.src + ' style="width:20px;height:20px;">');
      } else {
        _win.focus();
        _win.document.execCommand('InsertHtml', '', '<img src=' + e.target.src + ' style="width:20px;height:20px;">');
      }
    },
    initCommentinfo() {
      this.commentinfo.error = false;
      this.commentinfo.suc = false;
      this.commentinfo.errsign = false;
      this.commentinfo.msg = '';
    },
    comment(id) {
      var _win = $("#Iframe" + id)[0].contentWindow;
      this.initCommentinfo();
      if (!this.User._id) {
        this.commentinfo.errsign = true;
        return;
      }
      var that = this;
      var commentBody = _win.document.getElementsByTagName('body')[0];

      var content = Util.commentToSave(commentBody.innerHTML);
      if (!content) {
        this.commentinfo.error = true;
        this.commentinfo.msg = '评论不得为空';
        return;
      }
      if (!id) {
        var param = {
          postid: this.$route.params.id,
          content: content
        };
        this.$axios.post('/comment', param).then(function(response) {
          if (response.data.recode === '0000') {
            that.commentinfo.suc = true;
            that.commentinfo.msg = response.data.msg;
            // console.log("评论成功");
            commentBody.innerHTML = '';
            that.$emit('submit-comment', response.data.comment);
          } else if (response.data.recode === '5001') {
            that.commentinfo.errsign = true;
          } else {
            // console.log("评论失败");
            that.commentinfo.error = true;
            that.commentinfo.msg = response.data.msg;
          }
          that.loading = false;
        }).catch(function(error) {
          // console.log(error);
        })
      } else {
        var param = {
          postid: this.$route.params.id,
          commentid: id,
          content: content
        };
        if ($(commentBody).find('[user]').length) {
          param.atid = $($(commentBody).find('[user]')[0]).attr('user');
        };
        this.$axios.post('/reply', param).then(function(response) {
          if (response.data.recode === '0000') {
            that.commentinfo.suc = true;
            that.commentinfo.msg = response.data.msg;
            // console.log("回复成功");
            commentBody.innerHTML = '';
            that.$emit('submit-comment', response.data.reply, that.commentinf);
          } else if (response.data.recode === '5001') {
            that.commentinfo.errsign = true;
          } else {
            // console.log("回复失败");
            that.commentinfo.error = true;
            that.commentinfo.msg = response.data.msg;
          }
          that.loading = false;
        }).catch(function(error) {
          // console.log(error);
        })
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img.emoji {
  width: 20px;
  height: 20px;
}

.comment-iframe-div {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
}

.flex-row-emp {
  width: 100%;
  flex: 1;
}

.comment-iframe {
  width: 100%;
  border-radius: 10px 10px 0 0;
  border: 1px solid #B0E2FF;
  padding: 0 5px;
  height: 110px;
  margin: 0;
  resize: none;
  outline: none;
  flex: 1;
}

.comment-iframe-fn {
  position: relative;
  margin: 0;
  height: 40px;
  border-radius: 0 0 10px 10px;
  border: 1px solid #B0E2FF;
  border-top: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.expression {
  position: absolute;
  text-align: left;
  bottom: 10px;
  left: 30px;
  max-width: 150px;
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
</style>
