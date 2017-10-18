<style src="../assets/css/markdown.css"></style>
<template>
  <div id="preview" class="markdown"></div>
</template>
<script>
// import '../assets/js/markdown.js'
import showdown from 'showdown';
export default {
  props: ['content'],
  data() {
    return {

    }
  },
  watch: {
    content: function(val, oldVal) {
      console.log(val);
      var converter = new showdown.Converter();
      converter.setOption('tables',true);
      converter.setOption('strikethrough',true);
      converter.setOption('tasklists',true);
      converter.setOption('smoothLivePreview',true);

      $('#preview').html(converter.makeHtml(val));
      // $('#preview').html(markdown.toHTML(val));
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
