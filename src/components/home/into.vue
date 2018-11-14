<template>
  <div class="template_container">
    <div class="hpageTop">
      <div class="logo"><img src="../../../static/images/laisui_logo.png" alt=""></div>
      <div class="word">
        <div class="wordTitle">广州来穗通</div>
        <div class="wordWb">广州市来穗人员服务管理局</div>
      </div>
    </div>
    <div class="zhoul">
      <div class="zhouTitle">服务</div>
      <div class="resflex">
        <!--<router-link to="/home" class="sflex">
          <img src="../../../static/images/nslogo.jpg" alt="">
          <p>南沙区</p>
        </router-link>-->
        <a href="/cnLaiSui/mobile/laisuiHomeIndex?homeType=lsns_" class="sflex">
          <img src="../../../static/images/nslogo.jpg" alt="">
          <p>南沙区</p>
        </a>
        <a href="/cnLaiSui/mobile/laisuiHomeIndex?homeType=lspy_" class="sflex">
          <img src="../../../static/images/pylogo2.png" alt="">
          <p>番禺区</p>
        </a>
        <a href="javascript:;" class="sflex">
        </a>

      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../api/api'
  export default {
    data() {
      return {
      }
    },
    methods: {
    },
    mounted(){
    }
  }
</script>

<style lang="less" scoped>
.hpageTop{
  height:1.42rem;background:url("../../../static/images/hpage.jpg") no-repeat;background-size:cover;padding:.5rem 0 0 .3rem;
  .logo{float:left;width:.94rem;height:.94rem;margin-right:.28rem;}
  .word{
    float:left;color:#fff;line-height:1.4;
    .wordTitle{font-size:.39rem;font-weight:bold;}
    .wordWb{font-size:.24rem;}
  }
}
.zhoul{
  background-color:#fff;
  .resflex{
    display: flex;
    .sflex{
      flex:1;text-align:center;height:2.09rem;/*border-right:.02rem solid #f5f5f5;*/
      img{width: .97rem;margin:.43rem 0 .16rem 0;}
      p{font-size:.32rem;color:#5a6570;font-family: PingFang-SC-Bold;}
    }
  }
  .resflex .sflex:nth-of-type(2n){border-right:none;}
  .zhouTitle{border-bottom:2px solid #f5f5f5;font-size:.3rem;color:#5a6570;padding-left:.3rem;height:.93rem;line-height:.93rem;}
}

</style>
