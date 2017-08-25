<template>
  <div >
    <Header></Header>
    <div class="post-box">
      <Content></Content>
      <Comment></Comment>
    </div>
  </div>
</template>
<script>
import Header from '../components/Header.vue'
import Content from '../components/Content.vue'
import Comment from '../components/Comment.vue'

export default {
  data() {
      return {}
    },
    components: {
      Header,
      Content,
      Comment
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
