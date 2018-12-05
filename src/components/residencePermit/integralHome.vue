<template>
  <div class="template_container">
      <scroller lock-x>
        <div class="box2" style="padding-bottom:.5rem;">
          <div class="live_top">

            <!--居住证信息有变更-->
            <!--<div v-if="isChange == 1" class="tipss">-->
              <!--<icon class="icons" type="warn" is-msg></icon>-->
              <!--由于你的居住地址变更，<br/>请重新上传居住地址证明照片-->
            <!--</div>-->

            <!--登记审核通过183天倒计时-->
            <ArcProgressBar v-if="processTime >= 0" class="arc_progress_bar" :currentProgress="processTime" :state="residencePermitState"></ArcProgressBar>

            <!--居住证过期-->
            <div v-else-if="processTime < 0 && residencePermitState == 2" class="tipss">
              <icon class="icons" type="warn" is-msg></icon>
              居住证已过期<span v-if="processTime != 0"><strong>{{-processTime}}</strong>天</span>，<br/>请尽快到相应街道办理！
            </div>

          </div>
          <div class="live_title"><span>办理材料</span>办理居住证需提交以下材料</div>
          <ul class="list_box">
            <li>
              <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
              <div class="text">
                <strong>身份证</strong>
                <span>身份证上传：<em @click="Alert.isShowAlert = !Alert.isShowAlert">要求说明</em></span>
                <template>
                  <a href="/cnLaiSui/mobile/zhimaCreditStart?bizCode=CERT_PHOTO" v-if="!hasIdCard"></a>
                  <router-link :to="fileUploader + '&fileType=1'" v-else class="hasRedisdenceReceipt"></router-link>
                </template>
              </div>
            </li>
            <li>
              <img src="../../../static/images/icon_huizhi.png" alt="" class="icon">
              <div class="text">
                <strong>居住证相片回执</strong>
                <span>居住证相片回执上传：<em @click="Alert.isShowAlert = !Alert.isShowAlert">要求说明</em></span>
                <router-link :to="fileUploader + '&fileType=2'" :class="[hasRedisdenceReceipt ? 'hasRedisdenceReceipt' : '']"></router-link>
              </div>
            </li>
            <li>
              <img src="../../../static/images/icon_cailiao.png" alt="" class="icon">
              <div class="text">
                <strong>居住登记回执</strong>
                <span>居住登记回执上传：<em @click="Alert.isShowAlert = !Alert.isShowAlert">要求说明</em></span>
                <router-link :to="fileUploader + '&fileType=3'" :class="[hasRedisdenceBak ? 'hasRedisdenceReceipt' : '']"></router-link>
              </div>
            </li>
            <li>
              <img src="../../../static/images/icon_zhaopiao_huizhi.png" alt="" class="icon">
              <div class="text">
                <strong>居住地址住址</strong>
                <span>居住地址住址证明上传：<em @click="Alert.isShowAlert = !Alert.isShowAlert">要求说明</em></span>
                <router-link :to="fileUploader + '&fileType=4'" :class="[hasAddrReceipt ? 'hasRedisdenceReceipt' : '']"></router-link>
              </div>
            </li>
          </ul>

          <div class="tips_box">温馨提示： <span>办证受理点要收1张白底照片及1份照相回执</span></div>

          <div :class="['btn_cont', (residencePermitState == 2 && processTime > 0) ? 'go_on' : '']">
            <!--在居住登记完成后，坐等183后即可预约办理居住证-->
            <x-button v-if="residencePermitState == 1 && processTime == 0" class="submit_btn" :disabled="processTime > 0" @click.native="goAppointment">预约办理居住证</x-button>

            <!--线下已领证，在有效期内即可领取电子居住证-->
            <a v-if="residencePermitState == 2 && processTime > 0 && cardStatus == 1" class="submit_btn" href="/cnLaiSui/mobile/getResidencePermit">领取电子居住证</a>

            <!--查看电子居住证，cardStatus: 1-未领取  2-领取成功  3-领取失败 4-已删除-->
            <a v-if="residencePermitState == 2 && processTime > 0 && cardStatus == 2" class="submit_btn" :href="`/cnLaiSui/mobile/readCard?userId=${$route.query.openid}`">查看电子居住证</a>

            <!--在居住证有效期内最后30天到过期180天内可以进行续签-->
            <x-button v-if="residencePermitState == 2 && processTime >= -180" class="submit_btn" :disabled="processTime > 30" @click.native="goExtension">立即续签</x-button>

            <!--在居住证已过期-->
            <x-button v-if="residencePermitState == 2 && processTime < -180" class="submit_btn" :disabled="processTime > 30" @click.native="goStreet">预约线下办理</x-button>

          </div>
        </div>
      </scroller>


      <div v-transfer-dom>
        <confirm v-model="Confirm.isShowConfirm" title="操作提示" @on-confirm="onConfirm" confirm-text="好的">
          <p style="text-align:center;">{{Confirm.confirmText}}</p>
        </confirm>
      </div>

      <div v-transfer-dom>
        <alert v-model="Alert.isShowAlert" title="居住地住址证明">{{Alert.alertText}}</alert>
      </div>

  </div>
</template>
<script>
  import api from '../../api/api'
  import {TransferDomDirective as TransferDom, Confirm, Alert, XButton, Scroller, Icon } from 'vux'
  import { mapState } from 'vuex'
  import ArcProgressBar from '../common/ArcProgressBar.vue'
  export default {
    components: {Confirm, Alert, ArcProgressBar, XButton, Scroller, Icon },
    directives: {
      TransferDom
    },
    data() {
      return {
        isChange: this.$route.query.isChange, // 判读续签时，居住证信息是否有更改，1：更改，0：无
        cardStatus: '',  // 1-未领取  2-领取成功  3-领取失败 4-已删除
        processTime: '', // 剩余办理居住证天数
        residencePermitState: '', // 居住证领取状态，1：表示没有领取,即用户刚登记信息，2：表示已经领取，可以进入续签流程
        wechatresidencecode: this.$route.query.wechatresidencecode ? this.$route.query.wechatresidencecode : 1,  // 居住信息是否变更，1：无，2：有
        idCard: this.$route.query.idNo,
        hasIdCard: false, // 是否上传身份证
        hasRedisdenceReceipt: false, // 是否上传居住证相片回执
        hasRedisdenceBak: false, // 是否上传居住登记回执
        hasAddrReceipt: false, // 是否上传居住地住址证明
        Confirm: {
          state: 1,
          isShowConfirm: false,
          confirmText: '一切准备就绪，现在预约街道办理吗？'
        },
        Alert: {
          isShowAlert: false,
          alertText: '后续需要完成居住证信息填写，并预约街道办理'
        },
        isFirst: false
      }
    },
    computed: {
      ...mapState(['headerHeight','idNo','comGuid','openid']),
      fileUploader: function () {
        // isRenewal 判断是否是已进入续签流程, 目前在续签流程可以更改资料
        const flag1 = this.residencePermitState == 1 && this.processTime <= 0 // 新办
        const flag2 = this.residencePermitState == 2 && this.processTime <= 30   // 走续期的流程
        return `/fileUploader?idCard=${this.idCard}&isRenewal=${true}`
//        return `/fileUploader?idCard=${this.idCard}&isRenewal=${flag1 ||　flag2}`
      }
    },
    methods: {
      daysRemailing () {  // 查询居住证办理时间
        this.$store.commit('UPDATE_LOADING', true);
        api.daysRemailing(this.idCard).then((res) => {
          if (res.data.success) {
            this.processTime = res.data.days
            this.cardStatus = res.data.cardStatus
            this.residencePermitState = res.data.state
          }
          this.$store.commit('UPDATE_LOADING', false);
        }).catch((res) => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      isHavePic () { // 查询图片各个类型是否已经上传图片
        api.isHavePic(this.idCard).then((res) => {
          const data = res.data.jsonRes[0]
          if (res.data.success) {
            this.hasIdCard = data.myPicIdCard.length > 0
            this.hasRedisdenceBak = data.myPicRedisdenceBak.length > 0
            this.hasAddrReceipt = data.myPicAddrReceipt.length > 0
            this.hasRedisdenceReceipt = data.myPicRedisdenceReceipt.length > 0
            if (data.comGuid) this.$store.commit('UPDATE_COMGUID',data.comGuid)
            if (data.openid) this.$store.commit('UPDATE_ALIPAY_ACOUNT',data.openid)
          }
        })
      },
      goAppointment () { // 去预约领取居住证
        if (this.isUpFile()) {
          this.Confirm.state = 1
          this.Confirm.confirmText = '一切准备就绪，现在预约街道办理吗？'
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
        }
      },
      goExtension () { // 续签
        this.$router.push({path:`/step1/${this.comGuid}/${this.openid}`, query: {serviceType: 2}})
      },
      goStreet () { // 过期，预约线下办理
        if (this.isUpFile()) {
          this.Confirm.state = 2
          this.Confirm.confirmText = '您的居住证过期超过180天，现在预约线下办理吗？'
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
        }
      },
      onConfirm () {
        if (this.Confirm.state == 1) { // 进入居住证信息确认
          this.$router.push({path:`/step1Detailed/${this.comGuid}/${this.openid}`, query: {serviceType: 2, recordstate: 4}})
        } else { // 预约线下办理
          this.$router.push({path:`/step1/${this.comGuid}/${this.openid}`, query: {serviceType: 3, recordstate: 4}})
        }
      },
      isUpFile () { // 所有居住证资料是否已经都上传了
        if (!this.hasIdCard) {
          this.$store.commit('SHOWTOAST', '请上传身份证！');
          return false
        } else if (!this.hasRedisdenceBak) {
          this.$store.commit('SHOWTOAST', '请上传居住登记回执！');
          return false
        }  else if (!this.hasAddrReceipt) {
          this.$store.commit('SHOWTOAST', '请上传住址证明！');
          return false
        }  else if (!this.hasRedisdenceReceipt) {
          this.$store.commit('SHOWTOAST', '请上传居住证回执！');
          return false
        } else {
            return true
        }
      }
    },
    mounted () {
      this.$store.commit('UPDATE_ID_NO',this.idCard)  // 保存用户的身份证号，在居住证办理时会用到
      if (this.$route.query.comGuid) this.$store.commit('UPDATE_COMGUID',this.$route.query.comGuid)
      if (this.$route.query.openid) this.$store.commit('UPDATE_ALIPAY_ACOUNT',this.$route.query.openid)
      this.scrollerHeight = document.documentElement.clientHeight - this.headerHeight + 'px'
      this.daysRemailing()
      this.isHavePic()
    }
  }
</script>
<style lang="less" scoped>
  .live_top{
    height:4.42rem;overflow:hidden;position: relative;/*background: url(../../../static/images/live_top.jpg) no-repeat top center;*/background-size:100% 100%;
    .arc_progress_bar{overflow:hidden;position: absolute;left:1.8rem;top:.25rem;}
  }
  .live_title{
    width:6.9rem;height:.75rem;line-height: .6rem;margin:0 auto;overflow:hidden;font-size: .22rem;color:#a0aab4;text-overflow:ellipsis;white-space: nowrap;
    span{display:inline-block;font-size:.32rem;color:#5a6570;margin-right:.22rem;}
  }
  .list_box{
    width:6.9rem;margin:0 auto;overflow:hidden;
    li{height:1.37rem;font-size: .25rem;color:#888;border-bottom: 1px solid #E9EBEE;position: relative;}
    .icon{display: block;width:.72rem;height:.72rem;float: left;margin-top:.33rem;}
    .text{
      float: left;width:5.9rem;height:100%;float: right;
      strong{width:3.8rem;line-height: .5rem;display: block;color:#2a333c;font-size: .28rem;overflow: hidden;float: left;margin-top:.2rem;}
      span{width:4.2rem;display: block;text-overflow:ellipsis;white-space: nowrap;overflow: hidden;float: left;}
      a{display: block;width:.6rem;height:.6rem;line-height:.8rem;;border-radius: .1rem;color:#fff;font-size: .28rem;text-align: center;position: absolute;right: 0;top:.3rem;background: url(../../../static/images/icon_uploaded.png) no-repeat; background-size: 100%;}
      a.hasRedisdenceReceipt{background: url(../../../static/images/icon_is_upLoaded.png) no-repeat; background-size: 100%;}
      em{color:#448AFF;}
    }
  }

  .tips_box{width:6.9rem;margin:0 auto;height:1.5rem;line-height:1.2rem;font-size: .25rem;color:#888;
    span{color:red;}
  }
  .btn_cont{
    width:100%;overflow: hidden;padding-bottom:.63rem;display: flex;justify-content: space-around;align-content: center;
    .submit_btn{width: 5.8rem;height:.88rem;line-height:.88rem;border-radius: .1rem;text-align: center;color:#fff;font-size: .32rem;background: #448AFF;border:none;}
    .submit_btn.weui-btn_disabled{background: #DCDCDC;border:none;}
  }
  .btn_cont.go_on .submit_btn{width: 3.34rem;margin:0;}
  .tipss{
    width:80%;margin:0 auto;font-size: .35rem;text-align: center;
    strong{color:red;font-size: .5rem;}
    .icons{display: block;width:2rem;height:2rem;margin:0.5rem auto 0 auto;}
    .icons:before{font-size: 1.8rem;}
  }

</style>
