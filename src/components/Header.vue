<template>
  <div class="header">
    <!-- 大屏 横向 header start -->
    <div class="header-hor">
      <router-link style="width:80px;height:50px" :to="{ name: 'Index'}">
        <div class="header-brand"></div>
      </router-link>
      <router-link class="header-link" v-bind:class="{'header-link-active':module=='Index'}" :to="{ name: 'Index'}">主页</router-link>
      <router-link class="header-link" v-bind:class="{'header-link-active':module=='Posts'}" :to="{ name: 'Posts'}">文集</router-link>
      <router-link class="header-link" v-bind:class="{'header-link-active':module=='Works'}" :to="{ name: 'Works'}">作品</router-link>
      <router-link class="header-link" v-bind:class="{'header-link-active':module=='Chat'}" :to="{ name: 'Chat'}">聊天</router-link>
      <div class="header-emp"></div>
      <div class="header-hor-search-area" v-show="module!='Search'">
        <input type="text" class="form-control search-input pull-right" v-model="keyword" placeholder="搜索" v-on:keyup.esc="keyword=''" v-on:keyup.enter="goSearch">
        <i class="fa fa-search fa-lg search-btn" v-on:click="goSearch"></i>
      </div>
      <router-link class="header-link header-link-btn" :to="{ name: 'Signin'}" v-if="!User._id">登录</router-link>
      <div v-if="User._id" tabindex="-1" style="outline:none;padding:5px;" id="header-hor-dropdown-menu-div" v-on:click="toggleMenu()" v-on:blur="toggleMenu(false)">
        <img v-bind:src="User.avatar||avatarBaseUrl+'default.png'" class="img-rounded" style="width:28px;height:28px;cursor:pointer;">
        <ul id="header-hor-dropdown-menu" class="header-hor-dropdown-menu">
          <li v-on:click="goWrite">
            <i class="fa fa-pencil fa-fw "></i> 写文章
          </li>
          <li>
            <i class="fa fa-envelope-o fa-fw"></i> 我的消息
          </li>
          <li data-toggle="modal" data-target="#inf">
            <i class="fa fa-address-card-o fa-fw"></i> 修改信息
          </li>
          <li v-on:click="goChangePassword">
            <i class="fa fa-key fa-fw"></i> 修改密码
          </li>
          <li v-on:click="signout">
            <i class="fa fa-sign-out fa-fw"></i> 退出
          </li>
        </ul>
      </div>
      <!-- <a class="header-link header-link-btn" :to="{}" v-on:click="signout" v-if="User._id" style="cursor:pointer">登出</a> -->
    </div>
    <!-- 大屏 header end -->
    <!-- 小屏 纵向 header start -->
    <div class="header-ver">
      <div class="header-ver-bar">
        <i class="fa fa-bars fa-lg fa-fw" @click="menuShow=!menuShow"></i>
        <div class="header-emp"></div>
        <router-link style="width:80px;height:50px" :to="{ name: 'Index'}">
          <div class="header-brand"></div>
        </router-link>
        <div class="header-emp"></div>
        <router-link :to="{ name: 'Signin'}" v-if="!User._id">
          <i class="fa fa-user fa-lg fa-fw" style="color:#666;"></i>
        </router-link>
        <img @click="myMenuShow=!myMenuShow" v-if="User._id" v-bind:src="User.avatar||avatarBaseUrl+'default.png'" class="img-rounded" style="width:28px;height:28px;cursor:pointer;">
        <!-- <i class="fa fa-user fa-lg fa-fw"></i> -->
      </div>
      <div class="header-ver-content" ontouchmove="return false;" v-show="menuShow">
        <div class="header-ver-brand"></div>
        <ul class="header-ver-menu">
          <li>
            <router-link class="header-ver-link" v-bind:class="{'header-ver-link-active':module=='Index'}" :to="{ name: 'Index'}">主页</router-link>
          </li>
          <li>
            <router-link class="header-ver-link" v-bind:class="{'header-ver-link-active':module=='Posts'}" :to="{ name: 'Posts'}">文集</router-link>
          </li>
          <li>
            <router-link class="header-ver-link" v-bind:class="{'header-ver-link-active':module=='Works'}" :to="{ name: 'Works'}">作品</router-link>
          </li>
          <li>
            <router-link class="header-ver-link" v-bind:class="{'header-ver-link-active':module=='Chat'}" :to="{ name: 'Chat'}">聊天</router-link>
          </li>
        </ul>
        <div class="header-ver-search-area" v-show="module!='Search'">
          <input type="text" class="form-control search-input pull-right" v-model="keyword" placeholder="搜索" v-on:keyup.esc="keyword=''" v-on:keyup.enter="goSearch">
          <i class="fa fa-search fa-lg search-btn" v-on:click="goSearch"></i>
        </div>
        <div class="header-ver-close" @click="menuShow=!menuShow">
          <div class="fa-stack">
            <i class="fa fa-circle-o fa-stack-2x"></i>
            <i class="fa fa-close fa-stack-1x "></i>
          </div>
        </div>
      </div>
      <div class="header-ver-content" ontouchmove="return false;" v-show="myMenuShow">
        <img v-bind:src="User.avatar||avatarBaseUrl+'default.png'" style="width:80px;margin:40px auto">
        <ul class="header-ver-menu">
          <li v-on:click="goWrite">
            <i class="fa fa-pencil fa-fw "></i> 写文章
          </li>
          <li>
            <i class="fa fa-envelope-o fa-fw"></i> 我的消息
          </li>
          <li data-toggle="modal" data-target="#inf">
            <i class="fa fa-address-card-o fa-fw"></i> 修改信息
          </li>
          <li v-on:click="goChangePassword">
            <i class="fa fa-key fa-fw"></i> 修改密码
          </li>
          <li v-on:click="signout">
            <i class="fa fa-sign-out fa-fw"></i> 退出
          </li>
        </ul>
        <div class="header-ver-search-area" v-show="module!='Search'">
          <input type="text" class="form-control search-input pull-right" v-model="keyword" placeholder="搜索" v-on:keyup.esc="keyword=''" v-on:keyup.enter="goSearch">
          <i class="fa fa-search fa-lg search-btn" v-on:click="goSearch"></i>
        </div>
        <div class="header-ver-close" @click="myMenuShow=!myMenuShow">
          <div class="fa-stack">
            <i class="fa fa-circle-o fa-stack-2x"></i>
            <i class="fa fa-close fa-stack-1x "></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 小屏 header end -->
    <!-- 资料面板 start-->
    <Information v-bind:User="User" @save-inf="saveInf"></Information>
    <!-- 资料面板 end-->
  </div>
</template>
<script>
import Information from '../components/Information.vue';

export default {
  // props: ['User'],
  data() {
      return {
        module: 'Index',
        keyword: '',
        User: {},
        menuShow: false,
        myMenuShow: false,
        avatarBaseUrl: 'http://localhost:3333/avatar/default/'
      }
    },
    created() {
      this.User = global.User;
      this.module = global.module;
    },
    components: {
      Information
    },
    methods: {
      toggleMenu: function(sign) {
        if (sign === true) {
          $('#header-hor-dropdown-menu').show()
          $('#header-hor-dropdown-menu-div').focus();
        } else if (sign === false) {
          $('#header-hor-dropdown-menu').hide();
        } else {
          $('#header-hor-dropdown-menu').toggle();
          $('#header-hor-dropdown-menu-div').focus();
        }
      },
      saveInf: function() {
        var that = this;
        this.$axios.post('/check').then(function(response) {
          that.User = response.data.user || {};
        })
      },
      goWrite: function() {
        this.$router.push('/Write');
      },
      goChangePassword() {
        this.$router.push('/ChangePassword');
      },
      goSearch: function() {
        global.keyword = this.keyword;
        this.$router.push('/Search');
      },
      signout: function() {
        this.$axios.post('/signout').then(function(response) {
          if (response.data.recode === '0000') {
            // console.log("登出成功");
            window.location.reload();
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
/* 大屏幕导航条 start */

.header-hor {
  height: 50px;
  width: 100%;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  /*  background-image: -webkit-gradient(linear, 50% 0%, 0 100%, from(transparent), color-stop(.5, transparent), color-stop(.5, #648ee1), to(#648ee1)),
  -webkit-gradient(linear, 50% 0, 100% 100%, from(transparent), color-stop(.5, transparent), color-stop(.5, #648ee1), to(#648ee1));
  background-size: 10px 5px;
  background-repeat: repeat-x;
  background-position: 0 100%;*/
}

.header-brand {
  width: 80px;
  height: 100%;
  background: url('../assets/favicon.png') no-repeat;
  background-size: 40px 40px;
  background-position: 50% 50%;
}

.header-link {
  width: 100px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: #666666;
  text-align: center;
  /*background: #648ee1;*/
  text-decoration: none !important;
}

.header-link:hover {
  color: #000;
  background: #eee;
}

.header-link-active {
  color: #666;
  background: #eee;
  border-right: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
}

.header-link-btn {
  height: 34px;
  width: 45px;
  min-width: 45px;
  line-height: 34px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-left: 10px;
}

.header-emp {
  flex: 1;
  width: 100%;
}

.search-btn {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  color: #aaa;
}

.search-input {
  border-radius: 15px;
  min-width: 80px;
  max-width: 200px;
}

.search-input:focus {
  min-width: 160px;
  max-width: 300px;
}

.search-input:focus+.search-btn {
  /*color: #76aee4;*/
  color: #538bb1;
}

.header-hor-search-area {
  height: 34px;
  flex: 1;
  position: relative;
}

.header-hor-dropdown-menu {
  position: absolute;
  top: 50px;
  right: 10px;
  list-style: none;
  border: 1px solid #ccc;
  background: #f8f8f8;
  border-top: none;
  z-index: 5;
  color: #555;
  line-height: 30px;
  font-size: 14px;
  padding: 5px 10px 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  outline: none;
  display: none;
}

.header-hor-dropdown-menu li {
  cursor: pointer;
}

.header-hor-dropdown-menu li:not(:last-child) {
  display: block;
  border-bottom: 1px dashed #ddd;
}


/* 大屏幕导航条 end */

@media screen and (max-width: 550px) {
  .header-hor {
    display: none;
  }
}

@media screen and (min-width: 550px) {
  .header-ver {
    display: none;
  }
}


/* 小屏幕导航条 start */

.header-ver-bar {
  width: 100%;
  height: 40px;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  padding: 0 10px;
  color: #666;
}

.header-ver-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #eee 1%, #fff 100%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-ver-brand {
  width: 80px;
  height: 160px;
  background: url('../assets/favicon.png') no-repeat;
  background-size: 80px 80px;
  background-position: 50% 50%;
}

.header-ver-menu {
  flex: 1;
  height: 100%;
  overflow: scroll;
  width: 80%;
  padding: 0;
  margin: 0;
}

.header-ver-menu>li {
  list-style: none;
  height: 40px;
  padding: 0;
  margin: 0;
  text-align: center;
}

.header-ver-link {
  width: 100%;
  line-height: 50px;
  font-size: 24px;
  color: #666666;
  text-align: center;
  /*background: #648ee1;*/
  text-decoration: none !important;
}

.header-ver-link-active {
  color: #333;
}

.header-ver-close {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.header-ver-search-area {
  height: 34px;
  position: relative;
}


/* 小屏幕导航条 end */


/*.header-hor-night {
  background: #222222;
  border-bottom: 1px solid #000000;
}

.header-link-night{
  color:#9c9c9c;
}
.header-link-night:hover,.header-link-btn-night:hover{
  color: #fff;
  background: #181818;
}
.header-link-active-night{
  color: #fff;
  background: #181818;
  border-right: 1px solid #000000;
  border-left: 1px solid #000000;
}
.header-link-btn-night{
  border: 1px solid #000;
}
*/
</style>
