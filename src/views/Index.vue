<template>
  <div v-title data-title="张丹阳">
    <!-- <video v-bind:src="resourceBaseUrl+'video_index.mp4'" class="video" autoplay muted loop oncontextmenu="return false;"></video> -->
    <div class="bg"></div>
    <svg class="svg-z" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280.01 262.42" fill="none" stroke="#fff" stroke-width="5px">
      <path id="path" d="M123,.16c36.58-.71,70.44,1,102,6,13.42,2.14,28.67-4.46,32,7,2.61,9-13.92,32.74-19,36l-12,3C209.92,67,186.19,143,180,171.16c-3.19,14.43-9.42,36.06-2,48,44.27,9.9,76-40,101-39l1,2c2.34,29.21-109.13,89.76-144,79-27.46-69.43,43.56-162.42,63-211v-1c-59.61-2.63-140.8-15.75-174,21-.38,28.16,17.27,27,31,40,1.35,44.31-40.85,41.54-53,9-16.52-44.23,40-94.3,67-106C85.79,6.3,105.21,7.17,123,.16Z" />
    </svg>
    <!--     <div class="head-text">
      <p><span class="element"></span></p>
    </div> -->
    <div class="nav-footer">
      <a href="mailto:boxuerixin@hotmail.com" target="_blank"><i class="fa fa-fw fa-envelope fa-lg" title="邮件"></i></a>
      <a href="http://www.jianshu.com/u/97887a368d79" target="_blank"><i class="fa fa-fw fa-book fa-lg" title="简书"></i></a>
      <a href="https://github.com/sirzdy" target="_blank"><i class="fa fa-fw fa-github fa-lg" title="Github"></i></a>
      <a href="http://weibo.com/u/1811430681" target="_blank"><i class="fa fa-fw fa-weibo fa-lg" title="微博"></i></a>
      <a href="https://www.facebook.com/zhangdanyang" target="_blank"><i class="fa fa-fw fa-facebook fa-lg" title="facebook"></i></a>
    </div>
    <Header></Header>
  </div>
</template>
<script>
import Header from '../components/Header.vue';
// import Typed from '../../static/javascript/typed.min.js';

export default {
  data() {
      return {
        msg: '欢迎访问张丹阳的博客',
        resourceBaseUrl: ''
      }
    },
    components: {
      Header
    },
    created() {
      this.resourceBaseUrl = global.resourceBaseUrl;
    },
    mounted() {
      // var str1 = "<br>我不去想是否能够成功，<br>既然选择了远方，<br>便只顾风雨兼程。";
      // var str2 = "❤❤❤";
      // var str3 = "Let's rock!";
      // var options = {
      //   strings: ['3', '2', '1', str3],
      //   // Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
      //   stringsElement: null,
      //   // typing speed
      //   typeSpeed: 50,
      //   // time before typing starts
      //   startDelay: 5000,
      //   // backspacing speed
      //   backSpeed: 0,
      //   // shuffle the strings
      //   shuffle: false,
      //   // time before backspacing
      //   backDelay: 500,
      //   // loop
      //   loop: false,
      //   // false = infinite
      //   loopCount: false,
      //   // show cursor
      //   showCursor: true,
      //   // character for cursor
      //   cursorChar: "",
      //   // attribute to type (null == text)
      //   attr: null,
      //   // either html or text
      //   contentType: 'html',
      //   // call when done callback function
      //   callback: function() {},
      //   // starting callback function before each string
      //   preStringTyped: function() {},
      //   //callback for every typed string
      //   onStringTyped: function() {},
      //   // callback for reset
      //   resetCallback: function() {}
      // }
      // new Typed(".element", options);
    },
    methods: {
      show: function() {
        console.log(this.$router.params)
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-footer {
  position: fixed;
  bottom: 15px;
  right: 30px;
}

.nav-footer a {
  cursor: pointer;
  color: #fff;
  opacity: 0.6;
}

.nav-footer a:hover {
  opacity: 1;
  text-shadow: 0px 0px 15px rgb(0, 0, 0);
}

.svg-z {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 200px;
}

.video {
  -webkit-user-select: none;
  -webkit-app-region: drag;
  position: fixed;
  left: 0;
  width: 100%;
  top: 0;
  height: 100%;
  object-fit: cover;
}

.bg {
  position: fixed;
  left: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background:#1f5498;
}

#path {
  animation: move 5s linear forwards;
  transform-origin: center center;
}

@keyframes move {
  0% {
    stroke-dasharray: 0, 1394.9px;
    transform: scale(0.8);
  }
  100% {
    stroke-dasharray: 1394.9px, 1394.9px;
    transform: scale(0.8);
  }
  /*  0% {
    stroke-dasharray: 0, 1394.9px;
    transform: scale(1);
  }
  50% {
    stroke-dasharray: 1394.9px, 1394.9px;
    transform: scale(1);
  }
  80% {
    transform: scale(0.2);
  }
  100% {
    transform: translateY(-25%) scale(0.2);
  }*/
}

.head-text {
  padding: 80px 0 0 0;
  min-height: 215px;
  color: #d8bcc6;
  font-size: 1em;
  text-shadow: #fff 0px 1px 2px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

@media screen and (max-width: 400px) {
  .head-text {
    font-size: 1em;
  }
}

.typed-cursor {
  font-weight: 100;
  padding: 0 2px;
  -webkit-animation: blink 1s infinite;
  -moz-animation: blink 1s infinite;
  -ms-animation: blink 1s infinite;
  -o-animation: blink 1s infinite;
  animation: blink 1s infinite;
}

@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
