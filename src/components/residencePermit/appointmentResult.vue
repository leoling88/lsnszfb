<template>
  <div class="template_container">
      <div class="cont_box">

        <!--<div  class="step3_cont" v-if="!isOverdue">-->
        <div  class="step3_cont" v-if="formData.czlx != 3">
          <div class="sucess_cont">
            <img class="icon_success" src="../../../static/images/icon_success.png"/>
            <h3>恭喜您，预约成功！</h3>
          </div>

          <p class="tips"><span>温馨提示：</span><span>办证受理点要收一张白底相片及一份照相回执</span></p>

          <cell title="预 约 人：" :value="formData.xm" class="no_before"></cell>
          <cell title="预 约 号：" :value="formData.yyh"></cell>
          <cell title="预约时间：" :value="formData.checktimels"></cell>
          <cell title="服务站名称：" :value="formData.standName"></cell>
          <cell title="服务站地址：" :value="formData.standAddress"></cell>
          <cell title="服务站电话：" :value="formData.standPhone"></cell>
        </div>

        <div  class="step3_cont" v-else>
          <div class="sucess_cont">
            <img class="icon_success" src="../../../static/images/icon_failed.png"/>
            <h3 style="color:#FD7E14">很抱歉，预约失败！</h3>
          </div>
          <div class="submit_btn" @click="goAppointment">重新预约</div>
        </div>

        <br v-for="item in 10"/>


      </div>
  </div>
</template>
<script>
  import {Icon,Group,Cell} from 'vux'
  import moment from 'moment'
  import api from '../../api/api'
  export default {
    name: 'appointmentResulte',
    components: {Icon,Group,Cell},
    data() {
      return {
        formData: {
          czlx: 0, // 0：预约成功，未处理 1：预约成功，已处理，2：已取消， 3：预约失败
          xm: '',
          checktimels: '', // 预约日期时间
          yyh: '',// 预约日期时间ID(预约号)
          standName: '', // 预约街镇
          standAddress: '',  // 街镇详细地址
          standPhone: ''  // 街镇电话
        },

        streetTownCode: '' // 街镇代码
      }
    },
    computed: {
      isOverdue: function () { // 预约号是否过期
        const currentTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm');
        const appointmentDate = this.formData.checktimels.split(' ')[0];
        return moment.duration(moment(currentTime) - moment(appointmentDate)).as('day') < 0;
      }
    },
    methods: {
      appointmentDetail () {  // 查询预约详情
      	console.log(this.$route.query.appointmentId);
        this.$store.commit('UPDATE_LOADING', true);
        api.appointmentDetail({
          idCard: this.$route.params.idNo,
          openid: this.$route.query.openid,
          appointmentId: this.$route.query.appointmentId    // 预约号
        }).then((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = res.data.jsonRes[0]
          if(res.data.success){
//          this.formData.czlx = data.czlx
						this.formData.czlx = 1
            this.formData.xm = data.xm;
            this.formData.streetTownCode = data.streetTownCode;
            this.formData.checktimels = (data.szrq + data.kssj + data.jssj) || '';
            this.formData.yyh = data.yyh;
            this.formData.standName = data.standName;
            this.formData.standAddress = data.standAddress;
            this.formData.standPhone = data.standPhone;
          }
        }).catch(()=>{
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      goHome () { // 回到首页
        location.href = '/cnLaiSui/mobile/laisuiHomeIndex?homeType=lsns_';
      },
      goAppointment () {
        const query = {
          openid:this.$route.query.openid
        }
        this.$router.push({path:'/appointment/' + this.$route.params.idNo, query});
      }
    },
    created () {
      this.appointmentDetail();
    },
    mounted () {
      document.addEventListener('optionMenu', this.goHome, false); // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goHome, false);
    }
  }
</script>
<style lang="less" scoped>
  .step3_cont{
    width:100%;overflow:hidden;line-height: .5rem;position: relative;background: #fff;
    .sucess_cont{
      width:100%;background:#fff;padding:.8rem 0 .5rem 0;
      .icon_success{display: block;width:2.4rem;height:2.14rem;margin:0 auto;}
      h3{width:92%;margin:0 auto;overflow:hidden;line-height: 1rem;font-size: .35rem;text-align: center;color:#0091ff;}
      h3 span{width:92%;margin:0 auto;overflow:hidden;display: block;color:#333;font-size: .28rem;line-height: .4rem;font-weight: normal;}
      h3 .failed{font-weight:normal;text-align: left;margin-top:0rem;font-size: .3rem;}
      .submit_failed{color:#FD7E14;}
      h3 em{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
    }

    p{
      padding:.15rem 15px;margin:0 auto;line-height: .5rem;font-size: .28rem;background: #F5F5F5;
      span:first-of-type{display:inline-block;height:.7rem;float: left}
      span:last-of-type{color:red;}
    }

    .info_cont{
      width:100%;margin:.3rem auto;overflow: hidden;background: #fff;
      li{font-size: .3rem;line-height: 1rem;color:#212c35;border-bottom:1px solid #eee;padding:0 .3rem;}
      span{color:#5a6570;float: right;}
    }
  }
</style>

