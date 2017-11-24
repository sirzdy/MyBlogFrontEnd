<template>
  <div class="col-xs-12">
    <div class="panel panel-primary">
      <div class="panel-heading brief-header">
        <span style="width:100%;margin-right:10px">
        <router-link :to="{ name: 'Posts', params: { category: post.category }}">
          <span class="label label-primary" style="background:#2f68b3"><i class="fa fa-bookmark"></i> {{post.category.name}}</span>
        </router-link>
        <router-link :to="{ name: 'Post', params: { id: post._id }}">
          <span style="line-height:25px;color:#ffffff;font-weight:bold;">{{post.title}}</span>
        </router-link>
        <i style="line-height:25px;" class="fa fa-calendar brief-footer-inf pull-right publishTimeDate" > {{post.publishTime|formatTime('date')}} </i>
        <i style="line-height:25px;" class="fa fa-calendar brief-footer-inf pull-right publishTime" > {{post.publishTime|formatTime}} </i>
        </span>
      </div>
      <div class="panel-body">
        {{post.content}}
      </div>
      <div class="panel-footer brief-footer" style="line-height:25px;">
        <i class="fa fa-eye brief-footer-inf"> {{post.view||0}}</i>
        <i class="fa fa-thumbs-up brief-footer-inf"> {{post.like?post.like.length:0}}</i>
        <i class="fa fa-comments brief-footer-inf"> {{post.comment||0}}</i>
        <span style="flex:1"></span>
        <router-link :to="{ name: 'Post', params: { id: post._id }}">
          <button type="button" class="btn btn-default btn-xs goPostButton">阅读全文 <i class="fa fa-toggle-right"></i></button>
          <i class="fa fa-toggle-right goPostIcon"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import Util from '../assets/js/util.js'
export default {
  props: ['post'],
  data() {
    return {

    }
  },
  filters: {
    formatTime: Util.formatTime
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


/*a {
  color: #42b983;
}*/

@media screen and (max-width: 400px) {
  .goPostButton {
    display: none;
  }
  .goPostIcon {
    display: block;
  }
  .publishTime {
    display: none;
  }
}

@media screen and (min-width: 400px) {
  .goPostButton {
    display: block;
  }
  .goPostIcon {
    display: none;
  }
  .publishTimeDate {
    display: none;
  }
}

.brief-header,
.brief-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.brief-footer-inf {
  margin-right: 10px;
}
</style>
