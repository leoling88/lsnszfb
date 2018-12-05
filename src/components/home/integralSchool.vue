<template>
  <div class="template_container">

    <div class="new_info">
      <span>2018-12-22</span>
      <span><img src="../../../static/images/icon_viewcnt1.png"><em>333</em></span>
      <span @click="thumbsUp">
        <img v-if="zanShow" src="../../../static/images/zan.png">
        <img v-if="zan1Show" src="../../../static/images/zan1.png">
        <em>675</em>
      </span>
    </div>
    <div class="news_cont">
      <p>为进一步加强番禺区农工党党员参政议政能力，2017年11月24-25日，农工党番禺区基层委员会在从化区召开传达学习中共十九大精神大会暨2017年工作总结会议。</p>
      <img src="../../../static/images/banner_item.jpg" alt="">
      <p>为进一步加强番禺区农工党党员参政议政能力，2017年11月24-25日，农工党番禺区基层委员会在从化区召开传达学习中共十九大精神大会暨2017年工作总结会议。</p>
    </div>
  </div>
</template>
<script>
  import api from '../../api/api'
  export default {
    components: {},
    data() {
      return {
        zanShow:true,
        zan1Show:false
      }
    },
    methods: {
      thumbsUp () {// 点赞
        this.zanShow=false;
        this.zan1Show=true;
      }
    },
    mounted(){

    }
  }
</script>
<style lang="less" scoped>
  .news_title{width:80%;height:1rem;margin:0 auto;overflow:hidden;line-height: 1rem;text-align: center;font-size: .45rem;color:#333;text-overflow:ellipsis;white-space: nowrap;}
  .new_info{
    width:100%;height:1rem;line-height: 1rem;text-indent: .2rem;font-size: .35rem;color:#888;overflow:hidden;display: flex;flex-wrap: wrap;
    span{display: block;flex: 1}
    em{color:#1f67d0;}
    span{text-align: center;
      img{width:.32rem;margin-right:.1rem;}
    }
    span:nth-of-type(2){
      img{margin-right:.25rem;}
    }
  }
  .news_cont{width:96%;line-height:.35rem;margin:0 auto;min-height:3rem;overflow:hidden;
    p{padding:.2rem 0;line-height:.8rem;text-align: justify;}
    img{}
  }
</style>
