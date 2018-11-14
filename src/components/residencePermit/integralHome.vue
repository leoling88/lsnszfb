<template>
  <div class="template_container">
      <scroller lock-x>
        <div class="box2">
          <div class="live_top">
            <!--初次登记183天倒计时，居住证有效期倒计时-->
            <ArcProgressBar v-if="processTime >= 0" class="arc_progress_bar" :currentProgress="processTime" :state="residencePermitState"></ArcProgressBar>

            <!--登记满183天-->
            <div v-else-if="residencePermitState == 1 && processTime < 0" class="tipss">
              <img class="icon_success" src="../../../static/images/icon_success.png"/>
              <h3>您已经符合居住证办理条件</h3><span>请尽快到所在镇街办理！</span>
            </div>

            <!--居住证过期-->
            <div v-else-if="residencePermitState == 2 && processTime < 0" class="tipss">
              <icon class="icons" type="warn" is-msg></icon>
              居住证已过期<span v-if="processTime != 0"><strong>{{-processTime}}</strong>天</span>，<br/>请尽快到相应镇街办理！
            </div>
          </div>

          <!--以下代码是线上办理流程，目前流程走不通要走线下流程-->
          <template v-if="false">
            <div class="live_title"><span>办理材料</span>办理居住证需提交以下材料</div>
            <ul class="list_box">
              <li>
                <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
                <div class="text">
                  <strong>身份证</strong>
                  <span>身份证上传：<em @click="showDescribe(1)">要求说明</em></span>
                  <template>
                    <a href="/cnLaiSui/mobile/zhimaCreditStart?bizCode=CERT_PHOTO&homeType=lsns_" v-if="!hasIdCard"></a>
                    <router-link :to="fileUploader + '&fileType=1'" v-else class="hasRedisdenceReceipt"></router-link>
                  </template>
                </div>
              </li>
              <li>
                <img src="../../../static/images/icon_huizhi.png" alt="" class="icon">
                <div class="text">
                  <strong>居住证相片回执</strong>
                  <span>居住证相片回执上传：<em @click="showDescribe(2)">要求说明</em></span>
                  <router-link :to="fileUploader + '&fileType=2'" :class="[hasRedisdenceReceipt ? 'hasRedisdenceReceipt' : '']"></router-link>
                </div>
              </li>
              <li>
                <img src="../../../static/images/icon_cailiao.png" alt="" class="icon">
                <div class="text">
                  <strong>居住登记回执</strong>
                  <span>居住登记回执上传：<em @click="showDescribe(3)">要求说明</em></span>
                  <router-link :to="fileUploader + '&fileType=3'" :class="[hasRedisdenceBak ? 'hasRedisdenceReceipt' : '']"></router-link>
                </div>
              </li>
              <li>
                <img src="../../../static/images/icon_zhaopiao_huizhi.png" alt="" class="icon">
                <div class="text">
                  <strong>居住地址住址</strong>
                  <span>居住地址住址证明上传：<em @click="showDescribe(4)">要求说明</em></span>
                  <router-link :to="fileUploader + '&fileType=4'" :class="[hasAddrReceipt ? 'hasRedisdenceReceipt' : '']"></router-link>
                </div>
              </li>
            </ul>
            <div class="tips_box">温馨提示： <span>办证受理点要收1张白底照片及1份照相回执</span></div>
          </template>

          <!--线下流程-->
          <div class="live_title"><span>办理材料</span>居住证{{residencePermitState <= 1 ? '申领' : '续签'}}需提供以下材料</div>
          <ul class="list_box">
            <li v-if="residencePermitState == 2">
              <img src="../../../static/images/icon_zhaopiao_huizhi.png" alt="" class="icon">
              <div class="text">
                <strong>居住证</strong>
                <span>需要续签的居住证原件。</span>
              </div>
            </li>
            <li>
              <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
              <div class="text">
                <strong>身份证明材料</strong>
                <span>本人居民身份证或者其它有效身份证明原件及复印件。</span>
              </div>
            </li>
            <li v-if="residencePermitState == 1">
              <img src="../../../static/images/icon_huizhi.png" alt="" class="icon">
              <div class="text">
                <strong>居住登记回执</strong>
                <span>办理居住登记时领取的居住登记回执。</span>
              </div>
            </li>
            <li>
              <img src="../../../static/images/icon_cailiao.png" alt="" class="icon">
              <div class="text">
                <strong>居住地址证明材料</strong>
                <span>合法稳定住所或连续就读证明等原件及复印件。</span>
              </div>
            </li>
          </ul>

          <div class="btn_cont">

            <!--在居住登记完成后，坐等183后即可预约办理居住证-->
            <x-button class="submit_btn" :disabled="appointmentFlag" @click.native="goExtension">预约办理</x-button>

            <!--目前由于线上功能走不通，以下功能暂时屏蔽-->
            <!--线下已领证，在有效期内即可领取电子居住证
            <a v-if="residencePermitState == 2 && processTime > 0 && cardStatus == 1" class="submit_btn" href="/cnLaiSui/mobile/getResidencePermit">领取电子居住证</a>

            &lt;!&ndash;查看电子居住证，1-未领取  2-领取成功  3-领取失败 4-已删除&ndash;&gt;
            <a v-if="residencePermitState == 2 && processTime > 0 && cardStatus == 2" class="submit_btn" :href="`/cnLaiSui/mobile/readCard?userId=${$route.query.openid}`">查看电子居住证</a>

            &lt;!&ndash;在居住证已过期&ndash;&gt;
            <x-button v-if="residencePermitState == 2 && processTime < -180" class="submit_btn" :disabled="processTime > 30" @click.native="goStreet">预约线下办理</x-button>-->

          </div>
        </div>
      </scroller>


      <div v-transfer-dom>
        <confirm v-model="Confirm.isShowConfirm" title="操作提示" @on-confirm="onConfirm">
          <p style="text-align:center;">{{Confirm.confirmText}}</p>
        </confirm>
      </div>

      <div v-transfer-dom>
        <alert v-model="Alert.isShowAlert" title="操作提示">{{Alert.alertText}}</alert>
      </div>

  </div>
</template>
<script>
  import api from '../../api/api'
  import {TransferDomDirective as TransferDom, Confirm, Alert, XButton, Scroller, Icon} from 'vux'
  import { mapState } from 'vuex'
  import ArcProgressBar from '../common/ArcProgressBar.vue'
  export default {
    components: {Confirm, Alert, ArcProgressBar, XButton, Scroller, Icon },
    directives: {
      TransferDom
    },
    data() {
      return {
        wechatresidencecode: this.$route.query.wechatresidencecode || 1,  // 居住信息是否变更，1：无，2：有
        processTime: '', // 剩余办理居住证天数
        residencePermitState: '1', // 居住证领取状态，1：没有领取，2：表示已经领取，可以进入续签流程
        cardStatus: 1,  // 1-未领取  2-领取成功  3-领取失败 4-已删除
        hasIdCard: false, // 是否上传身份证
        hasRedisdenceReceipt: false, // 是否上传居住证相片回执
        hasRedisdenceBak: false, // 是否上传居住登记回执
        hasAddrReceipt: false, // 是否上传居住地住址证明
        Confirm: {
          state: 1,
          isShowConfirm: false,
          confirmText: '确定现在预约街镇办理吗？'
        },
        Alert: {
          isShowAlert: false,
          alertText: '后续需要完成居住证信息填写，并预约街镇办理'
        },
        isFirst: false
      }
    },
    computed: {
      fileUploader: function () {
        // isRenewal 判断是否是已进入续签流程, 目前在续签流程可以更改资料
        const flag1 = this.residencePermitState == 1 && this.processTime <= 0 // 新办
        const flag2 = this.residencePermitState == 2 && this.processTime <= 30   // 走续期的流程
        return `/fileUploader?idCard=${this.$route.query.idNo}&isRenewal=${true}`
      },
      appointmentFlag: function () {  // 预约按钮可用状态
        return (this.residencePermitState == 1 && this.processTime > 0) || (this.residencePermitState == 2 && this.processTime > 30)
      }
    },
    methods: {
      daysRemailing () {  // 查询居住证办理时间
        this.$store.commit('UPDATE_LOADING', true);
        api.daysRemailing({
          idCard: this.$route.query.idNo,
          openid: this.$route.query.openid,
          name: encodeURI(this.$route.query.name)
        }).then((res) => {
          if (res.data.success) {
            this.processTime = -100
            this.residencePermitState = 1
//            this.processTime = res.data.days
//            this.residencePermitState = res.data.state;
            this.cardStatus = res.data.cardStatus;
            this.setTitle();
          }
		      this.$store.commit('UPDATE_LOADING', false);
        }).catch(()=>{
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      isHavePic () { // 查询图片各个类型是否已经上传图片
        api.isHavePic(this.$route.query.idNo).then((res) => {
          const data = res.data.jsonRes[0]
          if (res.data.success) {
            this.hasIdCard = data.myPicIdCard.length > 0
            this.hasRedisdenceBak = data.myPicRedisdenceBak.length > 0
            this.hasAddrReceipt = data.myPicAddrReceipt.length > 0
            this.hasRedisdenceReceipt = data.myPicRedisdenceReceipt.length > 0
          }
        })
      },
      goAppointment () { // 去预约领取居住证
        if (this.isUpFile()) {
          this.Confirm.state = 1
          this.Confirm.confirmText = '一切准备就绪，现在预约街镇办理吗？'
          this.Confirm.isShowConfirm = true
        }
      },
      goStreet () { // 过期，预约线下办理
        if (this.isUpFile()) {
          this.Confirm.state = 2
          this.Confirm.isShowConfirm = true
          this.Confirm.confirmText = '您的居住证过期超过180天，现在预约线下办理吗？'
        }
      },
      goExtension () { // 续签
        this.$router.push({path:`/appointment/${this.$route.query.idNo}`, query: {openid: this.$route.query.openid}})
      },
      onConfirm () {
        if (this.Confirm.state == 1) { // 进入居住证信息确认,serviceType：业务类型，1，登记，2，居住证首次办理，3，居住证续签
          this.$router.push({path:`/step1Detailed/${this.$route.query.comGuid}/${this.$route.query.openid}`, query: {serviceType: 2}})
        } else { // 预约线下办理
          this.$router.push({path:`/appointment/${this.$route.query.idNo}`, query: {openid: this.$route.query.openid}})
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
      },
      showDescribe (type) {
        this.Alert.isShowAlert = !this.Alert.isShowAlert
        if (type == 1) {
          this.Alert.alertText = '请上传第二代身份证件'
        } else if (type == 2) {
          this.Alert.alertText = '具有第二代居民身份证照相资质的照相馆拍摄居住证数码相片回执'
        } else if (type == 3) {
          this.Alert.alertText = '为办理街镇颁发的《居住证领取回执》'
        } else if (type == 4) {
          this.Alert.alertText = '房屋租赁合同、房屋产权证明文件、购房合同或者房屋出租人、用人单位、就读学校、宾馆旅店出具的住宿证明等，或者屋主与借住人签订的借住手续证明。'
        }
      },
      setTitle () {
        if (this.residencePermitState == 1) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证申领'});
        } else {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: ' 居住证续签'});
        }
      }
    },
    created () {
      this.daysRemailing();
      this.isHavePic();

    },
    mounted () {

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
    li{padding: .2rem 0;overflow:hidden;font-size: .25rem;color:#888;border-bottom: 1px solid #E9EBEE;position: relative;}
    .icon{display: block;width:.72rem;height:.72rem;float: left;margin-top:.1rem;}
    .text{
      float: left;width:5.9rem;height:100%;float: right;
      strong{width:3.8rem;line-height: .5rem;display: block;color:#2a333c;font-size: .28rem;overflow: hidden;float: left;}
      span{width:100%;display: block;/*text-overflow:ellipsis;white-space: nowrap;overflow: hidden;*/float: left;}
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
    .submit_btn{width: 5.8rem;height:.88rem;margin-top:.8rem;line-height:.88rem;border-radius: .1rem;text-align: center;color:#fff;font-size: .32rem;background: #448AFF;border:none;}
    .submit_btn.weui-btn_disabled{background: #DCDCDC;border:none;}
  }
  .btn_cont.go_on .submit_btn{width: 3.34rem;margin:0;}
  .tipss{
    width:80%;margin:0 auto;font-size: .35rem;text-align: center;
    strong{color:red;font-size: .5rem;}
    .icons{display: block;width:2rem;height:2rem;margin:0.5rem auto 0 auto;}
    .icons:before{font-size: 1.6rem;}
    .icon_success{display: block;width:2.4rem;height:2.14rem;margin:.5rem auto 0 auto;}
    h3{width:92%;margin:0 auto;overflow:hidden;line-height: .8rem;font-size: .35rem;text-align: center;color:#0091ff;}
    h3 span{width:92%;margin:0 auto;overflow:hidden;display: block;color:#333;font-size: .28rem;line-height: .4rem;font-weight: normal;}
    h3 .failed{font-weight:normal;text-align: left;margin-top:0rem;font-size: .3rem;}
    .submit_failed{color:#FD7E14;}
    h3 em{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
  }

</style>
