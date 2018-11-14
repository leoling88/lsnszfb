<template>
  <div class="template_container">
    <!--居住证登记------------------------------------------------------------------------------------------------->
    <!--信息提交成功，街道未审核-->
    <div class="step3_cont">
      <div class="sucess_cont">
        <template>
          <img v-if="formData.djjg != 3" class="icon_success" src="../../../static/images/icon_success.png"/>
          <img v-else class="icon_success" src="../../../static/images/icon_failed.png"/>
        </template>

        <h3 v-if="formData.djjg == 1">提交成功<span>您提交的登记信息正在核实中！</span></h3>
        <h3 v-else-if="formData.djjg == 2">登记成功<span>您提交的登记信息已审核通过！</span></h3>
        <h3 v-else-if="formData.djjg == 3" class="submit_failed">登记失败<span>请到街镇来穗人员服务管理中心进行处理！</span></h3>
        <h3 v-else-if="formData.djjg == 4" class="submit_failed">同步失败<span>请到街镇来穗人员服务管理中心进行处理！</span></h3>
        <h3 v-else>提交成功<span>请耐心等待审核</span></h3>
      </div>

      <router-link :to="`/step1Detailed/${formData.comGuid}/${openid}`" class="check_detail_btn">查看详情</router-link>
    </div>

  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert,TransferDomDirective as TransferDom, XSwitch, Tab, TabItem} from 'vux'
  import dataTimeSelector from '../common/DataTimeSelector.vue'
  import moment from 'moment'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step3',
    components: {Icon,Group,Cell, Timeline, TimelineItem, Alert, dataTimeSelector, XSwitch, Tab, TabItem},
    directives: {TransferDom},
    data() {
      return {
        showLoading: false,  // 是否在加载中
        serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1, // 业务类型，1,为登记，2，为居住证办理
        openid: this.$route.query.openid,
        jhid: this.$route.query.jhid,  // 交易编号
        formData: {
          zhimascore: this.$route.query.zhimascore,
          djjg: 0, // 登记结果:1待核实2登记成功3登记失败,4同步失败
          sbyy: '', // 失败原因
          comGuid: this.$route.query.comGuid,
          idNo: this.$route.params.idNo, // 身份号
          name: '',
          phoneNo: '',
          loginDate: '',// 预约时间
          loginTime: '',// 预约时间段
          checktimels: '', // 预约日期时间
          checktimeidls: '',// 预约日期时间ID(预约号)
          addressDetail: '',  // 街道详细地址
          streetNumber: ''  // 街道电话
        }
      }
    },
    computed: {
    },
    methods: {
      queryUploadLdryResult () { // 流动人员登记结果查询
        this.$store.commit('UPDATE_LOADING', true);
        api.queryUploadLdryResult({
          jhid: this.jhid,
          idCard: this.formData.idNo,
          openid: this.openid
        }).then((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success){
            this.formData.djjg = res.data.attributes.djjg
            this.formData.sbyy = res.data.attributes.sbyy
          }
        }).catch((res)=>{
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      goHome () { // 回到首页
        location.href = '/cnLaiSui/mobile/laisuiHomeIndex?homeType=lsns_';
      },
      setTitle () {
        if (this.serviceType == 1) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '南沙区居住登记结果'});
        } else {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '南沙区居住证申领结果'});
        }
      }
    },
    created () {
      this.setTitle()
    },
    mounted () {
      this.queryUploadLdryResult()
      document.addEventListener('optionMenu', this.goHome, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goHome, false)
    }
  }
</script>
<style lang="less" scoped>
  .step3_cont{
    width:100%;overflow:hidden;line-height: .5rem;overflow:hidden;position: relative;
    .sucess_cont{
      width:100%;background:#fff;padding-top:.8rem;overflow:hidden;
      .icon_success{display: block;width:2.4rem;height:2.14rem;margin:0 auto;}
      h3{width:92%;margin:0 auto;overflow:hidden;line-height: 1rem;font-size: .35rem;text-align: center;color:#0091ff;}
      h3 span{width:92%;margin:0 auto;overflow:hidden;display: block;color:#333;font-size: .28rem;line-height: .4rem;font-weight: normal;}
      h3 .failed{font-weight:normal;text-align: left;margin-top:0rem;font-size: .3rem;}
      .submit_failed{color:#FD7E14;}
      h3 em{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
    }

    p{
      width:94%;margin:0 auto;line-height: .5rem;font-size: .28rem;
      span:first-of-type{display:inline-block;height:.7rem;float: left}
      span:last-of-type{color:red;}
    }
    .modif_btn{display: inline-block;line-height: .6rem;padding:0 .15rem;border:1px solid #eee;color:#666;font-size: .3rem;border-radius: .05rem;position: absolute;right:.2rem;top:.5rem;}
    .info_cont{
      width:7.1rem;margin:.3rem auto;overflow: hidden;background: #fff;
      li{font-size: .3rem;line-height: 1rem;color:#212c35;border-bottom:1px solid #eee;padding:0 .3rem;}
      span{color:#5a6570;float: right;}
    }
  }
  .hava_date_title{height:1rem;line-height: 1.1rem;color: #0091ff;font-size: .35rem;text-indent: .3rem;}
  .hava_date_title.bg{background: #F5F5F5;}
  .select_box{
    width:100%;overflow: hidden;display: none;background: #fff;
    .btn_cont{
      width:100%;overflow: hidden;height:2rem;display: flex;justify-content: space-around;
      .submit_btn{margin:.5rem .3rem;}
    }
  }
  .check_detail_btn{display:block;width: 5.8rem;height:.88rem;line-height:.88rem;margin: .5rem auto 0 auto; border-radius: .1rem;text-align: center;color:#fff;font-size: .3rem;background: #0091FF;}
  .select_box.show{display: block;}
  .goHome{width:1.2rem;height:1.4rem;position: absolute;left:0;top:0;}
  .get_away{ background: #F5F5F5;color:#0091ff;}
  .icons{display: block;width:2rem;height:2rem;margin:0 auto 0 auto;}
  .icons:before{font-size: 1.8rem;}
</style>
