<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import CanvasParticle from "assets/js/canvas-particle.js"
export default {
  name: 'app',
  created() {
    //配置
    var config = {
        vx: 4, //点x轴速度,正为右，负为左
        vy: 4, //点y轴速度
        height: 2, //点高宽，其实为正方形，所以不宜太大
        width: 2,
        count: 66, //点个数
        color: "121,162,185", //点颜色
        stroke: "20,174,211", //线条颜色
        dist: 6000, //点吸附距离
        e_dist: 20000, //鼠标吸附加速距离
        max_conn: 10 //点到点最大连接数
      }
      //调用
    CanvasParticle(config);
  }
}
</script>
<style>
body {
  /*background: #145d9c;*/
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}

a:hover {
  text-decoration: none;
}
</style>
