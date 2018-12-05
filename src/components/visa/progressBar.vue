<template>
<div class="progerss">
  <div class="progerss-box">
    <div class="progerss-bar">
     <div class="step" v-bind:class="{'hover':barSept>=0}">
        <i class="listStyle" ></i>
        <span class="icon" v-if="barSept>=0"><i></i></span>
        <div class="box">
          <b>提交签注申请</b>
          <p>已经提交申请</p>
        </div>
      </div>
      <div class="step" v-bind:class="{'hover':barSept>1}">
        <i class="listStyle"></i>
        <span class="icon" v-if="barSept>1"><i></i></span>
        <div  class="box">
          <b>街道初审</b>
          <p class="pad-r60">{{severName}} <i class="color-blue  more" v-bind:class="{'color-red':err}">{{JDPLStepText1}}</i></p>
        </div>
      </div>
      <div class="step"  v-bind:class="{'hover':barSept>2}">
        <i class="listStyle"></i>
        <span class="icon" v-if="barSept>2"><i></i></span>
        <div class="box">
          <b>EMS上门收件</b>
          <p  v-if="barSept>2">单号：<span >{{expressNbr}}</span><span class=" fl-r more" @click="clickMore(1)" >查看物流信息</span></p>
          <!--详细物流信息-->
          <div class="win-1" v-if="winShow1" >
            <div class="loadshow" v-if="emsMess1.isLoadShow"><img src="../../../static/images/loding.gif" alt="" ></div>
            <div class="wl-ul" v-else>
              <ul>
                <li v-for="item in emsMess1">
                  <i></i>
                  <p><span>{{item.remark}}</span><br/><font style="color:#ccc">{{item.accept_time}}</font></p>
                </li>
         
              </ul>
            </div>
          </div>
          <!--详细物流信息end-->

          <div>

          </div>
        </div>
      </div> 
      <div class="step"  v-bind:class="{'hover':barSept>3}">
        <i class="listStyle"></i>
        <span class="icon" v-if="barSept>3"><i></i></span>
        <div class="box">
          <b>街道签注办理</b>
          <p>{{JDPLStepText2}}</p>
        </div>
      </div> 
      <div class="step"  v-bind:class="{'hover':barSept>4}">
        <i class="listStyle"></i>
        <span class="icon" v-if="barSept>4"><i></i></span>
        <div class="box" style="padding-bottom:.5rem">
          <b>EMS派件上门</b>
          <p  v-if="barSept>4">单号：<span >{{returnExpressNbr}}</span><span class=" fl-r more" @click="clickMore(2)"  >查看物流信息</span></p>

          <!--详细物流信息-->
          <div class="win-1" v-if="winShow2" >
            <div class="loadshow" v-if="emsMess2.isLoadShow"><img src="../../../static/images/loding.gif" alt="" ></div>

            <div class="wl-ul" v-else>
              <ul>
                <li v-for="item in emsMess2">
                  <i></i>
                  <p><span>{{item.remark}}</span><br/><font style="color:#ccc">{{item.accept_time}}</font></p>
                </li>
         
              </ul>
            </div>
          </div>
          <!--详细物流信息end-->

          <div>

          </div>
        </div>
      </div>
      <div class="step"  v-bind:class="{'hover':barSept>5}">
        <i class="listStyle"></i>
        <span class="icon" v-if="barSept>5"><i></i></span>
        <div class="box">
          <b>签注结束</b>

        </div>
      </div> 

    </div>


  </div>

</div>
</template>
<script>
  import {} from 'vux'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'zgCheck',
    components: {},
    directives: {},
    data() {
      return {
        idCard: this.$route.params.idCard,
        rid: this.$route.params.cid,
        barSept:'',
        JDPLStep:'',
        err: false,
        JDPLStepText1:'',
        JDPLStepText2:'',
        orderId:'',
        expressNbr: '',  //去程快递ID
        returnExpressNbr:'',  //返程快递ID
        winShow1:false,
        winShow2:false,
        severName:'',
        emsMess1:{
          time: null,
          name: null,
          show:false,
          isLoad: true,
          isLoadShow: false
        },
        emsMess2:{
          time: null,
          name: null,
          show:false,
          isLoad: true,
          isLoadShow: false
        },
        returnPre: 0


      }
    },
    computed: {
    },
    methods: {

      requireProgress () {     //请求流程数据 
        this.$store.commit('UPDATE_LOADING', true);

        api.QZprogress(this.rid).then(res => {
          const _data = res.data.obj
          if(res.data.success) {
            this.orderId = _data.custOrderId
            this.expressNbr = _data.expressNbr
            this.returnExpressNbr = _data.returnExpressNbr
            this.barSept = _data.step
            this.severName = _data.tcontactor
            if (_data.progress == 0) {
              this.JDPLStepText2 = '办理中'
            }else if (_data.progress == 1) {
              this.JDPLStepText2 = '办理完毕'
            }

          }else{
            this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
          }
          this.$store.commit('UPDATE_LOADING', false);
        }).catch(() => {
          // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        });
        this.$store.commit('UPDATE_LOADING', true);
        api.JDprogress(this.rid).then(res => {         //街道办理状
          const _data = res.data.obj
          if(res.data.success) {

            if (_data.state == 0) {
              this.JDPLStepText1 = '待审核'
            }else if (_data.state == 1) {
              this.JDPLStepText1 = '审核通过'
            }else if (_data.state == 2) {
              this.JDPLStepText1 = '审核拒绝'
              this.err = true
            }else if (_data.state == 3) {
              this.JDPLStepText1 = '已失效'
              this.err = true
            }

          }else{
            this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
          }
          this.$store.commit('UPDATE_LOADING', false);

        }).catch(() => {
          // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        });
        this.$store.commit('UPDATE_LOADING', true);


      },
      clickMore(index) {    //菜开EMS详细信息
        
        if(index == 1){  //去程物流 
          if(!this.winShow1){
            this.winShow1 = true
            if(this.emsMess1.isLoad){      //加载物流信息
              this.requireEMS(index)
              this.emsMess1.isLoad = false  
            }
          } 
          else this.winShow1 = false
        }else if(index == 2){      //来程物流 
          if(!this.winShow2){         //加载物流信息  
            this.winShow2 = true
            if(this.emsMess2.isLoad){
              this.requireEMS(index)
              this.emsMess2.isLoad = false  
            }
          } 
          else this.winShow2 = false
        }


      },
      goHome() {   //返回首页
        location.href = '/'
      },
      requireEMS(index) {
        let _expressNbr
        if (index ===1 ){
         _expressNbr = this.expressNbr
         this.emsMess1.isLoadShow = true
        }
        else if (index ===2 ) {
          _expressNbr = this.returnExpressNbr
          this.emsMess2.isLoadShow = true
        } 
        api.logisticsEMS({
          expressNbr: _expressNbr,
          custOrderId: this.orderId
        }).then(res => {
          const _odata = res.data.obj
          if(res.data.success) {
            if (index ===1 ) {
              this.emsMess1 = _odata
              this.emsMess1.isLoadShow = false
            }
              
            else if (index ===2 ) {
              this.emsMess2 = _odata
              this.emsMess2.isLoadShow = false
            }
          }else{
            this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
            this.emsMess1.isLoad = true  
          }
          this.$store.commit('UPDATE_LOADING', false);
        }).catch(() => {
          // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
          this.emsMess1.isLoad = true 
        }); 
      }

    },
    created () {
    },
    mounted () {

      this.requireProgress()
      document.addEventListener('optionMenu', this.goHome, false) // 绑定支付宝右上角点击事件


    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goHome, false) // 删除支付宝右上角点击事件

    }    

  }
</script>
<style lang="less">
 body{background:#fff;}
 .fl-r{float:right;}
 .pad-r60{padding-right:1.5rem;}
 .color-blue{color:#1994ff;}
 .color-re,.color-blue.color-red{color:red;}
.progerss{width:100%;padding:1rem 0; background:#fff;}
.progerss-box{margin:0 .5rem;}
.progerss-bar{width:90%;margin:.2rem auto;border-left:.02rem dotted #ccc; position: relative;}
.progerss-bar .step{position: relative;font-size:.26rem;}
.progerss-bar .step b{font-size:.3rem;}
.progerss-bar .step .box {margin-bottom:.1rem;min-height:1.4rem;padding-left:.5rem;color:#999; position: relative;}
.progerss-bar .hover .box{color:#666;}
.progerss-bar .step .icon{top:0; display:block;position:absolute;left:-.22rem;width:.35rem;height:.35rem;border:.05rem solid #fff;border-radius:50%;background:#0091FF;z-index:1000;}
.progerss-bar .step .icon i{color:#fff;position:absolute;margin-left:.07rem;margin-top:.1rem;width:.16rem;height:.1rem;border-bottom:solid 1px currentColor;border-left:solid 1px currentColor;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}
.listStyle{display: block;position: absolute;top:.1rem;left:-.15rem;width:.25rem;height:.25rem;border:.02rem solid #fff;border-radius:50%;background:#ccc;}
.progerss-bar .hover .listStyle{background:#0091FF;}
.progerss-bar .step:last-child{position:absolute;top:100%;}
.color-blue{color:#0091FF;}
.win-1{  width:100%;font-size:.18rem;}

.wl-ul{margin:.3rem 0 1rem .1rem;border-left:.02rem dotted #ccc;position: relative;margin-bottom:2.2rem;}
.wl-ul ul{margin-left:-.12rem;}
.wl-ul li i{display:block;width:.14rem;height:.14rem;border:.05rem solid #fff;border-radius:50%;background:#0091FF; position: absolute;}
.wl-ul li{padding-bottom:.05rem;font-size:.24rem;color:#888;}
.wl-ul li p{padding-left:.4rem;}
.wl-ul li:last-child{position:absolute;top:100%;}
.more{ position:absolute;right:0;top:.48rem; }
 .loadshow{width:.3rem;height:.3rem;margin:.5rem auto;}
 .loadshow img{width:100%;}
</style>
