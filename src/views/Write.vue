<template>
  <div>
    <div id="menu" @click="toggleMenu" style="position:fixed;top:-5px;right:-5px;width:20px;height:20px;border-radius:10px;background:#999;z-index:1060;color:#999;"></div>
    <div class="panel panel-default write-panel" tabindex="-1" v-title data-title="写文章">
      <div class="panel-heading" style="padding-left:0;padding-right:0;padding-top:0px;">
        <div class="col-xs-12 col-sm-6 col-md-6" style="margin-top:10px">
          <div class="input-group">
            <span class="input-group-addon">标题</span>
            <input type="text" class="form-control" placeholder="请输入标题" v-model="post.title">
          </div>
        </div>
        <div class="col-xs-6 col-sm-3 col-md-3" style="margin-top:10px">
          <div class="input-group">
            <span class="input-group-addon">分类</span>
            <select class="form-control" style="border-radius:0" v-model="post.category">
              <option value="" v-for="option in categories" v-bind:value="option">{{option.name}}</option>
            </select>
            <span class="input-group-addon"><i class="fa fa-plus" style="cursor:pointer;" v-on:click="add=true"></i></span>
          </div>
        </div>
        <div class="col-xs-6 col-sm-3 col-md-3" style="margin-top:10px">
          <div class="input-group">
            <span class="input-group-addon">标签</span>
            <input type="text" class="form-control" placeholder="用分号隔开" v-model="post.tags">
          </div>
        </div>
      </div>
      <div class="post-area">
        <textarea class="form-control  write-area" id="content" v-bind:style="{fontSize:fontSize+'px'}" v-model="post.content" @keyup.ctrl.enter="keyup" placeholder="建议本地书写完成，复制粘贴到此处发布..."></textarea>
        <div class="preview-area" readonly="" v-show="previewShow">
          <Preview v-bind:content="post.content"></Preview>
        </div>
      </div>
      <iframe id="upload" style="height:300px;width:100%;" frameborder="0" v-show="uploadShow"></iframe>
      <div class="panel-footer" style="padding:10px 0 0 0;">
        <div class="alert alert-danger margintop20" role="alert" v-show="err.show"><b>{{err.con}}</b></div>
        <div class="col-sm-3 col-xs-12 text-center" style="margin-bottom:10px;padding:0;">
          <!-- <div class="btn-toolbar "> -->
          <div class="btn-group btn-group-sm">
            <button class="btn btn-default" v-on:click="fullscreenToggleWrite"><i class="fa fa-arrows-alt"></i> 专注</button>
            <button class="btn btn-default" v-on:click="fullscreenToggle"><i class="fa fa-tv"></i> 全屏</button>
            <button class="btn btn-default" v-on:click="previewShow=!previewShow"><i class="fa fa-columns"></i> 预览</button>
          </div>
        </div>
        <!-- </div> -->
        <div class="col-sm-3 col-xs-12 text-center" style="margin-bottom:10px;padding:0;">
          <!-- <div class="btn-toolbar"> -->
          <div class="btn-group btn-group-sm">
            <button class="btn btn-default" v-on:click="upload"><i class="fa fa-photo"></i> 传图</button>
            <button class="btn btn-default" v-on:click="fontSize++"><i class="fa fa-search-plus"></i> 放大</button>
            <button class="btn btn-default" v-on:click="fontSize--"><i class="fa fa-search-minus"></i> 缩小</button>
          </div>
          <!-- </div> -->
        </div>
        <div class="col-sm-3 col-xs-12 text-center" style="margin-bottom:10px;padding:0;">
          <!-- <div class="btn-toolbar"> -->
          <div class="btn-group btn-group-sm">
            <button class="btn btn-default" v-on:click="getDrafts" data-toggle="modal" data-target="#drafts"><i class="fa fa-inbox"></i> 草稿箱</button>
            <button class="btn btn-default" v-on:click="saveDraft"><i class="fa fa-save"></i> 存草稿</button>
          </div>
          <!-- </div> -->
        </div>
        <div class="col-sm-3 col-xs-12 text-center" style="margin-bottom:10px;padding:0;">
          <!-- <div class="btn-toolbar"> -->
          <div class="btn-group btn-group-sm">
            <button class="btn btn-default" v-on:click="confirm = 'del'" v-if="post._id"><i class="fa fa-trash-o"></i> 删除</button>
            <button class="btn btn-default" v-on:click="confirm = 'clear'" v-else="!post._id"><i class="fa fa-trash-o"></i> 清空</button>
            <button class="btn btn-default" v-on:click="download"><i class="fa fa-download"></i> 下载</button>
            <button class="btn btn-default" v-on:click="publish" v-if="!post._id"><i class="fa fa-send-o"></i> 发布</button>
            <button class="btn btn-default" v-on:click="update" v-else="post._id"><i class="fa fa-send-o"></i> 更新</button>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <div class="mask" v-show="loading">
        <i class="fa fa-spinner fa-spin fa-4x loading"></i>
      </div>
      <!-- 错误警告-->
      <div class="mask" id="alert" v-show="alert" tabindex="-1" @keyup.esc="alert=false">
        <div class="popup">
          <span class="fa-stack" style="position:absolute;right:15px;top:15px;cursor:pointer" v-on:click="alert=false">
          <i class="fa fa-circle-o fa-stack-2x"></i>
          <i class="fa fa-close fa-stack-1x "></i>
        </span>
          <div class="popup-con" v-show="alert"><i class="fa fa-warning fa-3x" style="color:#8a6d3b;margin-bottom:10px"></i>
            <br>{{err.con}}</div>
          <div class="popup-btn" v-show="alert">
            <div class="col-xs-6 col-xs-offset-3">
              <button id="alertConfirm" class="btn btn-primary btn-block" v-on:click="alert=false">确定</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 成功提示 -->
      <div class="mask" id="alert" v-show="success" tabindex="-1" @keyup.esc="alert=false">
        <div class="popup">
          <span class="fa-stack" style="position:absolute;right:15px;top:15px;cursor:pointer" v-on:click="success=false">
          <i class="fa fa-circle-o fa-stack-2x"></i>
          <i class="fa fa-close fa-stack-1x "></i>
        </span>
          <div class="popup-con" v-show="success"><i class="fa fa-check-circle fa-3x" style="color:#3c763d;margin-bottom:10px"></i>
            <br>
            <strong v-show="suc.type=='publish'||suc.type=='update'">《{{post.title}}》</strong>
            <strong v-show="suc.type=='addCategory'">【{{addCategoryName}}】</strong>
            <br>{{suc.con}}</div>
          <div class="popup-btn" v-show="suc.type=='publish'||suc.type=='update'">
            <div class="col-xs-6">
              <button class="btn btn-primary btn-block" v-on:click="success=false">编辑</button>
            </div>
            <div class="col-xs-6">
              <router-link :to="{ name: 'Post', params: { id: post._id }}" id="successView" class="btn btn-primary btn-block" v-on:click="success=false">
                查看
              </router-link>
            </div>
          </div>
          <div class="popup-btn" v-show="suc.type=='publish'||suc.type=='update'||suc.type=='delete'">
            <div class="col-xs-12">
              <button class="btn btn-default btn-block" v-on:click="success = false;clear()" id="successMore">再写一篇</button>
            </div>
          </div>
          <div class="popup-btn" v-show="suc.type=='addCategory'">
            <div class="col-xs-12">
              <button class="btn btn-default btn-block" v-on:click="success = false;" id="successMore">返回</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 确认删除/清空 -->
      <div class="mask" id="confirm" v-show="confirm" tabindex="-1" @keyup.esc="confirm=false">
        <div class="popup">
          <span class="fa-stack" style="position:absolute;right:15px;top:15px;cursor:pointer" v-on:click="confirm=false">
          <i class="fa fa-circle-o fa-stack-2x"></i>
          <i class="fa fa-close fa-stack-1x "></i>
        </span>
          <div class="popup-con" v-if="confirm=='del'"><i class="fa fa-warning fa-3x " style="color:#a94442;margin-bottom:10px"></i>
            <br>你确定要删除这篇文章吗？
            <br>删除后将无法恢复。</div>
          <div class="popup-con" v-if="confirm=='clear'"><i class="fa fa-warning fa-3x " style="color:#a94442;margin-bottom:10px"></i>
            <br>你确定要清空所有内容吗？
            <br>清空后将无法恢复。</div>
          <div class="popup-btn">
            <div class="col-xs-6">
              <button class="btn btn-primary btn-block" v-on:click="confirm=false" id="confirmCancel">取消</button>
            </div>
            <div class="col-xs-6">
              <button v-if="confirm=='clear'" class="btn btn-danger btn-block" v-on:click="confirm = false;clear()">确定</button>
              <button v-if="confirm=='del'" class="btn btn-danger btn-block" v-on:click="confirm = false;del()">确定</button>
            </div>
          </div>
        </div>
      </div>
      <div class="mask" id="add" v-show="add" tabindex="-1" @keyup.esc="add=false">
        <div class="popup">
          <span class="fa-stack" style="position:absolute;right:15px;top:15px;cursor:pointer" v-on:click="add=false">
          <i class="fa fa-circle-o fa-stack-2x"></i>
          <i class="fa fa-close fa-stack-1x "></i>
        </span>
          <div class="popup-con" style="padding:0 20px;">
            <i class="fa fa-plus-square-o fa-3x " style="color:#538bb1;margin-bottom:10px"></i>
            <input type="text" class="form-control" placeholder="请输入类别名" v-model="addCategoryName" style="margin:20px 0 " id="addInput">
          </div>
          <div class="popup-btn">
            <div class="col-xs-6">
              <button class="btn btn-primary btn-block" v-on:click="add=false">取消</button>
            </div>
            <div class="col-xs-6">
              <button class="btn btn-primary btn-block" v-on:click="add = false;addCategory()" v-bind:disabled="!addCategoryName">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" tabindex="-1" role="dialog" id="drafts">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">
            草稿箱
            <button @click="deleteDrafts" class="btn btn-default btn-xs" v-if="drafts.length">清空草稿箱</button>
            </h4>
          </div>
          <div class="modal-body">
            <div class="text-center" v-if="draftLoading">
              <i class="fa fa-spinner fa-spin fa-2x"></i>
            </div>
            <div class="panel-body">
              <div class="list-group">
                <button v-if="!drafts.length" data-dismiss="modal" type="button" class="list-group-item">
                  暂无草稿
                </button>
                <button type="button" class="list-group-item" v-for="draft in drafts" style="line-height:30px;">
                  <span class="label label-info" data-toggle="tooltip" data-placement="top" title="分类"><i class="fa fa-bookmark"></i> {{categoriesName[draft.category]||'未分类'}}</span>
                  <span data-toggle="tooltip" data-placement="top" title="标题">《{{ draft.title }}》 </span>
                  <div style="color:#999">保存时间：{{draft.saveTime|formatTime}}</div>
                  <div>
                    <button type="button" class="btn btn-default btn-xs" data-dismiss="modal" @click="loadDraft(draft._id)">载入</button>
                    <button type="button" class="btn btn-default btn-xs" @click="deleteDraft(draft._id)">删除</button>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>
    <Header></Header>
  </div>
</template>
<script>
import router from '../router'
import Header from '../components/Header.vue'
import Preview from '../components/Preview.vue'
import Util from '../assets/js/util.js'

import '../assets/js/screenfull.js'
export default {
  data() {
      return {
        // 'title': '',
        // 'category': '',
        // 'tags': '',
        // 'content': '',
        'draftLoading': false,
        'previewShow': false,
        'fontSize': 14,
        'loading': false,
        'alert': false,
        'confirm': false,
        'success': false,
        'add': false,
        'addCategoryName': '',
        'categories': [],
        'categoriesName': {},
        'uploadShow': false,
        'drafts': [],
        'post': {
          'id': '',
          'title': '',
          'category': {},
          'tags': '',
          'content': ''
            // '_id':1
        },
        'err': {
          'con': ''
            // 'show': false
        },
        'suc': {
          'con': '',
          'type': ''
            // 'show':false
        }
      }
    },
    components: {
      Preview,
      Header
    },
    filters: {
      formatTime: Util.formatTime
    },
    updated() {
      if (this.confirm) {
        $("#confirmCancel").focus();
      }
      if (this.alert) {
        $("#alertConfirm").focus();
      }
      if (this.success) {
        if (this.suc.type == 'publish' || this.suc.type == 'update') {
          $("#successView").focus();
        } else if (this.suc.type == 'delete') {
          $("#successMore").focus();
        }
      }
      if (this.add) {
        $("#addInput").focus();
      }
      $(".header").hide();
    },
    created() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      if (global.editPostId) {
        this.post._id = global.editPostId;
        this.getPost();
        delete global.editPostId;
      } else {
        var that = this;
        this.getCategories(function() {
          // that.post.category = that.categories[0];
        });
      }
    },
    methods: {
      keyup() {
        console.log(window.event.keyCode);
      },
      toggleMenu() {
        $(".header").toggle();
      },
      initPost() {
        this.post = {
          'title': '',
          'category': {},
          'tags': '',
          'content': ''
        }
      },
      addCategory() {
        var that = this;
        this.$axios.post('/addCategoryName', {
          'addCategoryName': this.addCategoryName
        }).then(function(response) {
          if (response.data.recode === '0000') {
            that.suc.type = 'addCategory';
            that.suc.con = '添加成功';
            that.success = true;
            that.getCategories();
          } else {
            that.err.con = response.data.msg;
            that.alert = "true";
          }
        }, function(response) {
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
        })
      },
      getCategories(callback) {
        var that = this;
        this.$axios.post('/getCategories', {}).then(function(response) {
          if (response.data.recode === '0000') {
            that.categories = response.data.categories;
            for (var i = 0, len = that.categories.length; i < len; i++) {
              var id = that.categories[i]._id;
              var name = that.categories[i].name;
              that.categoriesName[id] = name;
            }
            callback && callback();
          } else {
            that.err.con = response.data.msg;
            that.alert = "true";
          }
        }, function(response) {
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
        })
      },
      publish() {
        if (!this.post.title) {
          // alert("请输入标题");
          this.alert = "true";
          this.err.con = "请输入标题";
          return;
        }
        if (!this.post.category._id) {
          // alert("请选择类别");
          this.alert = "true";
          this.err.con = "请选择类别";
          return;
        }
        if (!this.post.content) {
          // alert("请输入内容");
          this.alert = "true";
          this.err.con = "文章内容不得为空";
          return;
        }
        var params = {
          'title': this.post.title,
          'category': this.post.category._id,
          'content': this.post.content,
          'tags': this.post.tags && (this.post.tags.split(';')) || !this.post.tags && []
        }
        var that = this;
        this.$axios.post('/publish', params).then(function(response) {
          if (response.data.recode === '0000') {
            that.post._id = response.data._id;
            that.suc.type = 'publish';
            that.success = true;
            that.suc.con = '发布成功';
          } else {
            that.alert = "true";
            that.err.con = response.data.msg;
          }
        }, function(response) {
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
        })
      },
      saveDraft() {
        var params = {
          '_id': this.post._id || '',
          'title': this.post.title,
          'category': this.post.category._id,
          'content': this.post.content,
          'tags': this.post.tags && (this.post.tags.split(';')) || !this.post.tags && []
        }
        if (!params.title || !params.content) {
          Util.hint("保存内容必须包含标题和内容", 1500, 'fail');
          return;
        }
        var that = this;
        this.$axios.post('/saveDraft', params).then(function(response) {
          if (response.data.recode === '0000') {
            Util.hint(response.data.msg)
          } else {
            Util.hint(response.data.msg);
          }
        }, function(response) {
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
        })
      },
      getDrafts() {
        var that = this;
        that.draftLoading = true;
        this.$axios.post('/getDrafts').then(function(response) {
          that.drafts = response.data.list;
          that.draftLoading = false;
        }, function(response) {
          Util.hint("系统错误，请稍后重试", 1500, 'fail');
          that.draftLoading = false;
        })
      },
      loadDraft(id) {
        var that = this;
        that.loading = true;
        this.$axios.post('/loadDraft', {
          _id: id
        }).then(function(response) {
          var draft = response.data.draft;
          that.post._id = draft.postid;
          that.post.title = draft.title;
          that.post.tags = draft.tags.join(";");
          that.post.content = draft.content;
          that.getCategories(function() {
            for (var i = 0, len = that.categories.length; i < len; i++) {
              console.log(i)
              if (draft.category == that.categories[i]._id) {
                that.post.category = that.categories[i];
                break;
              }
            }
          });
          that.loading = false;
        }, function(response) {
          Util.hint("载入失败，请稍后重试", 1500, 'fail');
          that.loading = false;
        })
      },
      deleteDrafts() {
        var that = this;
        this.$axios.post('/deleteDrafts').then(function(response) {
          if (response.data.recode === '0000') {
            Util.hint(response.data.msg);
            that.getDrafts();
          } else {
            Util.hint(response.data.msg, 3000, 'fail')
          }
        }, function(response) {
          Util.hint("系统错误，请稍后重试", 1500, 'fail');
        })
      },
      deleteDraft(id) {
        var that = this;
        this.$axios.post('/deleteDraft', {
          _id: id
        }).then(function(response) {
          if (response.data.recode === '0000') {
            Util.hint(response.data.msg)
            that.getDrafts();
          } else {
            Util.hint(response.data.msg, 3000, 'fail')
          }
        }, function(response) {
          Util.hint("系统错误，请稍后重试", 1500, 'fail');
        })
      },
      download() {
        var params = {
          'title': this.post.title,
          'category': this.post.category.name,
          'content': this.post.content,
          'tags': this.post.tags
        }
        var that = this;
        this.$axios.post('/download', params).then(function(response) {
          if (response.data.recode == '0000') {
            var e = document.createElement('a');
            e.href = global.serverUrl + response.data.path;
            e.download = (params.title || 'download') + '.md';
            e.click();
          } else {
            that.alert = "true";
            that.err.con = "系统错误，请稍后重试";
            that.loading = false;
          }
        }).catch(function(error) {
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
          that.loading = false;
        })
      },
      update() {
        if (!this.post.title) {
          // alert("请输入标题");
          this.alert = "true";
          this.err.con = "请输入标题";
          return;
        }
        if (!this.post.category._id) {
          // alert("请选择类别");
          this.alert = "true";
          this.err.con = "请选择类别";
          return;
        }
        if (!this.post.content) {
          // alert("请输入内容");
          this.alert = "true";
          this.err.con = "文章内容不得为空";
          return;
        }
        var params = {
          '_id': this.post._id,
          'title': this.post.title,
          'category': this.post.category._id,
          'content': this.post.content,
          'tags': this.post.tags.split(';')
        }
        var that = this;
        this.$axios.post('/update', params).then(function(response) {
          if (response.data.recode === '0000') {
            that.suc.type = 'update';
            that.suc.con = '修改成功';
            that.success = true;
          } else {
            that.err.con = response.data.msg;
            that.alert = "true";
          }
        }, function(response) {
          // alert('系统错误，请稍后重试')]
          that.alert = "true";
          that.err.con = "系统错误，请稍后重试";
        })
      },
      del() {
        var param = {
          _id: this.post._id
        };
        var that = this;
        this.$axios.post('/delete', param).then(function(response) {
          if (response.data.recode === '0000') {
            that.suc.type = 'delete';
            that.suc.con = '删除成功';
            that.success = true;
            that.clear();
          } else {
            that.err.con = response.data.msg;
            that.alert = "true";
          }
        }).catch(function(error) {
          // console.log(error);
        })
      },
      clear() {
        this.post = {
          'title': '',
          'category': {},
          'tags': '',
          'content': ''
        }
      },
      getPost() {
        var that = this;
        this.loading = true;
        var param = {
          _id: this.post._id
        };
        this.$axios.post('/getPost', param).then(function(response) {
          if (response.data.recode === '0000') {
            // console.log("查询成功");
            var post = response.data.post;
            that.post._id = post._id;
            that.post.title = post.title;
            that.post.tags = post.tags.join(";");
            that.post.content = post.content;
            that.getCategories(function() {
              for (var i = 0, len = that.categories.length; i < len; i++) {
                if (response.data.post.category == that.categories[i]._id) {
                  that.post.category = that.categories[i];
                  break;
                }
              }
            });
          } else if (response.data.recode == '5005') {
            that.alert = "true";
            that.err.con = "文章不存在";
            that.clear();
          }
          that.loading = false;
        }).catch(function(error) {
          that.alert = "true";
          that.err.con = "载入失败(别耍小聪明哟)";
          that.loading = false;
          that.clear();
        })
      },
      fullscreenToggleWrite() {
        if (screenfull.enabled) {
          screenfull.toggle($('#content')[0]);
        }
      },
      fullscreenToggle() {
        if (screenfull.enabled) {
          screenfull.toggle();
        }
      },
      upload() {
        this.uploadShow = !this.uploadShow;
        if (!$('#upload').attr("src")) {
          $('#upload').attr("src", "http://localhost:1225");
        }
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.write-panel {
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.post-area {
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.write-area {
  position: relative;
  flex: 1;
  height: 100%;
  width: 100%;
  resize: none;
}

.preview-area {
  position: relative;
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow: scroll;
}

.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  color: #fff;
}

.popup {
  position: absolute;
  top: 140px;
  width: 260px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  /*height: 200px;*/
  background: #fff;
  padding: 30px 15px;
  border-radius: 10px;
}

.popup-con {
  margin-top: 30px;
  color: #000;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  opacity: 1;
}

.popup-btn {
  margin: 20px 15px 10px;
  height: 40px;
  /*padding: 0 0 20px;*/
}
</style>
