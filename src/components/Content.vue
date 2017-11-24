<template>
  <div>
    <div class="post">
      <div class="text-center" v-if="loading">
        <i class="fa fa-spinner fa-spin fa-2x"></i>
      </div>
      <div v-if="error" class="error col-xs-12">
        <div class="alert alert-info">文章不存在</div>
      </div>
      <div v-if="post" class="content">
        <div class="page-header" id="postTitle">
          <h1>
          <small>
            <span class="label label-info" style="background:#2f68b3" data-toggle="tooltip" data-placement="top" title="分类"><i class="fa fa-bookmark"></i> {{ post.category.name }}</span>
          </small>
          <span data-toggle="tooltip" data-placement="top" v-title v-bind:data-title="post.title" title="标题">{{ post.title }} </span>  
          <button class="btn btn-xs btn-default" v-show="post.author&&post.author._id==User._id" v-on:click="goEdit">编辑</button>
          </h1>
          <h4>
          <small class="post-info" data-toggle="tooltip" data-placement="bottom" id="time" title="">
            <i class="fa fa-calendar" ></i> {{post.publishTime|formatTime}}
            <!-- <i class="fa fa-calendar"></i> {{post.updateTime|formatTime}} -->
          </small>
          <small class="post-info" data-toggle="tooltip" data-placement="bottom" title="作者">
            <i class="fa fa-user" v-if='post.author&&post.author.nickname'> {{post.author.nickname}}</i>  
            <i class="fa fa-user" v-else> {{post.author.email}}</i> 
          </small>
          <small class="post-info" data-toggle="tooltip" data-placement="bottom" title="阅读量">
            <i class="fa fa-eye"></i> {{post.view}}
          </small>
          </h4>
        </div>
        <Preview v-bind:content="post.content"></Preview>
        <div class="alert alert-info">
          <i class="fa fa-tags" data-toggle="tooltip" data-placement="top" title="标签"></i>
          <span v-for="tag in post.tags"> {{tag}} </span>
        </div>
        <div>
          <div class="author-card flex-column">
            <div class="flex-column-emp flex-row">
              <img v-bind:src="post.author.avatar||avatarBaseUrl+'default.png'" class="author-card-avatar img-thumbnail">
              <div class="author-card-inf flex-column">
                <div class="flex-column-emp flex-column" v-if="post.author.nickname" style="color:#333;font-size:20px;font-weight:700;">
                  {{post.author.nickname}}
                </div>
                <div class="flex-column-emp flex-column">
                  <div>
                    <i class="fa fa-mars" v-if="post.author.sex=='m'"> </i>
                    <i class="fa fa-venus" v-if="post.author.sex=='f'"> </i>
                    <span v-if="post.author.birthday">{{post.author.birthday|getAge('y')}}岁</span>
                    <a v-bind:href="'mailto:'+post.author.email"><i class="fa fa-envelope"  ></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div style="height:30px;line-height:30px" v-if="post.author.blog">
              <a v-bind:href="post.author.blog" style="color:#333;font-size:16px">{{post.author.blog}}</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 点赞 -->
      <div v-if="post" class="text-center clearfix">
        <div class="flex-row">
          <div class="flex-row-emp"></div>
          <div class="like-area" v-on:click="like">
            <div style="margin-top:15px">
              <i class="fa fa-heart-o fa-3x" v-if="!likeinfo.hasliked"></i>
              <i class="fa fa-heart fa-3x" v-else></i>
            </div>
            <div style="margin-top:5px;font-size:18px">
              {{post&&post.like&&post.like.length||0}}
            </div>
          </div>
          <div style="width:20px;"></div>
          <div class="like-area" v-on:click="reward=!reward">
            <div style="margin-top:15px">
              <i class="fa fa-rmb fa-3x"></i>
            </div>
            <div style="margin-top:5px;font-size:18px">
              打赏
            </div>
          </div>
          <div class="flex-row-emp"></div>
        </div>
        <img src="../assets/images/reward-sm.png" alt="" v-show="reward" style="width:300px;">
        <div class="alert alert-danger  alert-dismissible text-center" v-show="likeinfo.error">
          <button type="button" class="close" v-on:click="likeinfo.error=false"><span aria-hidden="true">&times;</span></button>
          <div v-show="likeinfo.errsign">
            当前未登录或登录超时，请
            <router-link :to="{ name: 'Signin'}"> 登录 </router-link>后点赞
          </div>
          <div v-show="likeinfo.errmsg">
            {{likeinfo.errmsg}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import showdown from 'showdown';
import Util from '../assets/js/util.js'
import Preview from '../components/Preview.vue'
import toc from '../assets/js/showdown-toc.js'

export default {
  data() {
      return {
        menuUpdateSign: false,
        menuList: [],
        avatarBaseUrl: '',
        loading: false,
        post: null,
        error: null,
        User: {},
        time: null,
        reward: false,
        likeinfo: {
          hasliked: false,
          error: false,
          errmsg: '',
          errsign: false
        }
      }
    },
    filters: {
      formatTime: Util.formatTime,
      getAge: Util.getAge
    },
    created() {
      this.getPost();
      this.User = global.User;
      this.avatarBaseUrl = global.avatarBaseUrl;
    },
    updated() {
      var that = this;
      this.activeCommentIframe();
      if (that.post) {
        var converter = new showdown.Converter();
        converter.setOption('tables', true);
        $('#preview').html(converter.makeHtml(this.post.content));
        that.time = '更新于：' + Util.formatTime(that.post.updateTime)
        $("#time").attr("data-original-title", that.time);
        $('[data-toggle="tooltip"]').tooltip();
        $("#menuList").html('<a class="list-group-item list-group-item-info" onclick="document.getElementById(\'postTitle\').scrollIntoView();"><b>标题</b></a>');
        $('#preview').find("h1,h2,h3,h4,h5,h6").each(function(i, item) {
          var tag = $(item).get(0).localName;
          $("#menuList").append('<a class="list-group-item list-group-item-info toc' + tag + '" onclick="document.getElementById(\'toc' + i + '\').scrollIntoView();">' + $(item).text() + '</a>')
          $(item).attr("id", "toc" + i);
        });
        // $('#preview').find("h1,h2,h3,h4,h5,h6").length && $('#menuBtn').show();
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getPost'
    },
    components: {
      Preview
    },
    methods: {
      activeCommentIframe() {
        var doms = $('.comment-iframe');
        for (var i = 0, len = doms.length; i < len; i++) {
          var _win = doms[i].contentWindow; // 我们用 _win 变量代替 iframe window
          var _doc = _win.document; // 用 _doc 变量代替 iframe的document 
          _doc.designMode = 'On';
          _win.blur();
          doms.blur();
        }
      },
      like() {
        var that = this;
        if (!this.User._id) {
          this.likeinfo.error = true;
          this.likeinfo.errsign = true;
          return;
        }
        if (this.likeinfo.hasliked) {
          this.likeinfo.error = true;
          this.likeinfo.errmsg = "已经喜欢过了，不能重复点赞";
          return;
        }
        this.$axios.post('/like', {
          "_id": this.post._id
        }).then(function(response) {
          if (response.data.recode === '0000') {
            // console.log(response.data);
            that.likeinfo.hasliked = true;
            that.post.like = response.data.like;
          } else if (response.data.recode === '5001') {
            that.likeinfo.error = true;
            that.likeinfo.errsign = true;
          } else {
            that.likeinfo.error = true;
            that.likeinfo.errsign = false;
            that.likeinfo.errmsg = response.data.msg;
          }
        }).catch(function(error) {

        })
      },
      goEdit() {
        global.editPostId = this.post._id;
        this.$router.push('/Write');
      },
      getPost() {
        var that = this;
        this.error = null
        this.post = null
        this.loading = true
        var param = {
          _id: this.$route.params.id
        };
        this.$axios.post('/getPost', param).then(function(response) {
          if (response.data.recode === '0000') {
            that.post = response.data.post;
            that.getAuthor();
            that.getCategory();
            if (that.User._id && that.post.like && that.post.like.indexOf(that.User._id) >= 0) {
              that.likeinfo.hasliked = true;
            }


          } else if (response.data.recode == '5005') {
            // console.log("文章不存在");
            that.error = true;
          }
          that.loading = false;
        }).catch(function(error) {
          // console.log(error);
          // that.error = error.toString()
          that.error = true;
          that.loading = false;
        })
      },
      getCategory() {
        var that = this;
        var param = {
          _id: that.post.category
        };
        this.$axios.post('/getCategory', param).then(function(response) {
          if (response.data.recode === '0000') {
            that.post.category = response.data.category;
          } else {

          }
        }, function(response) {
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
        })
      },
      getAuthor() {
        var that = this;
        var param = {
          _id: that.post.author
        };
        // console.log(param)
        this.$axios.post('/getAuthor', param).then(function(response) {
          if (response.data.recode === '0000') {
            that.post.author = response.data.user;
          } else if (response.data.recode == '5005') {
            // console.log("不存在");
          }
        }).catch(function(error) {
          // console.log(error);
        })
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post {}

.content {}

#preview {
  /*font-size: 50%;*/
  margin: 20px 0;
}

.page-header {
  margin-top: 0px;
}

.post-info {
  margin-right: 15px;
  line-height: 25px;
}

.like-area {
  height: 100px;
  width: 100px;
  background: #fff;
  border: 3px solid #dc7560;
  border-radius: 30px;
  margin: 0 auto 10px;
  color: #dc7560;
}

.author-card {
  width: 300px;
  margin: 20px auto;
  /*height: 120px;*/
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #f8f8f8;
}

.author-card-avatar {
  width: 80px;
  margin: 10px;
}

.author-card-inf {
  width: 180px;
  height: 80px;
  margin: 10px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-row-emp {
  width: 100%;
  flex: 1;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-column-emp {
  height: 100%;
  flex: 1;
}

@media screen and (max-width: 440px) {
  .post-info {
    display: block;
  }
}
</style>
