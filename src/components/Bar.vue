<template>
  <div>
    <div class="fix-btn">
      <div class="fn-btn" id="topBtn" @click="scrollTop">
        <i class="fa fa-arrow-up fa-lg"></i>
      </div>
      <div class="fn-btn" id="menuBtn" @click="toggleMenu" style="outline:none;" tabindex="-1" @blur="toggleMenu(false)" v-if="module=='Post'">
        <i class="fa fa-th-list fa-lg"></i>
        <div class="list-group menu-list" id="menuList"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        module: null
      }
    },
    mounted() {
      this.module = global.module;
      $("#topBtn").hide();
      $("#menuBtn").hide();
      // $("#menuBtn").hide();
      window.onscroll = function() {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (osTop > document.documentElement.clientHeight) {
          $("#topBtn").show();
        } else {
          $("#topBtn").hide();
        }
      }
    },
    methods: {
      scrollTop() {
        $('html,body').animate({
          scrollTop: 0
        }, 500)
      },
      toggleMenu(sign) {
        if (!sign) {
          $("#menuList").hide();
        } else {
          $('#menuList').toggle();
        }
      }
    }
}
</script>
<style>
.toch1 {
  text-indent: 0px;
}

.toch2 {
  text-indent: 10px;
}

.toch3 {
  text-indent: 20px;
}

.toch4 {
  text-indent: 30px;
}

.toch5 {
  text-indent: 40px;
}

.toch6 {
  text-indent: 50px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fix-btn {
  position: fixed;
  width: 40px;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.fn-btn {
  color: #fff;
  height: 40px;
  width: 40px;
  display: flex;
  background: #1296db;
  margin-top: 1px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menu-list {
  position: fixed;
  bottom: 20px;
  right: 60px;
  margin-bottom: 0;
  width: 200px;
  max-height: 400px;
  overflow: scroll;
  display: none;
}
</style>
