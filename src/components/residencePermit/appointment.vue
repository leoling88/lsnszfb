<template>
  <div class="template_container">
      <div class="cont_box">
        <div  class="step3_cont">
          <div class="sucess_cont">
            <img class="icon_success" src="../../../static/images/icon_success.png"/>
            <h3>请预约街镇办理时间</h3>
          </div>

          <div class="hava_date_title" style="height:1px;"></div>
          <div class="select_box">
            <cell class="custom_cell" title="预约办理街镇" :value="streetTownName"></cell>
            <dataTimeSelector v-model="formData.checktimeidls" describe="预约办理时间" :isFirst="isFirst" @timeChange="timeChange" :streetTownCode="streetTownCode"></dataTimeSelector>


            <!--<div class="submit_btn" @click="nowDate()">立即预约</div>-->
            <x-button class="submit_btn" :disabled="!formData.checktimeidls" @click.native="nowDate">立即预约</x-button>
          </div>
        </div>

        <div v-transfer-dom>
          <confirm v-model="Confirm.isShowConfirm" title="操作提示" @on-confirm="saveAppointment">
            <p style="text-align:center;">{{Confirm.confirmText}}</p>
          </confirm>
        </div>
      </div>
  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert,TransferDomDirective as TransferDom, Tab, TabItem, Confirm, ChinaAddressV4Data, XAddress, XInput, XButton} from 'vux'
  import dataTimeSelector from '../common/DataTimeSelector.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'appointment',
    components: {Icon,Group,Cell, Timeline, TimelineItem, dataTimeSelector, Tab, TabItem, Confirm, ChinaAddressV4Data, XAddress, XInput,XButton},
    directives: {TransferDom},
    data() {
      return {
        isFirst: true, // 是否是第一次选择或输入
        isShowAlert: false,
        openid: '',
        formData: {
          recordstate: 4, // 登记状态,4：预约办理居住证
          idNo: this.$route.params.idNo, // 身份号
          name: '',
          phoneNo: '',
          checktimels: '', // 预约日期时间
          checktimeidls: '',// 预约预约号
          addressDetail: '',  // 街镇详细地址
          streetNumber: '',  // 街镇电话
        },
        streetTownName: '', // 预约街镇
        streetTownCode: '', // 街镇代码
        Confirm: {
          isShowConfirm: false,
          confirmText: '确定现在预约吗?',
        }
      }
    },
    methods: {
      nowDate () {
        const validate = this.validate();
        if (!validate.valid){
          this.isFirst = false;
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm;
        }
      },
      getPeopleInfo () {  // 信息回显
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo(this.formData.idNo).then((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = res.data.jsonRes[0];
          if(res.data.success){
            this.formData.recordstate = data.recordstate;
            this.openid = data.openid;
            this.formData.name = data.name;
            this.streetTownName = data.streetTownName;
            this.streetTownCode = data.streetTownCode;
            this.formData.checktimels = data.checktimels;
            this.formData.checktimeidls = data.checktimeidls;
            this.formData.phoneNo = data.phoneNo;
            this.formData.checktime = data.checktime;
            this.formData.addressDetail = data.addressName + data.streetTownName + data.streetAlleysName;
          }
        }).catch(()=>{
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      getStreeDate () { // 查询用户的预约信息
        api.getStreeDate({idCard: this.formData.idNo,}).then((res) => {
          if (res.data.success && res.data.jsonRes.length > 0) {
            const data = res.data.jsonRes;
            this.formData.streetNumber = data[0].lxdh
            this.streetTownName = data[0].dz
          }
        })
      },
      timeChange (time, date) { // 选择时间
        this.formData.checktimels = time
      },
      goHome () { // 回到首页
        location.href = '/cnLaiSui/mobile/laisuiHomeIndex?homeType=lsns_'
      },
      appointment () { // 预约居住证办理
        const validate = this.validate();
        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
        }
      },
      saveAppointment () {   // 预约
        api.saveAppointment({
          openid: this.openid,
          idCard: this.formData.idNo,
          checktimels: this.formData.checktimels,
          checktimeidls: this.formData.checktimeidls
        }).then(res => {
          const data = res.data;
          if(data.success) {
            const query = {
              openid:this.openid,
              appointmentId: data.jsonRes[0].appointmentId
            }
            this.$router.push({path:'/appointmentResult/' + this.formData.idNo, query});
          } else {
            this.$store.commit('SHOWTOAST', data.msg);
          }
        })


        /*api.saveResideInfo({
          formData: this.formData,
          homeType: 'lsns_'  // 南沙区域标记
        }).then(res => {
          const data = res.data
          const obj = data.obj ? JSON.parse(data.obj) : ''
          if(data.success) {
            const query = {
              openid:this.openid
            }
            this.$router.push({path:'/appointmentResult/' + this.formData.idNo, query});

          } else {
            this.$store.commit('SHOWTOAST', obj ? obj.errorMessage : data.msg);
          }
        });*/
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';

        if (!this.formData.checktimeidls) {
          errorMsg = '请选择办理时间段！'
        } else {
          valid = true
          errorMsg = ''
        }
        return {valid, errorMsg}
      }
    },
    created () {
      this.getPeopleInfo()
    },
    mounted () {
      document.addEventListener('optionMenu', this.goHome, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goHome, false)
    }
  }
</script>
<style lang="less" scoped>
  .step3_cont{
    width:100%;overflow:hidden;line-height: .5rem;position: relative;background: #fff;
    .sucess_cont{
      width:100%;background:#fff;padding:.8rem 0;
      .icon_success{display: block;width:2.4rem;height:2.14rem;margin:0 auto;}
      h3{width:92%;margin:0 auto;overflow:hidden;line-height: 1rem;font-size: .35rem;text-align: center;color:#0091ff;}
      h3 span{width:92%;margin:0 auto;overflow:hidden;display: block;color:#333;font-size: .28rem;line-height: .4rem;font-weight: normal;}
      h3 .failed{font-weight:normal;text-align: left;margin-top:0rem;font-size: .3rem;}
      .submit_failed{color:#FD7E14;}
      h3 em{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
    }

    p{
      padding:0 15px;margin:0 auto;line-height: .5rem;font-size: .28rem;background: #F5F5F5;text-indent: 15px;
      span:first-of-type{display:inline-block;height:.7rem;float: left}
      span:last-of-type{color:red;}
    }

    .modif_btn{display: inline-block;line-height: .6rem;padding:0 .15rem;border:1px solid #eee;color:#666;font-size: .3rem;border-radius: .05rem;position: absolute;right:.2rem;top:.5rem;}
    .info_cont{
      width:100%;margin:.3rem auto;overflow: hidden;background: #fff;
      li{font-size: .3rem;line-height: 1rem;color:#212c35;border-bottom:1px solid #eee;padding:0 .3rem;}
      span{color:#5a6570;float: right;}
    }
  }

  .hava_date_title{height:1rem;line-height: 1rem;color: #0091ff;font-size: .35rem;text-indent: .3rem;background: #F5F5F5;}
  .select_box{
    width:100%;min-height:9rem;overflow: hidden;
    .btn_cont{width:100%;overflow: hidden;height:2rem;display: flex;justify-content: space-around;}
    .submit_btn{width: 5.8rem;height:.88rem;margin-top:.8rem;line-height:.88rem;border-radius: .1rem;text-align: center;color:#fff;font-size: .32rem;background: #448AFF;border:none;}
    .submit_btn.weui-btn_disabled{background: #DCDCDC;border:none;}
  }
  .goHome{width:1.2rem;height:1.4rem;position: absolute;left:0;top:0;}
  .get_away{ background: #F5F5F5;color:#0091ff;}
  .icons{display: block;width:2rem;height:2rem;margin:0 auto 0 auto;}
  .icons:before{font-size: 1.8rem;}
  .ems_cont, .custom_cell{background: #fff;}
  .address_cont{background: #fff;}
  .check_detail_btn{display:block;width: 5.8rem;height:.88rem;line-height:.88rem;margin:.5rem auto 0 auto; border-radius: .1rem;text-align: center;color:#fff;font-size: .28rem;background: #0091FF;}

  .kindly_reminder{
    width: 6.9rem; margin:.8rem auto;padding-bottom:.8rem;overflow:hidden;background-color: #fff;
    h3{color:#0091ff;line-height: .6rem;font-size: .3rem;}
    p{text-indent: 0rem;font-size: .28rem;margin-bottom:.1rem;text-align: justify;}
  }

</style>

<style>
  .ems_cont .weui-cells__title{height:.7rem;line-height:.7rem;background: #F5F5F5;}
</style>
