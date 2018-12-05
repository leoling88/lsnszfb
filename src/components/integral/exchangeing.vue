<template>
  <div class="template_container" style="background: #F6F5F5;">

      <div class="details">
        <div class="details_top">
          <img :src="littlepic" alt="">
        </div>
        <div class="details_main">
          <div class="main_title">{{goodstitle}}</div>
          <div class="main_title2"><span>{{integration}}</span>积分</div>
        </div>
        <div class="details_ms">
          <h3>商品描述</h3>
          <p v-html="goodsdesc"></p>
          <h3>品牌简介</h3>
          <p>{{brand}}</p>
        </div>
        <div class="details_btn">
          <x-button type="primary" @click.native="clickConfirm">立即兑换</x-button>
        </div>
        <!--兑换弹窗-->
        <div v-transfer-dom>
          <confirm class="exchTanc" :class="{lastXqing:xqActive}" v-model="show"
                   :title="title"
                   :confirm-text="queding"
                   :cancel-text="cancel"
                   :close-on-confirm="closeConfirm"
                   @on-cancel="onCancel"
                   @on-show="onShow"
                   @on-confirm="onConfirm">
            <div v-if="oneshow">
              <div class="regWenzi">确认使用<span class="redColor">{{integration}}</span>积分兑换</div>
              <div class="regWenzi blueColor">{{goodstitle}}</div>
            </div>
            <div v-if="twoshow" class="dhSuccess">
              <img class="successImg" src="../../../static/images/icon_gift.png" alt="">
              <div class="regWenzi">恭喜您兑换成功！</div>
            </div>
            <div v-if="thirdshow" class="dhSuccess">
              <img class="successImg" src="../../../static/images/icon_fial.png" alt="">
              <div class="regWenzi">兑换失败！</div>
              <div class="redColor">{{msgError}}</div>
            </div>
          </confirm>
        </div>
        <!--兑换弹窗结束-->
        <div v-transfer-dom>
          <loading :show="showLoading" :text="loadtext"></loading>
        </div>
      </div>



  </div>
</template>
<script>
  import api from '../../api/api'
  import {Loading,Confirm,XButton,TransferDomDirective as TransferDom} from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {Loading,Confirm,XButton},
    data() {
      return {
        actionState: 1, // 1, 确认按钮， 2，查看详情按钮
        show:false,
        show2:false,
        xqActive:false,
        loadtext:'兑换中',
        msgError:'',
        showLoading:false,
        title:'',
        title2:'',
        closeConfirm:false,
        queding:'确定',
        cancel:'取消',
        twoshow:false,
        oneshow:true,
        thirdshow:false,
        goodsid:this.$route.params.goodsid,
        idCard:this.$route.params.idCard,
        littlepic:'',
        goodstitle:'',
        integration:'',
        goodsdesc:'',
        brand:'',
        orderId:'',
        allJfen:'',//积分数
        stock:'' //商品个数

      }
    },
    methods: {
      onCancel () {  //取消兑换
        console.log('on cancel')
        this.actionState = 1;
        this.oneshow = true;
        this.twoshow = false;
        this.thirdshow = false;
        this.xqActive = false;
        this.cancel = '取消';
        this.queding = '确定';
      },
      onShow () {
        console.log('on show')
      },
      onConfirm () {  //确认兑换
          if (this.actionState == 1) { //确定按钮
            this.changIntegration();
            this.showLoading = true;
          } else if (this.actionState == 2) {  // 查看详情
            let orderId = this.orderId;
            this.$router.push({path:`/exchangeDetails/${orderId}`});
          }else if(this.actionState == 3){
            this.$router.go(-1);
          }

      },
      changIntegration () {  // 兑换接口
        api.changIntegration({
          idCard: this.idCard,
          goodsId: this.goodsid
        }).then((res) => {
          if(res.data.success){
            console.log(res.data.jsonRes[0].orderId);
            this.orderId = res.data.jsonRes[0].orderId;
            this.oneshow = false;
            this.twoshow = true;
            this.cancel = '关闭';
            this.queding = '查看详情';
            this.xqActive = true;
            this.actionState = 2;
            this.showLoading = false;
//            this.closeConfirm = true;
          }else{
            this.msgError = res.data.msg;
            this.oneshow = false;
            this.thirdshow = true;
            this.xqActive = true;
            this.queding = '返回首页';
            this.showLoading = false;
            this.actionState = 3;

          }
        })
      },
      clickConfirm () {  //立即兑换
        const _this = this;
        this.show = true;
      },
      goodsDetail () {  // 我的积分
        api.goodsDetail({
          goodsId: this.goodsid
        }).then((res) => {
          console.log(res.data.jsonRes[0].littlepic);
          this.littlepic = res.data.jsonRes[0].littlepic
          this.goodstitle = res.data.jsonRes[0].goodstitle
          this.integration = res.data.jsonRes[0].integration
          this.goodsdesc = res.data.jsonRes[0].goodsdesc
          this.brand = res.data.jsonRes[0].brand
          this.stock = res.data.jsonRes[0].stock
        })
      },
      selectJiFen () { //再查一次我的积分
        api.selectJiFen({
          userId: this.idCard
        }).then((res) => {
          this.allJfen = res.data.jsonRes[0].jifen;
          console.log('889',typeof this.allJfen);
        })
      }
    },
    mounted(){
      this.goodsDetail();

    }
  }
</script>
<style scoped lang="less">
  .details{
    max-width:750px;margin:0 auto;
    .details_top{
      width:100%;min-height:3.5rem;background:#e5e5e5 url("../../assets/images/moren.png") no-repeat center -0.6rem;text-align:center;
      img{width:7.50rem;display:block;}
    }
    .details_main{
      padding:.28rem .30rem .28rem .30rem;margin-bottom:.10rem;background-color:#fff;overflow:hidden;color:#2a333c;font-size:.32rem;
      .main_title{float:left;}
      .main_title2{
        float:right;
        span{color:#ff575a;font-weight:bold;}
      }
    }
    .details_ms{
      padding:0 .30rem .62rem .30rem;font-size:.28rem;background-color:#fff;overflow:hidden;
      h3:nth-of-type(1){margin-top:.35rem;}
      h3{font-weight:normal;color:#3988d7;border-bottom:.02rem solid #f2f2f7;padding-bottom:.20rem;margin-top:.83rem;}
      p{
        color:#5a6570;line-height:.45rem;margin-top:.23rem;text-align:justify;overflow:hidden;
      }
    }
    .details_btn{
      padding:.53rem 0 .43rem 0;
      button{width:6.90rem;height:.98rem;line-height:.98rem;background-color:#ff6a63;text-align:center;
        color:#fff;border:none;border-radius:.08rem;font-size:.32rem;font-weight:bold;margin:0 auto;display:block;letter-spacing:1px;}
      }
  }


  .blueColor{color:#3988d7;}
  .redColor{color:#ff575a;}


</style>
<style>
  /*确认对话框*/
  .exchTanc .vux-x-dialog .weui-dialog{width:6.90rem;max-width:690px;}
  .exchTanc .weui-dialog__ft{background-color:#f3f3f3;height:.96rem;line-height:.96rem;}
  .exchTanc .weui-dialog__ft:after,exchTanc .weui-dialog__btn:after{border:none !important;}
  .exchTanc .weui-dialog__ft .weui-dialog__btn{font-size:.32rem;}
  .exchTanc .weui-dialog__ft .weui-dialog__btn_primary{color:#fff !important;background-color:#ff6a63;}
  .exchTanc .weui-dialog__bd{height:4.04rem;}
  .exchTanc .vux-x-dialog .weui-dialog__bd{padding:0 !important;}
  .exchTanc .vux-x-dialog .weui-dialog__bd .regWenzi:first-child{padding:1.48rem 0 .12rem;}
  .exchTanc .weui-dialog__bd .dhSuccess{margin-top:.49rem;}
  .exchTanc .weui-dialog__bd .regWenzi{font-size:.36rem;}
  .exchTanc .weui-dialog__bd .successImg{width:1.58rem;}
  .lastXqing .weui-dialog__ft .weui-dialog__btn_primary{background-color:#f3f3f3;color:#353535 !important;}
  .details_ms .attr-list-hd{overflow:hidden;padding:0 !important;}
</style>
