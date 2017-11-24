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
    global.expression = {};
    global.expression.emoji = '../static/resource/expression/emoji/';
    global.avatarBaseUrl = '../static/resource/avatar/default/';
    global.resourceBaseUrl = '../static/resource/';
    //生产环境与开发环境url配置
    if (process.env.NODE_ENV == "development") {
      global.serverUrl = 'http://localhost/';
      global.chatServerUrl = 'http://localhost';
    } else if (process.env.NODE_ENV == "production") {
      // global.serverUrl = 'http://localhost/';
      // global.chatServerUrl = 'http://localhost';
      global.serverUrl = 'http://zhangdanyang.com/';
      global.chatServerUrl = 'http://zhangdanyang.com';
    }
  }
})
