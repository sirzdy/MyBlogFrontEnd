// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios';
import App from './App'
import router from './router'
import $ from 'jquery'
import './assets/css/bootstrap.min.css'
import './assets/css/font-awesome.min.css'
import './assets/js/bootstrap.min.js'


axios.defaults.baseURL = '/api';
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
  components: { App }
})
