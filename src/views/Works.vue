<template>
  <div v-title data-title="作品">
    <Header></Header>
    <div style="max-width:800px;width:96%;background:#337ab7;margin:20px auto;border-radius:15px;padding:20px;">
      <div class="" v-for="sort in works">
        <div class="page-header">
          <h3 style="color:#fff;">{{sort.name}} <small style="color:#eee;">{{sort.description}}</small></h3>
        </div>
        <ul class="list-group">
          <li class="list-group-item" v-for="work in sort.items">
            <big>{{work.name}}</big>
            <small style="color:#999;">{{work.description}}</small>
            <a v-if="work.link" target="_blank" v-bind:href="work.link" style="color:#333;margin:5px;">
              <button class="btn-xs pull-right">查看</button>
            </a>
            <a v-if="work.code" target="_blank" v-bind:href="work.code" style="color:#333;margin:5px;">
              <button class="btn-xs pull-right">源码</button>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '../components/Header.vue'
export default {
  data() {
      return {
        works: null,
      }
    },
    components: {
      Header
    },
    created() {
      var that = this;
      console.log("get works")
      $.getJSON("../../static/works/works.json", function(data) {
        console.log(data);
        if (data.length == 0) {
          that.works = [{
            "name": "暂时没有作品",
            "description": "No works",
            "items": []
          }];
        } else {
          that.works = data;
        }
      });
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
