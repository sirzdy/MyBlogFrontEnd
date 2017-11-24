<template>
  <div>
    <div class="modal fade" tabindex="-1" role="dialog" id="avatar">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="initmsg"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">修改头像</h4>
          </div>
          <div class="modal-body">
            <div v-show="!personal">
              <a class="thumbnail avatar-list" v-for="a in avatars" v-bind:class="{'active':avatar==a}">
                <img v-bind:src="a.url" v-on:click="chooseAvatar(a)">
              </a>
            </div>
            <div style="max-width:320px;width:100%;margin:0 auto;" v-show="personal">
              <div class="form-group">
                <button class="btn-default form-control" v-on:click="avatar=null;personal=false;initmsg()">返回默认头像</button>
              </div>
              <input type="file" id="avatar_file" style="display: none" accept="image/*">
              <canvas id="avatar_canvas" style="width:100%;border:1px solid #ccc;"></canvas>
              <div class="text-center">
                <div class="form-group" id="base_tools">
                  <button type="button" class="btn btn-default" id="avatar_reset" data-toggle="tooltip" data-placement="left" title="重置">
                    <i class="fa fa-refresh " aria-hidden="true"></i>
                  </button>
                  <div class="btn-group ">
                    <button type="button" class="btn btn-default" id="avatar_spin_anticlockwise">
                      <i class="fa fa-reply " aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-default" id="avatar_spin_clockwise">
                      <i class="fa fa-share" aria-hidden="true"></i>
                    </button>
                  </div>
                  <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="right" title="More" id="avatar_more">
                    <i class="fa fa-plus-square " aria-hidden="true"></i>
                  </button>
                </div>
                <div class="form-group" id="more_tools" style="display: none;">
                  <button type="button" class="btn btn-default" id="avatar_zoomout">
                    <i class="fa fa-compress " aria-hidden="true"></i>
                  </button>
                  <div class="btn-group">
                    <button type="button" class="btn btn-default" id="avatar_left">
                      <i class="fa fa-arrow-left" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-default" id="avatar_up">
                      <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-default" id="avatar_down">
                      <i class="fa fa-arrow-down" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-default" id="avatar_right">
                      <i class="fa fa-arrow-right" aria-hidden="true"></i>
                    </button>
                  </div>
                  <button type="button" class="btn btn-default" id="avatar_zoomin">
                    <i class="fa fa-expand" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <span style="color:#3c763d;margin:10px;" v-show="sucinfo.show">{{sucinfo.msg}}</span>
            <span style="color:#a94442;margin:10px;" v-show="failinfo.show">{{failinfo.msg}}</span>
            <button type="button" class="btn btn-default" data-toggle="modal" data-target="#inf" data-dismiss="modal" v-on:click="initmsg()">返回</button>
            <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="initmsg">取消</button>
            <button type="button" class="btn btn-primary" v-on:click="saveAva()">保存</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" tabindex="-1" role="dialog" id="inf">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="initmsg"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">个人资料</h4>
          </div>
          <div class="modal-body">
            <table class="table" v-show="!cur" style="margin-bottom:0;">
              <tr>
                <td style="width:80px;position:relative;" rowspan="3" class="inf-avatar" v-on:click="avatar=null;personal=false;initAvatarUrl();initmsg();" data-toggle="modal" data-target="#avatar" data-dismiss="modal">
                  <img id="avatar" v-bind:src="User.avatar||avatarBaseUrl+'default.png'" style="width:80px;margin:10px 10px 30px;">
                  <i class="fa fa-edit inf-avatar-edit">修改</i>
                </td>
                <td>
                  <input type="text" placeholder="请输入昵称" class="form-control" v-model="userinfo.nickname">
                </td>
              </tr>
              <tr>
                <td>
                  <input type="date" class="form-control" v-model="userinfo.birthday">
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex-row btn-group">
                    <label class="flex-row-emp text-center btn btn-default">
                      <input type="radio" name="sex" v-model="userinfo.sex" value="m"> 男
                    </label>
                    <label class="flex-row-emp text-center btn btn-default">
                      <input type="radio" name="sex" v-model="userinfo.sex" value="f"> 女
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:250px;" colspan="2" height="50px;">
                  <div class="input-group">
                    <span class="input-group-addon">博客</span>
                    <input type="text" placeholder="请输入个人博客地址" class="form-control" v-model="userinfo.blog">
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="modal-footer">
            <span style="color:#3c763d;margin:10px;" v-show="sucinfo.show">{{sucinfo.msg}}</span>
            <span style="color:#a94442;margin:10px;" v-show="failinfo.show">{{failinfo.msg}}</span>
            <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="initmsg">取消</button>
            <button type="button" class="btn btn-primary" v-on:click="saveInf()">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Util from '../assets/js/util.js'
export default {
  props: ['User'],
  data() {
    return {
      userinfo: {},
      avatar: null,
      avatars: [],
      avatarBaseUrl: '',
      serverUrl: '',
      cur: false, //cur false 修改基本信息 true 修改头像
      personal: false, //自定义头像
      sucinfo: {
        show: false,
        msg: ''
      },
      failinfo: {
        show: false,
        msg: ''
      }
    }
  },
  mounted() {
    this.initAvatarCrop();
    this.userinfo = Util.deepCopy(User);
    this.avatarBaseUrl = global.avatarBaseUrl;
    this.serverUrl = global.serverUrl;
  },
  methods: {
    initmsg: function() {
      this.sucinfo.show = false;
      this.sucinfo.msg = '';
      this.failinfo.show = false;
      this.failinfo.msg = '';
    },
    saveAva: function() {
      var that = this;
      if (this.avatar && this.avatar.value != '0') {
        var params = {
          avatar: this.avatar.url
        };
        this.postSave(params);
      } else {
        var data = document.getElementById("avatar_canvas").toDataURL('image/png');
        data = data.split(',')[1];
        data = window.atob(data);
        var ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
          ia[i] = data.charCodeAt(i);
        };
        // canvas.toDataURL 返回的默认格式就是 image/png
        var blob = new Blob([ia], {
          type: "image/png"
        });
        var fd = new FormData();
        fd.append('avatar', blob);
        this.$axios.post('/avatar', fd).then(function(response) {
          if (response.data.recode === '0000') {
            var params = {
              avatar: that.serverUrl + response.data.path
            };
            that.postSave(params);
          } else {
            that.failinfo.show = true;
            that.failinfo.msg = response.data.msg;
          }
        }).catch(function(error) {
          that.failinfo.show = true;
          that.failinfo.msg = error.toString();
        });
      }
    },
    saveInf: function() {
      this.initmsg();
      var params = {};
      var updateSign = false;
      if (!User._id) {
        this.failinfo.show = true;
        this.failinfo.msg = '未登录';
        return false;
      }
      if (this.userinfo.nickname.length > 20) {
        this.failinfo.show = true;
        this.failinfo.msg = '昵称不得超过20位';
        return;
      }
      for (var i in this.userinfo) {
        if (this.userinfo[i] && this.userinfo[i] != this.User[i] && i != 'avatar') {
          params[i] = this.userinfo[i];
          updateSign = true;
        }
      }
      if (!updateSign) {
        this.failinfo.show = true;
        this.failinfo.msg = '未修改信息';
        return false;
      }
      this.postSave(params);
    },
    postSave: function(params) {
      var that = this;
      this.$axios.post('/saveInf', params).then(function(response) {
        if (response.data.recode === '0000') {
          that.sucinfo.show = true;
          that.sucinfo.msg = response.data.msg;
          that.$emit('save-inf');
        } else {
          that.failinfo.show = true;
          that.failinfo.msg = response.data.msg;
        }
      }).catch(function(error) {
        that.failinfo.show = true;
        that.failinfo.msg = error.toString();
      });
    },
    initAvatarUrl: function() {
      for (var i = 0; i < 21; i++) {
        // this.avatars[i] = {};
        this.$set(this.avatars, i, {});
        this.avatars[i].url = this.avatarBaseUrl + (i) + '.png';
        this.avatars[i].value = i + '';
      }
    },
    chooseAvatar: function(avatar) {
      if (avatar.value == '0') {
        $('#avatar_file').click();
      } else {
        this.avatar = avatar;
        $("#personal").hide();
      }
    },
    initAvatarCrop: function() {
      var that = this;
      var size = 0;
      var avatar_canvas = document.getElementById("avatar_canvas"),
        avatar_ctx = avatar_canvas.getContext("2d");
      var mx = 0; //水平移动
      var my = 0; //垂直移动
      var r = 0; //旋转次数
      var p1 = {},
        p2 = {};
      var zrate = 1; //上次缩放倍率
      var dis = 10; //微移的距离
      var moveSign = true;
      var img = document.createElement('img');
      $("#avatar_file").on("change", function() {
        var avatar_file = document.getElementById("avatar_file");
        var file = avatar_file.files[0];
        if (!/image\/\w+/.test(file.type)) {
          alert("请选择图片！");
          return false;
        }
        var reader = new FileReader();
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);
        reader.onload = function() {
          img.src = this.result;
          img.onload = function() {
            size = 320;
            avatar_canvas.width = size;
            avatar_canvas.height = size;
            avatar_ctx.translate(size / 2, size / 2);
            reset();
            addEvent();
            //清空input file选择
            avatar_file.value = '';
            that.avatar = that.avatars[0];
            that.personal = true;
          };
        }
      });
      /*绘制*/
      function draw() {
        clr();
        var w = img.width;
        var h = img.height;
        w >= h ? avatar_ctx.drawImage(img, mx - size * w / h / 2, -size / 2 + my, size * w / h, size) : avatar_ctx.drawImage(img, -size / 2 + mx, my - size * h / w / 2, size, size * h / w);
      }
      /*清空画布*/
      function clr() {
        avatar_ctx.save();
        avatar_ctx.setTransform(1, 0, 0, 1, 0, 0);
        avatar_ctx.clearRect(0, 0, size, size);
        avatar_ctx.restore();
      }
      /*拖动*/
      function move(x, y) { //右,下
        if (r % 4 == 0) {
          mx += x;
          my += y;
        }
        if (r % 4 == 1 || r % 4 == -3) {
          my -= x;
          mx += y;
        }
        if (r % 4 == 2 || r % 4 == -2) {
          mx -= x;
          my -= y;
        }
        if (r % 4 == 3 || r % 4 == -1) {
          my += x;
          mx -= y;
        }
        draw();
      }
      /*旋转*/
      function rotate(rs) {
        if (rs == 0) {
          r += 1;
          avatar_ctx.rotate(90 * Math.PI / 180);
        }
        if (rs == 1) {
          r -= 1;
          avatar_ctx.rotate(-90 * Math.PI / 180);
        }
        draw();
      }
      /*缩放*/
      function scale(x, y) {
        avatar_ctx.scale(x, y);
        draw();
      }
      /*重置画布并重绘*/
      function reset() {
        avatar_ctx.setTransform(1, 0, 0, 1, size / 2, size / 2);
        mx = 0;
        my = 0;
        r = 0;
        zrate = 1;
        $("#avatar_zoom").val(25);
        draw();
      }
      /*
      function p(e){
          e.preventDefault();
          var zoom=e.wheelDelta?e.wheelDelta:e.detail;
          var rate=Math.pow(1.001,zoom);
          scale(rate,rate);
      }*/

      function addEvent() {
        /*画布拖动事件绑定*/
        $("#avatar_canvas").on("touchstart", function(e) {
          p1.x = e.touches[0].pageX;
          p1.y = e.touches[0].pageY;
          e.touches[1] && (p2.x = e.touches[1].pageX);
          e.touches[1] && (p2.y = e.touches[1].pageY);
          (e.touches.length == 1) && (moveSign = true);
          (e.touches.length == 2) && (moveSign = false);
          e.preventDefault();
        }).on("touchmove", function(e) {
          var t1 = {},
            t2 = {};
          t1.x = p1.x;
          t1.y = p1.y;
          p2.x && (t2.x = p2.x);
          p2.y && (t2.y = p2.y);
          p1.x = e.touches[0].pageX;
          p1.y = e.touches[0].pageY;
          e.touches[1] && (p2.x = e.touches[1].pageX);
          e.touches[1] && (p2.y = e.touches[1].pageY);
          (e.touches.length == 1) && moveSign && move(p1.x - t1.x, p1.y - t1.y);
          var r;
          var point2 = Math.pow((p2.y - p1.y), 2) + Math.pow((p2.x - p1.x), 2);
          var temp2 = Math.pow((t2.y - t1.y), 2) + Math.pow((t2.x - t1.x), 2);
          t2.x && (r = Math.sqrt(point2 / temp2));
          r && (e.touches.length == 2) && scale(r, r);
          e.preventDefault();
        }).on("touchend", function(e) {

        }).on("touchcancel", function() {

        }).on("mousedown", function(e) {
          p1.x = e.pageX;
          p1.y = e.pageY;
          moveSign = true;
          e.preventDefault();
          $(this).on("mousemove", function(e) {
            var t1 = {};
            t1.x = p1.x;
            t1.y = p1.y;
            p1.x = e.pageX;
            p1.y = e.pageY;
            moveSign && move(p1.x - t1.x, p1.y - t1.y);
            e.preventDefault();
          })
        }).on("mouseup", function(e) {
          $(this).off("mousemove");
        });
        /*缩放*/
        $("#avatar_zoom").on("input change", function() {
          var zoom = $(this).val() * 1 / 50 + 0.5;
          scale(zoom / zrate, zoom / zrate);
          zrate = zoom;
        });
        /*旋转 逆时针，顺时针*/
        $("#avatar_spin_anticlockwise").on("click", function() {
          rotate(1);
        });
        $("#avatar_spin_clockwise").on("click", function() {
          rotate(0);
        });
        /*重置*/
        $("#avatar_reset").on("click", function() {
          reset();
        }).hover(function() {
          $(this).tooltip("toggle");
        });
        /*微 移动*/
        $("#avatar_up").on("click", function() {
          move(0, -dis);
        });
        $("#avatar_right").on("click", function() {
          move(dis, 0);
        });
        $("#avatar_down").on("click", function() {
          move(0, dis);
        });
        $("#avatar_left").on("click", function() {
          move(-dis, 0);
        });
        /*微 缩放*/
        $("#avatar_zoomin").on("click", function() {
          // $("#avatar_zoom").val(parseInt($("#avatar_zoom").val())+1);
          // $("#avatar_zoom").change();
          scale(1.01, 1.01);
        });
        $("#avatar_zoomout").on("click", function() {
          // $("#avatar_zoom").val(parseInt($("#avatar_zoom").val())-1);
          // $("#avatar_zoom").change();
          scale(0.99, 0.99);
        });
        $("#avatar_more").on("click", function() {
          $('#more_tools').toggle();
        }).hover(function() {
          $(this).tooltip("toggle");
        });
      }
    }
  }
}
</script>
<style scoped>
.flex-row {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-column {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-row-emp {
  flex: 1;
  width: 100%;
}

.flex-column-emp {
  flex: 1;
  height: 100%;
}

.inf-avatar-edit {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%)
}

.inf-avatar-edit {
  display: none;
  cursor: pointer;
}

.inf-avatar:hover .inf-avatar-edit {
  display: block;
}

.avatar-list {
  width: 50px;
  border: 1px solid #ccc;
  margin: 5px;
  cursor: pointer;
  display: inline-block;
}
</style>
