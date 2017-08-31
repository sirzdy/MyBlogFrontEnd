<template>
  <div v-title data-title="登录">
    <Background></Background>
    <div class="signbox container">
      <img src="../assets/favicon.png" class="logo" alt="">
      <div class="col-xs-12 form-group input-group-lg">
        <input type="text" class="form-control margintop20 " v-on:focus="initmsg" placeholder="请输入邮箱" v-model="email">
        <input type="password" class="form-control margintop20 " v-on:focus="initmsg" placeholder="请输入密码" v-model="password">
        <div class="alert alert-danger margintop20" role="alert" v-show="msg.show"><b>{{msg.con}}</b></div>
        <button type="button" class="btn btn-primary btn-lg btn-block margintop20" v-on:click="signin">登录</button>
        <div class="alert alert-success margintop20" role="alert" v-show="suc.show">
          <b><span>登录成功。<router-link :to="backRouter">返回</router-link></span></b>
        </div>
        <div class="alert alert-danger margintop20" role="alert" v-show="err.show"><b>{{err.con}}</b></div>
        <div class="margintop20">
          <i class="fa fa-qq fa-lg pull-left font-black link"></i>
          <i class="fa fa-weibo fa-lg pull-left font-black link"></i>
          <i class="fa fa-weixin fa-lg pull-left font-black link"></i>
          <router-link :to="{ name: 'ChangePassword'}" class="font-black pull-right link">忘记密码</router-link>
          <router-link :to="{ name: 'Signup'}" class="font-black pull-right link">注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Background from '../components/Background.vue';
import router from '../router'

export default {
  data() {
      return {
        'msg': {
          'con': '',
          'show': false
        },
        'suc': {
          'con': '',
          'show': false,
        },
        'err': {
          'con': '',
          'show': false
        },
        'email': 'boxuerixin@qq.com',
        'password': '123456',
        'backRouter': {
          'name': 'Index'
        }
      }
    },
    created() {
      if (global.backRouter && global.backRouter.name) {
        this.backRouter = global.backRouter;
      }
      if (global.Email) {
        this.email = global.Email;
        delete global.Email;
      }
      // console.log(this.backRouter);
    },
    components: {
      Background
    },
    methods: {
      signin: function() {
        this.initmsg();
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
        var that = this;
        var params = {
          'email': this.email,
          'password': this.password
        }
        this.$axios.post('/signin', params).then(function(response) {
          // console.log(response)
          if (response.data.recode === '0000') {
            that.suc.show = true;
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
