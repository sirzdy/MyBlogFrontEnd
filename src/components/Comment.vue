<template>
  <!-- 评论 -->
  <div>
    <CommentIframe v-bind:commentid="''" v-bind:commentinf="null" @submit-comment="addComment"></CommentIframe>
    <div class="comment-header" id="comment">
      <span class="comment-label"><i class="fa fa-comments">评论</i></span>
      <span class="flex-row-emp"></span>
      <span class="comment-label"><small>共</small><strong>{{commentList.info.totalSize}}</strong><small>条评论</small></span>
    </div>
    <div>
      <div v-if="!commentList.info.totalSize" style="text-align:center;margin:10px 0;color:#999">
        暂无评论
      </div>
      <div v-if="commentList.info.totalSize">
        <div v-bind:anchorid="comment._id" v-for="comment in commentList.list" class="comment-box">
          <!-- {{comment._id}} -->
          <div>
            <div class="comment-box-header">
              <img v-bind:src="comment.user.avatar||avatarBaseUrl+'default.png'" style="width:20px;margin-right:5px;"> {{comment.user.nickname||comment.user.email}}
              <div class="flex-row-emp ellipsis"></div>
              <div class="commentTime">{{comment.time|formatTime}}</div>
              <div class="commentTimeDate">{{comment.time|formatTime('date')}}</div>
            </div>
            <!-- v-html="(comment.content|commentToShow)" -->
            <div v-bind:comment="comment.content|commentToShow" class="comment-box-content"></div>
            <div class="comment-box-footer" style="color:#408ff2">
              <div class="flex-row-emp"></div>
              <!-- <div v-if="comment.like"> 共{{comment.like.length}}人点赞 </div> -->
              <!-- <div> 共{{comment.reply.totalSize}}条回复 </div> -->
              <a class="btn btn-xs" style="color:#408ff2;margin:0 10px;" v-if="!comment.likeinfo.hasliked" v-on:click="likeComment(comment)">
                <i class="fa fa-thumbs-o-up"> 点赞
                  <span v-if="comment.like&&comment.like.length">({{comment.like.length}})</span>
                </i>
              </a>
              <a class="btn btn-xs" style="color:#408ff2;margin:0 10px;" v-else disabled>
                <i class="fa fa-thumbs-up"> 已点赞
                  <span v-if="comment.like&&comment.like.length">({{comment.like.length}})</span>
                </i>
              </a>
              <a class="btn btn-xs" style="color:#408ff2;margin:0 10px;" v-on:click="toggleCommentIframe(comment)">
                <i class="fa fa-reply"> 回复
                  <span v-if="comment.reply">({{comment.reply.totalSize}})</span>
                </i>
              </a>
            </div>
            <div class="alert alert-danger  alert-dismissible text-center" style="padding-top:0px;padding-bottom:0px;margin-top:5px;margin-bottom:0px;" v-show="comment.likeinfo.error">
              <button type="button" class="close" v-on:click="comment.likeinfo.error=false"><span aria-hidden="true">&times;</span></button>
              <div v-show="comment.likeinfo.errsign">
                当前未登录或登录超时，请
                <router-link :to="{ name: 'Signin'}"> 登录 </router-link>后点赞
              </div>
              <div v-show="comment.likeinfo.errmsg">
                {{comment.likeinfo.errmsg}}
              </div>
            </div>
          </div>
          <!-- reply start-->
          <div>
            <div style="padding-left:10px;border-left:5px solid #B0E2FF;">
              <!-- reply list start -->
              <div v-bind:anchorid="reply._id" style="width:100%;margin-top:10px;" v-if="comment.reply.totalSize" v-for="reply in comment.reply.list">
                <div class="comment-box-header">
                  <img v-bind:src="reply.user.avatar||avatarBaseUrl+'default.png'" style="width:20px;margin-right:5px;"> {{reply.user.nickname||reply.user.email}}
                  <div class="flex-row-emp"></div>
                  <div class="replyTime">{{reply.time|formatTime}}</div>
                  <div class="replyTimeDate">{{reply.time|formatTime('date')}}</div>
                </div>
                <div v-bind:comment="reply.content|commentToShow" class="comment-box-content"></div>
                <div class="comment-box-footer" style="color:#408ff2">
                  <div class="flex-row-emp"></div>
                  <a class="btn btn-xs" style="color:#408ff2;margin:0 10px;" v-on:click="toggleCommentIframe(comment,reply.user)">
                    <i class="fa fa-reply"> 回复</i>
                  </a>
                </div>
              </div>
              <nav aria-label="Page navigation" class="text-center" v-if="comment.reply.pages>1">
                <ul class="pagination pagination-sm">
                  <li v-bind:class="{'disabled':comment.reply.page==1}" v-on:click="comment.reply.page!=1&&getReply(comment._id,comment.reply,comment.reply.page-1)">
                    <a aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li v-for="n in comment.reply.pagearr" v-bind:class="{'active':n==comment.reply.page,'disabled':n=='...'}" v-on:click="n!='...'&&n!=comment.reply.page&&getReply(comment._id,comment.reply,n)">
                    <a>{{n}}</a>
                  </li>
                  <li v-bind:class="{'disabled':comment.reply.page==comment.reply.pages}" v-on:click="comment.reply.page!=comment.reply.pages&&getReply(comment._id,comment.reply,comment.reply.page+1)">
                    <a aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
              <!-- reply list end -->
              <!-- reply iframe start -->
              <div style="width:100%;flex:1;display:none;" v-bind:id="'CommentArea'+comment._id" v-show="comment.show">
                <CommentIframe v-bind:commentid="comment._id" v-bind:commentinf="comment" @submit-comment="addComment"></CommentIframe>
              </div>
              <!-- reply iframe end -->
            </div>
          </div>
          <!-- reply end-->
        </div>
        <nav aria-label="Page navigation" class="text-center" v-if="commentList.info.pages>1">
          <ul class="pagination pagination-sm">
            <li v-bind:class="{'disabled':commentList.info.page==1}" v-on:click="commentList.info.page!=1&&getComment(commentList.info.page-1)">
              <a aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li v-for="n in commentList.info.pagearr" v-bind:class="{'active':n==commentList.info.page,'disabled':n=='...'}" v-on:click="n!='...'&&n!=commentList.info.page&&getComment(n)">
              <a>{{n}}</a>
            </li>
            <li v-bind:class="{'disabled':commentList.info.page==commentList.info.pages}" v-on:click="commentList.info.page!=commentList.info.pages&&getComment(commentList.info.page+1)">
              <a aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        <!-- <div class="btn btn-block btn-xs btn-default" v-if="commentList.info.more" v-on:click="getComment">加载更多</div>
        <div style="text-align:center;margin:0;color:#999" v-else>到底了</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import Util from '../assets/js/util.js'
import CommentIframe from '../components/CommentIframe.vue'

export default {
  data() {
      return {
        commentinfo: {
          suc: false,
          error: false,
          errsign: false,
          msg: ''
        },
        commentList: {
          list: [],
          info: {
            pagearr: [],
            totalSize: 0,
            erremp: true,
            err: false,
            msg: '',
            page: 0,
            pages: 0,
            size: 3,
            more: false,
            replySize: 3
          }
        }
      }
    },
    filters: {
      formatTime: Util.formatTime,
      commentToShow: Util.commentToShow
    },
    components: {
      CommentIframe
    },
    updated() {
      $("div[comment]").each(function() {
        $(this).html($(this).attr("comment"));
      })
      this.activeCommentIframe();
    },
    mounted() {
      this.activeCommentIframe();

    },
    created() {
      this.User = global.User;
      this.getComment();
    },
    methods: {
      addComment(item, comment) {
        if (comment) {
          this.$set(item, 'user', this.User);
          comment.reply.list.unshift(item);
          comment.reply.totalSize++;
        } else {
          item.user = this.User;
          var reply = {
            page: 0,
            more: false,
            totalSize: 0,
            list: []
          }
          this.$set(item, 'reply', reply);
          var likeinfo = {
            hasliked: false,
            error: false,
            errmsg: '',
            errsign: false
          }
          this.$set(item, 'likeinfo', likeinfo);
          this.$set(item, 'show', false);
          this.commentList.list.unshift(item);
          this.commentList.info.totalSize++;
        }
      },
      activeCommentIframe() {
        var doms = $('.comment-iframe');
        for (var i = 0, len = doms.length; i < len; i++) {
          var _win = doms[i].contentWindow; // 我们用 _win 变量代替 iframe window
          var _doc = _win.document; // 用 _doc 变量代替 iframe的document 
          _doc.designMode = 'On';
        }
      },
      toggleCommentIframe(comment, user) {
        var id = comment._id;
        if (!user) {
          // $("#CommentArea" + id).toggle();
          comment.show = !comment.show;
        } else {
          // $("#CommentArea" + id).show();
          comment.show = true;
        }
        $("#Iframe" + id).focus();
        var _win = $("#Iframe" + id)[0].contentWindow;
        _win.document.getElementsByTagName('body')[0].innerHTML = '';
        if (user) {
          if (navigator.userAgent.indexOf("MSIE") >= 0) {
            _win.selection.createRange().pasteHTML('<span style="color:#408ff2;margin-right:5px;" user="' + user._id + '">@' + user.email + '</span>');
          } else {
            _win.focus();
            _win.document.execCommand('InsertHtml', '', '<a style="color:#408ff2;margin-right:5px;" user="' + user._id + '">@' + user.email + '</a>');
            _win.document.execCommand('InsertHtml', '', '<span>&nbsp;</span>');
          }
        }
        _win.focus();
      },
      getComment(n) {
        var param = {
          postid: this.$route.params.id,
          size: this.commentList.info.size
        };
        if (global.floor) {
          param.floor = global.floor
          delete global.floor;
        }
        if (n) {
          param.page = n
        } else {
          param.page = this.commentList.info.page + 1
        };
        var that = this;
        this.$axios.post('/getComment', param).then(function(response) {
          if (response.data.recode === '0000') {
            // that.commentList.list = that.commentList.list.concat(response.data.res.list);
            that.commentList.list = response.data.res.list;
            that.commentList.info.totalSize = response.data.res.totalSize;
            that.commentList.info.page = response.data.page;
            that.commentList.info.pages = Math.ceil(that.commentList.info.totalSize / that.commentList.info.size);
            that.commentList.info.pagearr = Util.getPageArr(that.commentList.info.pages, that.commentList.info.page, 8);
            if (Math.ceil(that.commentList.info.totalSize / that.commentList.info.size) <= that.commentList.info.page) {
              that.commentList.info.more = false;
            } else {
              that.commentList.info.more = true;
            }

            var list = that.commentList.list;
            for (var i in list) {
              var reply = {
                page: 0,
                more: false,
                totalSize: 0,
                list: []
              }
              that.$set(list[i], 'reply', reply);
              var likeinfo = {
                hasliked: false,
                error: false,
                errmsg: '',
                errsign: false
              }
              that.$set(list[i], 'likeinfo', likeinfo);
              that.$set(list[i], 'show', false);
              if (that.User._id && list[i].like && list[i].like.indexOf(that.User._id) >= 0) {
                list[i].likeinfo.hasliked = true;
              }
              that.getReply(list[i]._id, list[i].reply);
            }

          } else if (response.data.recode === '5005') {
            // console.log(response.data)
          } else {
            // console.log("获取评论失败");
          }
        }).catch(function(error) {
          // console.log(error);
        })
      },
      getReply(id, l, n) {
        n && (l.page = n - 1);
        var param = {
          postid: this.$route.params.id,
          commentid: id,
          page: l.page + 1,
          size: this.commentList.info.replySize
        };
        if (global.flr) {
          param.flr = global.flr
          delete global.flr;
        }
        var that = this;
        this.$axios.post('/getReply', param).then(function(response) {
          if (response.data.recode === '0000') {
            //l.list = l.list.concat(response.data.res.list);
            l.list = response.data.res.list;
            l.totalSize = response.data.res.totalSize;
            l.page = response.data.page;
            l.pages = Math.ceil(l.totalSize / that.commentList.info.replySize);
            l.pagearr = Util.getPageArr(l.pages, l.page, 6);
            if (Math.ceil(l.totalSize / that.commentList.info.replySize) <= l.page) {
              l.more = false;
            } else {
              l.more = true;
            }
            setTimeout(function() {
              if (global.anchor) {
                Util.scroll()
              }
            }, 100)
          } else if (response.data.recode === '5005') {
            // console.log(response.data)
            setTimeout(function() {
              if (global.anchor) {
                Util.scroll()
              }
            }, 100)
          } else {
            // console.log("获取回复失败");
          }
        }).catch(function(error) {
          // console.log(error);
        })


      },
      likeComment(comment) {
        var that = this;
        if (!this.User._id) {
          comment.likeinfo.error = true;
          comment.likeinfo.errsign = true;
          return;
        }
        if (comment.likeinfo.hasliked) {
          comment.likeinfo.error = true;
          comment.likeinfo.errmsg = "已经喜欢过了，不能重复点赞";
          return;
        }
        this.$axios.post('/likeComment', {
          "_id": comment._id
        }).then(function(response) {
          if (response.data.recode === '0000') {
            // console.log(response.data);
            comment.likeinfo.hasliked = true;
            comment.like = response.data.like;
          } else if (response.data.recode === '5001') {
            comment.likeinfo.error = true;
            comment.likeinfo.errsign = true;
          } else {
            comment.likeinfo.error = true;
            comment.likeinfo.errsign = false;
            comment.likeinfo.errmsg = response.data.msg;
          }
        }).catch(function(error) {

        })
      },
    }
}
</script>
<style>
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comment-box {
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
}

.comment-box-header {
  height: 40px;
  border-radius: 10px 10px 0 0;
  border: 1px solid #B0E2FF;
  border-bottom-style: dashed;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.comment-box-content {
  border-left: 1px solid #B0E2FF;
  border-right: 1px solid #B0E2FF;
  padding: 10px 10px;
  line-height: 20px;
}

.comment-box-footer {
  height: 30px;
  border-radius: 0 0 10px 10px;
  border: 1px solid #B0E2FF;
  border-top: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.flex-row-emp {
  width: 100%;
  flex: 1;
}

.comment-iframe {
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
  bottom: 10px;
  left: 30px;
  max-width: 150px;
  border-radius: 5px;
  opacity: 0.9;
  background: #B0E2ff;
  border: 1px solid #408ff2;
}

.comment-header {
  border-bottom: 1px solid #B0E2FF;
  color: #B0E2FF;
  display: flex;
  flex-direction: row;
}

.comment-amount-left {
  height: 13px;
  width: 13;
  border: 13px solid #fff;
  border-left: 13px solid #B0E2FF;
  border-bottom: 13px solid #B0E2FF;
}

.comment-label {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border: 1px solid #B0E2ff;
  border-bottom: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  font-size: 16px;
}

@media screen and (max-width: 400px) {
  .commentTime,
  .replyTime {
    display: none;
  }
}

@media screen and (min-width: 400px) {
  .commentTimeDate,
  .replyTimeDate {
    display: none;
  }
}
</style>
