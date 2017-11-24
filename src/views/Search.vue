<template>
  <div v-title data-title="搜索">
    <Header></Header>
    <!-- 基本搜索 start -->
    <div class="col-xs-12">
      <div class="input-group input-group " style="margin:20px 0;" v-show="!advancedSearch">
        <input type="text" class="form-control" placeholder="请输入搜索关键词（站内搜索）" v-model="keyword" @keyup.enter="mode=false;search()"></input>
        <span class="input-group-addon" style="cursor:pointer" v-on:click="mode=false;search()"><i class="fa fa-search"></i></span>
        <span class="input-group-addon" style="cursor:pointer" v-on:click="advancedSearch=!advancedSearch">高级搜索</span>
      </div>
    </div>
    <!-- 基本搜索 end -->
    <!-- 高级搜索 start -->
    <div v-show="advancedSearch" style="margin-top:10px;">
      <div class="col-xs-12 col-sm-12 col-md-12" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">标题</span>
          <input type="text" class="form-control" placeholder="请输入标题" v-model="query.title">
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">内容</span>
          <input type="text" class="form-control" placeholder="请输入内容" v-model="query.content">
        </div>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">作者</span>
          <input type="text" class="form-control" placeholder="请输入作者" v-model="query.author">
        </div>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">分类</span>
          <select class="form-control" style="border-radius:0" v-model="query.category">
            <option value="" v-for="option in categories" v-bind:value="option._id ">{{option.name}}</option>
          </select>
        </div>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">标签</span>
          <input type="text" class="form-control" placeholder="请输入标签" v-model="query.tags">
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">发布时间起始日</span>
          <input type="date" class="form-control" v-model="queryTime.publishTimeStart">
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">发布时间结束日</span>
          <input type="date" class="form-control" v-model="queryTime.publishTimeEnd">
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">最后修改起始日</span>
          <input type="date" class="form-control" v-model="queryTime.updateTimeStart">
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6" style="margin-top:10px">
        <div class="input-group">
          <span class="input-group-addon">最后修改结束日</span>
          <input type="date" class="form-control" v-model="queryTime.updateTimeEnd">
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 text-center" style="margin:10px 0 20px;">
        <div class="btn-group ">
          <button type="button" class="btn btn-default" v-on:click="mode=true;search()">搜索</button>
          <button type="button" class="btn btn-default" v-on:click="advancedSearch=!advancedSearch">基本搜索</button>
        </div>
      </div>
    </div>
    <!-- 高级搜索 end -->
    <div class="text-center" style="margin-bottom:20px">
      <label class="radio-inline">
        <input type="radio" name="order" v-model="order" value="heat"> 按文章热度
      </label>
      <label class="radio-inline">
        <input type="radio" name="order" v-model="order" value="time"> 按发布时间
      </label>
    </div>
    <!-- 搜索结果 start -->
    <div class="text-center" v-show="loading">
      <i class="fa fa-spinner fa-spin fa-2x"></i>
    </div>
    <div v-show="loaded&&!loading&&result.list.length==0" class="col-xs-12">
      <div class="alert alert-result">未找到相关记录</div>
    </div>
    <div v-show="!loading&&result.list.length>0">
      <div class="col-xs-12">
        <div class="alert alert-result">共找到<strong>【{{result.totalSize}}】</strong>条记录，当前显示第【{{result.start}}】-【{{result.end}}】</strong>条记录</div>
      </div>
      <div v-for="post in result.list">
        <Brief v-bind:post="post"></Brief>
      </div>
      <nav aria-label="Page navigation" class="text-center" v-if="listinfo.pages>1">
        <ul class="pagination">
          <li v-bind:class="{'disabled':listinfo.page==1}" v-on:click="listinfo.page!=1&&search(1)">
            <a><i class="fa fa-angle-double-left"></i></a>
          </li>
          <li v-bind:class="{'disabled':listinfo.page==1}" v-on:click="listinfo.page!=1&&search(listinfo.page-1)">
            <a><i class="fa fa-angle-left"></i></a>
            <!--             <a aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a> -->
          </li>
          <li v-for="n in listinfo.pagearr" v-bind:class="{'active':n==listinfo.page,'disabled':n=='...'}" v-on:click="n!='...'&&n!=listinfo.page&&search(n)">
            <a>{{n}}</a>
          </li>
          <li v-bind:class="{'disabled':listinfo.page==listinfo.pages}" v-on:click="listinfo.page!=listinfo.pages&&search(listinfo.page+1)">
            <a><i class="fa fa-angle-right"></i></a>
            <!--             <a aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a> -->
          </li>
          <li v-bind:class="{'disabled':listinfo.page==listinfo.pages}" v-on:click="listinfo.page!=listinfo.pages&&search(listinfo.pages)">
            <a><i class="fa fa-angle-double-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- 搜索结果 end -->
  </div>
</template>
<script>
import Header from '../components/Header.vue';
import Brief from '../components/Brief.vue';
import Util from '../assets/js/util.js'
export default {
  data() {
      return {
        keyword: '',
        query: {},
        queryTime: {},
        categories: [],
        advancedSearch: false,
        hasFlag: false,
        loading: false,
        loaded: false,
        mode: false, //true 高级模式，false 简单模式
        order: 'heat', //排序方式 heat 热度 time 发布时间
        listinfo: {
          page: 0,
          size: 2,
          pages: 0,
          pagearr: [],
          count: 6
        },
        result: {
          totalSize: 0,
          list: [],
          start: 0,
          end: 0
        }
      }
    },
    components: {
      Header,
      Brief
    },
    created() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      if (global.keyword) {
        this.keyword = global.keyword;
        this.search(false);
        delete global.keyword;
      }
      this.getCategories();
    },
    methods: {
      getCategories() {
        var that = this;
        this.$axios.post('/getCategories', {}).then(function(response) {
          if (response.data.recode === '0000') {
            that.categories = response.data.categories;
          }
        })
      },
      initPageArr: function() {
        var that = this;
        $(window).resize(function() {
          var count = parseInt($(window).width() / 40) - 4;
          that.listinfo.count = Util.max(count, 4);
          that.listinfo.pagearr = Util.getPageArr(that.listinfo.pages, that.listinfo.page, that.listinfo.count);
        });
        $(window).resize();
      },
      search: function(page) {
        //查询
        var that = this;
        if (!this.mode) {
          var param = {
            keyword: that.keyword
          };
        } else {
          for (var i in that.queryTime) {
            if (that.queryTime[i]) {
              if (/Start/.test(i)) {
                that.query[i] = that.queryTime[i];
              } else if (/End/.test(i)) {
                var date = new Date(that.queryTime[i]);
                date.setDate(date.getDate() + 1);
                that.query[i] = date;
              }
            } else {
              that.query[i] = '';
            }
          }
          var param = that.query;
        }
        param.size = that.listinfo.size;
        param.page = page ? page : 1;
        if (that.order == 'heat') {
          param.order = {
            view: -1,
            like: -1,
            publishTime: -1
          }
        } else if (that.order == 'time') {
          param.order = {
            publishTime: -1
          }
        }
        that.loading = true;
        that.loaded = false;
        that.result = {};
        that.result.list = [];
        this.$axios.post('/search', param).then(function(response) {
          if (response.data.recode === '0000') {
            // console.log("查询成功");
            // that.postsList = response.data.res.list;
            // that.totalSize = response.data.res.totalSize;
            that.result = response.data.res;
            that.listinfo.pages = Math.ceil(that.result.totalSize / that.listinfo.size);
            that.listinfo.page = page ? page : 1;
            that.initPageArr();
          } else if (response.data.recode == '5005') {
            // console.log("未找到相关记录");
          }
          that.loading = false;
          that.loaded = true;
        }).catch(function(error) {
          // console.log(error);
          that.loading = false;
        })
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.alert-result {
  background: #337ab7;
  color: #f8f8f8;
  font-weight: bold;
  text-align: center;
}
</style>
