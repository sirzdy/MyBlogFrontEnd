<template>
  <div v-title data-title="张丹阳">
    <Header></Header>
    Index{{msg}}
    <br> {{$router.params}}
    <button v-on:click="show"></button>
  </div>
</template>
<script>
import Header from '../components/Header.vue';

export default {
  data() {
    return {
      msg: '欢迎访问张丹阳的博客'
    }
  },
  components: {
    Header
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
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
