<template>
  <div class="template_container">
      <div class="zhotop" v-if="fsperson">
        <div class="zhotop1">个人积分</div>
        <div class="zhotop2">{{allfenshu}}</div>
        <div class="zhotop3">恭喜您，您当前分数超越了{{baifenb}}%的申请人</div>
      </div>
      <div class="zhoul">
        <div class="zhouTitle">积分服务</div>
        <div class="resflex">
          <div class="sflex">
            <router-link :to="`/integralQueren?allfenshu=${allfenshu}&nianlfen=${nianlfen}&demo1=${demo1}`">
              <img src="../../../static/images/icon_idcard.png" alt="">
              <p>积分入户</p>
            </router-link>
          </div>
          <div class="sflex">
            <img src="../../../static/images/icon_idcard.png" alt="">
            <p>积分入学</p>
          </div>
          <div class="sflex">
            <img src="../../../static/images/icon_idcard.png" alt="">
            <p>积分入住</p>
          </div>
        </div>
        <div class="resflex lastflex">
          <div class="sflex">
            <img src="../../../static/images/icon_idcard.png" alt="">
            <p>公共服务</p>
          </div>
          <!--<div class="sflex">-->
            <!--<img src="../../../static/images/icon_idcard.png" alt="">-->
            <!--<p>优惠券申请</p>-->
          <!--</div>-->
          <!--<div class="sflex">-->
            <!--<img src="../../../static/images/icon_idcard.png" alt="">-->
            <!--<p>娱乐申请</p>-->
          <!--</div>-->
        </div>
        <!--<div class="resflex">-->
          <!--<div class="sflex">-->
            <!--<img src="../../../static/images/icon_idcard.png" alt="">-->
            <!--<p>家政申请</p>-->
          <!--</div>-->
          <!--<div class="sflex">-->
            <!--<img src="../../../static/images/icon_idcard.png" alt="">-->
            <!--<p>门票申请</p>-->
          <!--</div>-->
          <!--<div class="sflex">-->
            <!--<img src="../../../static/images/icon_idcard.png" alt="">-->
            <!--<p>学习申请</p>-->
          <!--</div>-->
        <!--</div>-->
      </div>

    <div v-transfer-dom>
      <Loading :show="loadingShow"></Loading>
    </div>
  </div>
</template>
<script>
  import api from '../../api/api'
  import {TransferDomDirective as TransferDom, Loading, Alert, XButton, Icon } from 'vux'
  export default {
    components: {Loading, Alert, XButton, Icon },
    directives: {
      TransferDom
    },
    data() {
      return {
        allfenshu: this.$route.query.allfenshu,
        nianlfen:this.$route.query.nianlfen,
        demo1:this.$route.query.demo1,
        loadingShow:true,
        fsperson:false,
        baifenb:''
      }
    },
    methods: {
    },
    mounted(){
      setTimeout(() => {
        this.loadingShow = false;
        this.fsperson = true;
      }, 2000)
      this.baifenb = Math.floor(Math.random()*20 + 30);//取随机数
    }
  }
</script>
<style lang="less" scoped>
  .zhotop{
    background:#f5f5f5;width:100%;text-align:center;color:#448aff;padding-top:.6rem;padding-bottom:.52rem;
    .zhotop1{font-size:.28rem;}
    .zhotop2{font-size:.86rem;font-weight: bold;margin-top:.20rem;margin-bottom:.30rem;}
    .zhotop3{font-size:.28rem;color:#2a333c;}
  }
  .resflex{
    display: flex;
    .sflex{
      flex:1;text-align:center;padding:.4rem 0;
      img{width: .73rem;height:.73rem;}
      p{font-size:.26rem;margin-top:.18rem;}
      a{
        p{color:#333;}
      }
    }
  }
  .zhouTitle{font-size:.28rem;padding:.3rem;}
  .lastflex .sflex{width:33.3%;flex:inherit;}
</style>
