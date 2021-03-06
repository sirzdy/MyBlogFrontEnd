import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
import * as io from 'socket.io-client'


import Hello from '@/views/Hello'
import test from '@/components/test'
const Index = resolve => require(['@/views/Index'], resolve)
const Signin = resolve => require(['@/views/Signin'], resolve)
const Signup = resolve => require(['@/views/Signup'], resolve)
const ChangePassword = resolve => require(['@/views/ChangePassword'], resolve)
const Write = resolve => require(['@/views/Write'], resolve)
const Post = resolve => require(['@/views/Post'], resolve)
const Posts = resolve => require(['@/views/Posts'], resolve)
const Works = resolve => require(['@/views/Works'], resolve)
const Search = resolve => require(['@/views/Search'], resolve)
const Chat = resolve => require(['@/views/Chat'], resolve)
const Transition = resolve => require(['@/views/Transition'], resolve)

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    name: 'Index',
    component: Index
  }, {
    path: '/Hello',
    name: 'Hello',
    component: Hello,
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  }, {
    path: '/test',
    name: 'test',
    component: test
  }, {
    path: '/Signin',
    name: 'Signin',
    component: Signin
  }, {
    path: '/Signup',
    name: 'Signup',
    component: Signup
  }, {
    path: '/ChangePassword',
    name: 'ChangePassword',
    component: ChangePassword
  }, {
    path: '/Write',
    name: 'Write',
    component: Write,
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  }, {
    path: '/Post/:id',
    name: 'Post',
    component: Post
  }, {
    path: '/Posts',
    name: 'Posts',
    component: Posts
  }, {
    path: '/Search',
    name: 'Search',
    component: Search
  }, {
    path: '/Works',
    name: 'Works',
    component: Works
  }, {
    path: '/Transition',
    name: 'Transition',
    component: Transition
  }, {
    path: '/Chat',
    name: 'Chat',
    component: Chat,
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    }
  }]
})
router.beforeEach((to, from, next) => {
  if (from.name == 'Chat' && global.chatSocket) {
    var r = confirm("确定要离开吗？");
    if (r == true) {
      if (global.chatSocket) {
        global.chatSocket.disconnect();
        delete global.chatSocket;
      }
      next();
    } else {
      return;
    }
  }
  if (to.name == 'Transition') {
    next();
  }

  axios.post('/check').then(function(response) {
    global.User = response.data.user || {};
    if (response.data.recode == '0000') {
      if (!global.socket) {
        global.socket = io(global.chatServerUrl + '/msg');
        var socket = global.socket;
        socket.on('connect', function() {
          socket.on('msg info', function() {
            socket.emit('msg info', global.User);
          })
        })
      }
    }
    if (to.meta.requireAuth && response.data.recode !== '0000') { // 判断该路由是否需要登录权限
      router.push('Signin');
      global.backRouter = { 'name': to.name, 'params': to.params };
    } else {
      next();
    }
  });
  global.module = to.name;
});

export default router
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Hello',
//       component: Hello,
//       meta: {
//         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
//       }
//     }, {
//       path: '/test',
//       name: 'test',
//       component: test
//     }, {
//       path: '/Signin',
//       name: 'Signin',
//       component: Signin
//     }, {
//       path: '/Signup',
//       name: 'Signup',
//       component: Signup
//     }
//   ]
// })
