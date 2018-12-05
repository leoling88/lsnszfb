<template>
  <div class="template_container">
      <div class="details">
        <div class="details_top">
          <img :src="littlepic" alt="">
          <!--<div class="details_top_yy"></div>-->
        </div>
        <div class="details_main">
          <div class="main_title">{{goodstitle}}</div>
          <div class="main_title">兑换密码：<span>{{conid}}</span></div>
          <div class="main_xq">
            <div>积分消费：{{ointegration}}</div>
            <div>订单编号：{{orderid}}</div>
            <div>兑换时间：{{createdate}}</div>
          </div>
        </div>
        <div class="details_ms">
          <h3>使用说明</h3>
          <p>{{remark}}</p>
          <h3>商品描述</h3>
          <p v-html="goodsdesc"></p>
          <h3>品牌简介</h3>
          <p>{{brand}}</p>
        </div>
      </div>



  </div>
</template>
<script>
  import api from '../../api/api'
  export default {
    data() {
        return {
          orderId:this.$route.params.orderid,
          littlepic:'',
          goodstitle:'',
          ointegration:'',
          orderid:'',
          createdate:'',
          goodsdesc:'',
          brand:'',
          conid:'',
          remark:''
        }
    },
    methods: {
      orderDetail () {  // 兑换记录列表详情
        api.orderDetail({
          orderId: this.orderId
        }).then((res) => {
          if(res.data.success){
            this.littlepic = res.data.jsonRes[0].goodsList.littlepic
            this.goodstitle = res.data.jsonRes[0].goodsList.goodstitle
            this.ointegration = res.data.jsonRes[0].ointegration
            this.orderid = res.data.jsonRes[0].orderid
            this.createdate = res.data.jsonRes[0].createdate
            this.goodsdesc = res.data.jsonRes[0].goodsList.goodsdesc
            this.brand = res.data.jsonRes[0].goodsList.brand
            this.conid = res.data.jsonRes[0].conid
            this.remark = res.data.jsonRes[0].remark
          }
        })
      },
    },
    mounted(){
      this.orderDetail();
    }
  }
</script>
<style scoped lang="less">
  .details{
    max-width:750px;margin:0 auto;
    .details_top{
      width:100%;background-color:#ecf7ff;text-align:center;
      img{width:7.50rem;display:block;}
      /*.details_top_yy{width:5.2rem;height:.20rem;background-color:#c9deed;margin:.51rem auto 0;border-radius:50%;box-shadow:0px 0px 7px 0px #D9EAF5;}*/
    }
    .details_main{
      padding:.28rem .30rem 0 .30rem;
      .main_title{
        color:#2a333c;font-size:.32rem;margin-bottom:.25rem;
        span{color:#ff575a;font-weight:bold;}
      }
      .main_xq{
        color:#838e99;font-size:.24rem;
        div{margin-bottom:.20rem;}
      }
    }
    .details_ms{
      padding:0 .30rem 1.16rem .30rem;font-size:.28rem;overflow:hidden;
      h3:nth-of-type(1){margin-top:.61rem;}
      h3{font-weight:normal;color:#3988d7;border-bottom:.02rem solid #f2f2f7;padding-bottom:.20rem;margin-top:.83rem;}
      p{color:#5a6570;line-height:.45rem;margin-top:.23rem;text-align:justify;}
    }
  }

</style>
