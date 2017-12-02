// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios';
import App from './App'
import router from './router'
import $ from 'jquery'
import './assets/css/bootstrap.min.css'
import './assets/css/font-awesome.min.css'
import './assets/css/style.css'
import './assets/css/animate.css'
import './assets/js/bootstrap.min.js'

//开发环境请求转发
if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = '/api';
} else if (process.env.NODE_ENV == "production") {

}
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
/* eslint-disable no-new */
Vue.directive('title', {
  inserted: function(el, binding) {
    document.title = el.dataset.title
  }
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created() {
    if (process.env.NODE_ENV == "production") {
      var href = window.location.href;
      if (!/^https/.test(href)) {
        href = href.replace('http', 'https');
      }
      if (/^https:\/\/www\./.test(href)) {
        href = href.replace('www.', '');
      }
      if (window.location.href != href) {
        window.location.href = href;
        return;
      }
    }
    global.expression = {};
    global.expression.emoji = '../static/resource/expression/emoji/';
    global.avatarBaseUrl = '../static/resource/avatar/default/';
    global.resourceBaseUrl = '../static/resource/';
    //生产环境与开发环境url配置
    if (process.env.NODE_ENV == "development") {
      global.serverUrl = 'https://localhost/';
      global.chatServerUrl = 'https://localhost';
    } else if (process.env.NODE_ENV == "production") {
      global.serverUrl = 'https://localhost/';
      global.chatServerUrl = 'https://localhost';
      // global.serverUrl = 'https://zhangdanyang.com/';
      // global.chatServerUrl = 'https://zhangdanyang.com';
    }
    (function() {
      var music = document.getElementById("music");
      var musicIframe = document.getElementById("music-iframe");
      musicIframe.src = "//music.163.com/outchain/player?type=4&id=84006&auto=0&height=430";
      music.onclick = function() {
        musicIframe.style.display == "none" ? musicIframe.style.display = "block" : musicIframe.style.display = "none";
      }
      music.onblur = function() {
        musicIframe.style.display = "none";
      }
    })()
  }
})
