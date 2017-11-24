<template>
  <div>
    <Header></Header>
    <div class="post-box">
      <Content></Content>
      <Comment></Comment>
    </div>
    <Bar></Bar>
  </div>
</template>
<script>
import Util from '../assets/js/util.js'
import Header from '../components/Header.vue'
import Content from '../components/Content.vue'
import Comment from '../components/Comment.vue'
import Bar from '../components/Bar.vue'

export default {
  data() {
      return {}
    },
    components: {
      Header,
      Content,
      Comment,
      Bar
    }
}
</script>
<style scoped>
.post-box {
  margin: 0px auto;
  padding: 15px;
  max-width: 800px;
}
</style>
