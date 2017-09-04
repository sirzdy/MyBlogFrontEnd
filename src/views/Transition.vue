<template>
  <div>
  </div>
</template>
<script>
export default {
  data() {
      return {}
    },
    mounted() {
      if (global.transition) {
        this.$router.replace(global.transition);
        delete global.transition
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
