<style src="../assets/css/markdown.css"></style>
<template>
  <div id="preview" class="markdown">
  </div>
</template>
<script>
import '../assets/js/markdown.js'
// import showdown from '../assets/js/showdown.js'

export default {
  props: ['content'],
  data() {
    return {

    }
  },
  watch: {
    content: function(val, oldVal) {
      // console.log(showdown);
      // var converter = new showdown.Converter();
      // $('#preview').html(converter.makeHtml(val));
      $('#preview').html(markdown.toHTML(val));
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->