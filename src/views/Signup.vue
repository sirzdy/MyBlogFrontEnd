<template>
  <div v-title data-title="注册">
    <Background></Background>
    <div class="signbox container">
      <img src="../assets/logo.png" class="logo" alt="">
      <div class="col-xs-12 form-group input-group-lg">
        <input type="text" class="form-control margintop20" placeholder="请输入昵称" v-on:focus="initmsg" v-model="nickname">
        <input type="email" class="form-control margintop20" placeholder="请输入邮箱" v-on:focus="initmsg" v-model="email">
        <input type="password" class="form-control margintop20" placeholder="请输入密码" v-on:focus="initmsg" v-model="password">
        <div style="position:relative;" class="input-group-lg">
          <input type="number" class="form-control margintop20" placeholder="请输入验证码" v-on:focus="initmsg" v-model="vercode">
          <button class="btn btn-default btn-sm" style="position:absolute;right:10px;top:50%;transform:translateY(-50%)" :disabled="verify.disabled" v-on:click="initmsg();verifyEmail();">
            <span v-show="!verify.loading">获取</span>
            <i class="fa fa-spinner fa-pulse" v-show='verify.loading'></i>
          </button>
        </div>
        <div class="alert alert-danger margintop20" role="alert" v-show="msg.show"><b>{{msg.con}}</b></div>
        <button type="button" v-on:click="signup" class="btn btn-primary btn-lg btn-block margintop20">注册</button>
        <div class="alert alert-success margintop20" role="alert" v-show="suc.show">
          <b><span v-show="suc.type=='vercode'">获取验证码成功。如果未收到，请查找垃圾箱。</span></b>
          <b><span v-show="suc.type=='signup'">注册成功。去<router-link :to="{ name: 'Signin'}">登录</router-link></span></b>
        </div>
        <div class="alert alert-danger margintop20" role="alert" v-show="err.show"><b>{{err.con}}</b></div>
        <div class="margintop20">
          <router-link :to="{ name: 'Signin'}" class="font-black pull-right link">登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Background from '../components/Background.vue';
import router from '../router'
import encrypt from '../assets/js/encrypt.js';
export default {
  name: 'hello',
  data() {
    return {
      'msg': {
        'con': '',
        'show': false
      },
      'suc': {
        'con': '',
        'show': false,
        'type': '' //vercode,signup
      },
      'err': {
        'con': '',
        'show': false
      },
      'email': '',
      'password': '',
      'vercode': '',
      'nickname': '',
      'verify': {
        'loading': false,
        'disabled': false
      }
    }
  },
  components: {
    Background
  },
  methods: {
    verifyEmail: function() {
      this.verify.disabled = false;
      this.vercode = '';
      if (!this.email) {
        this.msg.con = '请输入邮箱';
        this.msg.show = true;
        return;
      } else {
        var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(this.email)) {
          this.msg.con = '邮箱格式不正确';
          this.msg.show = true;
          return;
        }
      }
      var param = {
        email: this.email,
        signup: true
      };

      var that = this;
      this.verify.loading = true;
      this.verify.disabled = true;
      this.$axios.post('/verifyEmail', param).then(function(response) {
        // console.log(response);
        if (response.data.recode === '0000') {
          // console.log("获取验证码成功");
          that.verify.loading = false;
          that.verify.disabled = false;
          // that.suc.con = '获取验证码成功。如果未收到，请戳我';
          that.suc.show = true;
          that.suc.type = 'vercode';
        } else {
          that.verify.loading = false;
          that.verify.disabled = false;
          that.err.con = response.data.msg;
          that.err.show = true;
        }
      }).catch(function(error) {
        // console.log(error);
        that.verify.loading = false;
        that.verify.disabled = false;
        that.err.con = '获取验证码失败。请核对邮箱或稍后再试。';
        that.err.show = true;
      });
    },
    signup: function() {
      this.initmsg();
      if (!this.nickname) {
        this.msg.con = '请输入昵称';
        this.msg.show = true;
        return;
      } else {
        if (this.nickname.length > 20) {
          this.msg.con = '昵称不得超过20位';
          this.msg.show = true;
          return;
        }
      }
      if (!this.email) {
        this.msg.con = '请输入邮箱';
        this.msg.show = true;
        return;
      } else {
        var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(this.email)) {
          this.msg.con = '邮箱格式不正确';
          this.msg.show = true;
          return;
        }
      }
      if (!this.password) {
        this.msg.con = '请输入密码';
        this.msg.show = true;
        return;
      } else {
        if (this.password.length < 6) {
          this.msg.con = '密码不得少于6位';
          this.msg.show = true;
          return;
        }
      }
      if (!this.vercode) {
        this.msg.con = '请输入验证码';
        this.msg.show = true;
        return;
      } else {
        if (this.vercode.length != 6) {
          this.msg.con = '验证码长度不正确';
          this.msg.show = true;
          return;
        }
      }
      var params = {
        'email': this.email,
        'nickname': this.nickname,
        'password': encrypt(this.password),
        'vercode': this.vercode
      };
      var that = this;
      this.$axios.post('/signup', params).then(function(response) {
        // console.log(response);
        if (response.data.recode === '0000') {
          // that.suc.con = '注册成功。请登录';
          that.suc.show = true;
          that.suc.type = 'signup';
          global.Email = that.email;
        } else {
          that.err.con = response.data.msg;
          that.err.show = true;
        }
      }).catch(function(error) {
        that.err.con = error.toString();
        that.err.show = true;
      });
    },
    initmsg: function() {
      this.msg.con = '';
      this.msg.show = false;
      this.err.con = '';
      this.err.show = false;
      this.suc.con = '';
      this.suc.show = false;
      this.suc.type = '';
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="../assets/css/signbox.css"></style>
<style scoped>
</style>
