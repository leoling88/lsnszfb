<template>
  <div class="template_container">
    <scroller lock-x>
      <div class="cont_box">
        <!--居住证登记------------------------------------------------------------------------------------------------->
        <div class="step3_cont" v-if="recordstate == 1">
          <div class="sucess_cont cont2">
            <template>
              <img v-if="formData.djjg != 3 && formData.djjg != 4 " class="icon_success" src="../../../static/images/icon_success.png"/>
              <img v-else class="icon_success" src="../../../static/images/icon_fail.png"/>
            </template>

            <h3 v-if="formData.djjg == 1">提交成功<span>您提交的登记信息正在核实中！</span></h3>
            <h3 v-else-if="formData.djjg == 2">登记成功<span>您提交的登记信息已审核通过</span></h3>
            <h3 v-else-if="formData.djjg == 3" class="submit_failed">登记失败<span>请到街镇来穗人员服务管理中心进行处理！</span><span v-text="formData.sbyy" style="color:#888;padding-top:.15rem;"></span></h3>
            <h3 v-else-if="formData.djjg == 4" class="submit_failed">同步失败<span>请到街镇来穗人员服务管理中心进行处理！</span></h3>
            <h3 v-else-if="formData.djjg == 5"  style="color:#000;">已登记</h3>
			      <h3 v-else>提交成功<span>请耐心等待审核</span></h3>
          </div>
          <router-link :to="`/step1Detailed/${idCard}`" class="check_detail_btn">查看详情</router-link>
          <!-- 20180810 + by leolin -->
          <div class="check_detail_btn2" @click="butCancel" v-if="formData.djjg < 2">取消登记</div>
          <div class="check_detail_btn2" @click="butCancel" v-if="formData.djjg === '2' || formData.djjg === '3' || formData.djjg === '5' ">重新登记</div>
          <!-- 20180810 + by leolin  endy-->

          <div class="kindly_reminder">
            <h3>温馨提示：</h3>
            <p>一、请您及时到居住地址所属的村（社区）来穗人员和出租屋服务管理工作站领取加盖公章的《广州市来穗流动人口办理居住登记回执》。</p>
            <p>二、自登记日期之日起，在居住地居住满半年后，并符合有合法稳定就业、合法稳定住所、连续就读条件之一的，提交《来穗流动人口办理居住登记回执》及相关证明材料，可申请领取《广东省居住证》。</p>
            <p>三、在上述居住地址终止居住的，请及时告知注销居住登记消息。</p>
            <p>四、根据《居住证暂行条例》第九条第四款规定，申请人及相关证明材料出具人应当对本条规定的证明材料的真实性、合法性负责。</p>
            <p>五、经核实发现虚假居住登记信息的，在信息系统予以注销居住信息。并依据《居住证暂行条例》第十八、十九条的有关规定，追究相关法律责任。</p>
          </div>
        </div>


<!--         <div v-transfer-dom>
          <confirm v-model="Confirm.isShowConfirm" title="重要提示" @on-confirm="saveResideInfo">
            <p style="text-align:center;">{{Confirm.confirmText}}</p>
          </confirm>
        </div> -->

        <div v-transfer-dom>
          <confirm v-model="Confirm2.isShowConfirm" title="重要提示" @on-confirm="modifierInfo">
            <p style="text-align:center;">{{Confirm2.confirmText}}</p>
          </confirm>
        </div>


      </div>
    </scroller>








  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert,TransferDomDirective as TransferDom, Tab, TabItem, Confirm, ChinaAddressV4Data, XAddress, XInput, Scroller,Value2nameFilter as value2name} from 'vux'
  import dataTimeSelector from '../common/DataTimeSelector.vue'
  import moment from 'moment'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step3',
    components: {Scroller, Icon,Group,Cell, Timeline, TimelineItem, dataTimeSelector, Tab, TabItem, Confirm, ChinaAddressV4Data, XAddress, XInput,value2name},
    directives: {TransferDom},
    data() {
      return {
      	//addressList:this.$Utils.getLocalStorage('addressList'),
        openid: '',
        isFirst: true, // 是否是第一次选择或输入
        isSelectDataTime: true, // 是否是第一次选择或输入
        isShowAlert: false,
        showLoading: false,  // 是否在加载中
        serviceType: this.$route.query.serviceType || 1, // 业务类型，1,为登记，2，为居住证办理
        maxYear: new Date().getFullYear(),
        // transactWay: 2, // 续签居住证办理方式
        addressData:ChinaAddressV4Data,
        showAddress: false,

        recordstate: 6, // 登记状态
        homeType: this.$route.params.homeType,     //地区
        idCard: this.$route.params.idCard,
        formData: {
          comGuid: this.$route.query.comGuid,
          idNo: this.$route.params.idCard,// 旧==>this.$route.params.idNo, // 身份号
          djjg: 0, // 登记结果:1待核实 2登记成功 3登记失败
          sbyy: '', // 失败原因
          name: '',
          phoneNo: '',
          loginDate: '',// 预约时间
          loginTime: '',// 预约时间段
          checktimels: '', // 预约日期时间
          checktimeidls: '',// 预约日期时间ID(预约号)
//          streetTownName: '', // 预约街道
//          streetTownCode: '', // 街道代码
          addressDetail: '',  // 街道详细地址
          streetNumber: '',  // 街道电话
          area: [], // 省市区
          receiveAddress: '', // 详细地址
          receiveName: '', // 收件人
          contactsPhone: '', // 联系人电话
          cost: 20,// 快递费
          courierAim:0//0.居住证续期1.居住证办理
        },
        streetTownName: '', // 预约街道
        streetTownCode: '', // 街道代码
        timeOptions: [],
        Confirm: {
          isShowConfirm: false,
          confirmText: '确定要预约登录记吗?',
        },
        Confirm2: {
          isShowConfirm: false,
          confirmText: '确定要取消登记吗?',
        },        
        isFirst: true, // 是否是第一次选择或输入
        inputValid: {
          spouseName: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.name.test(val),
              msg: '姓名不合法！'
            }
          },
          cellPhone: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.phone.test(val),
              msg: '手机号不合法！'
            }
          },
          address: (val) => {
            if (this.isFirst) {
              return false
            } else if (val) {
              return true
            }
          }
        }
      }
    },
    computed: {
      lastSevenDates: function () { // 获取最近7天日期
        let arr = []
        let date = new Date()
        for(let i = 0; i< 9; i++) {
          let weekDay = date.getDay(date.getDate() + 1)
          let day = moment(date.setDate(date.getDate() + 1)).format("YYYY-MM-DD")
          if (arr.length < 7) arr.push(day)
        }
        return arr
      },
      ...mapState([
        'wxsqn','comGuid'
      ])
    },
    methods: {
      butCancel () {    //点击取消登记按钮
        if(this.formData.djjg === '2' || this.formData.djjg === '3' || this.formData.djjg === '5' ){
          this.Confirm2.confirmText = '您确认要重新登记吗？'
        }else{
          this.Confirm2.confirmText = '您确认要取消登记吗？'

        }
        this.Confirm2.isShowConfirm = true

      },
      modifierInfo () {    //取消登记
        this.$router.push({path:`/step1/${this.formData.idNo}/1`});
      },
      nowDate () {
        const validate = this.validate()
        if (!validate.valid){
          this.isFirst = false
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
        }
      },
      getPeopleInfo () {  // 信息回显
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo(this.formData.idNo).then((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = res.data.jsonRes[0]
          if(res.data.success){
            this.recordstate = 1
//            this.recordstate = data.recordstate
            this.openid = data.openid
            this.formData.name = data.name
            this.streetTownName = data.streetTownName
            this.streetTownCode = data.streetTownCode
            this.formData.checktimels = data.checktimels
            this.formData.checktimeidls = data.checktimeidls
            if (data.checktimels) this.queryYyszList(data.checktimels.split(' ')[0])
            this.formData.phoneNo = data.phoneNo
            this.formData.checktime = data.checktime
            this.formData.addressDetail = data.addressName + data.streetTownName + data.streetAlleysName
            if (data.jhid) {
              this.formData.djjg = data.jhid
            }else{
              this.formData.djjg = data.djjg

            }
   console.log('查看状态jhid==>'+this.formData.djjg)           
            console.log('图djjg==>' +data.djjg +'openid==>'+this.openid)
            this.queryUploadLdryResult()
            
          }
        }).catch(()=>{
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      filerData(srcData, toData){ // 筛选数据字典
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              value: `${item.szrq} ${item.kjsj}~${item.jssj}`,
              key: item.szid,
              remainder: item.yyzdz - item.dqyyz  // 剩余预约量
            })
          });
        }
      },
      queryYyszList (date) {  // 最近七天预约登记
        this.timeOptions = []
        this.showLoading = true
        api.laisuiQuerySmhsszList({
          openid: this.openid,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
          jz: this.streetTownCode,
          yyrq: date
        }).then((res) => {
          if (res.data.success) {
            const data = JSON.parse(res.data.jsonRes[0]);
            if (data.ackCode == 1) {
              this.filerData(data.dataList, this.timeOptions);
            } else {
              this.$store.commit('SHOWTOAST', data.errorMessage.replace(/\[\S+\]/g, ''));
            }
          }
          this.showLoading = false
        }).catch((res) => {
          this.showLoading = false
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
        location.href = '/cnLaiSui/mobile/laisuiHomeIndex?homeType=lspy_'
      },
      // appointment (transactWay) { // 预约居住证办理
      //   const validate = this.validate()
      //   if (!validate.valid) {
      //     this.$store.commit('SHOWTOAST', validate.errorMsg);
      //   } else {
      //     this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
      //     if (transactWay == 2) {
      //       this.Confirm.confirmText = '请确保收件信息无误后再预约！'
      //     } else {
      //       this.Confirm.confirmText = '确定现在预约线下街道办理吗！'
      //     }
      //   }
      // },
      // saveResideInfo () { // 预约居住证办理方式
      //   if (this.transactWay == 1) {
      //     api.saveResideInfo(this.formData).then(res => {
      //       const data = res.data
      //       const obj = data.obj ? JSON.parse(data.obj) : ''
      //       if(data.success) {
      //         this.getPeopleInfo()
      //       } else {
      //         this.$store.commit('SHOWTOAST', obj ? obj.errorMessage : data.msg);
      //       }
      //     });
      //   } else if (this.transactWay == 2) {  // 走EMS
      //     this.emsOrderCreation()
      //   }
      // },
      // emsOrderCreation () { // EMS创建订单
      // 	let areaArr = value2name(this.formData.area, ChinaAddressV4Data).split(' ');
      //   api.emsOrderCreation({
      //     //oorderid: this.formData.idNo,//订单ID
      //     sendername: this.formData.name,//发件人姓名
      //     sendertel: this.formData.phoneNo,//发件人的联系电话
      //     //senderarea: JSON.stringify(this.formData.area),//发件人地区
      //     senderarea: '['+areaArr+']',//发件人地区
      //     senderaddress: this.formData.receiveAddress,//发件人地址
      //     courierAim:this.formData.courierAim,//发件人，0.居住证续期1.居住证办理
      //     //cost: this.formData.cost
      //   }).then((res) => {
      //   	if(res.data.success){
      //   		const query = {
      //         orderId:res.data.obj
      //       }
      //   		this.$router.push({path: '/payConfirm',query})
      //   	}
      //   })
      // },
      // validate () { // 校验表单
      //   let valid = false;
      //   let errorMsg = '';

      //   switch (this.transactWay) {
      //     case 1: // 预约街道办理
      //       this.isSelectDataTime = false
      //       if (!this.formData.checktimeidls) {
      //         errorMsg = '请选择办理时间段！'
      //       } else {
      //         valid = true
      //         errorMsg = ''
      //       }
      //       return {valid, errorMsg}
      //     case 2:   // 预约EMS
      //       this.isFirst = false
      //       if (!this.formData.name) {
      //         errorMsg = '请输入收件人姓名！'
      //         this.$refs.receiveName.validate()
      //       } else if (!this.formData.phoneNo) {
      //         errorMsg = '请输入联系电话！'
      //         this.$refs.contactsPhone.validate()
      //       } else if (this.formData.area.length <= 0) {
      //         errorMsg = '请选择户籍地区！'
      //       } else if (!this.formData.receiveAddress) {
      //         errorMsg = '请输入详细地址！'
      //         this.$refs.receiveAddress.validate()
      //       } else {
      //         valid = true
      //         errorMsg = ''
      //       }
      //       return {valid, errorMsg}
      //   }
      // },
      queryUploadLdryResult () { // 流动人员登记结果查询
        //alert('2')
        localStorage.setItem("regMsg",1)
        this.$store.commit('UPDATE_LOADING', true);


        api.queryUploadLdryResult({
          jhid: this.formData.djjg,
          openid: this.openid,
		      idCard: this.formData.idNo
        }).then((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success){
            //this.formData.djjg = res.data.attributes.djjg;
            console.log('djjg====>' + res.data.attributes.djjg)
            this.formData.sbyy = res.data.attributes.sbyy;
            console.log('jhid====>'+res.data.attributes.jhid )
            if(res.data.attributes.jhid != '' && res.data.attributes.jhid != null && res.data.attributes.jhid != undefined && res.data.attributes.jhid != "undefined"){
              this.formData.djjg = res.data.attributes.jhid    //当JHID 不为空时更新

            }else{
              if(res.data.attributes.djjg != '' && res.data.attributes.djjg != null && res.data.attributes.djjg != undefined && res.data.attributes.djjg != "undefined") {
                this.formData.djjg = res.data.attributes.djjg;

              }
              

            }
          }
        }).catch((res)=>{
          this.$store.commit('UPDATE_LOADING', false);
        })
      }
    },
    created () {
      this.getPeopleInfo();
      if (this.serviceType == 1) {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '番禺区居住登记结果'});
      } else {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证申领结果'});
      }
    },
    mounted () {
      
      if (this.$route.query.openid) this.$store.commit('UPDATE_ALIPAY_ACOUNT',this.$route.query.openid)
      if (this.$route.query.comGuid) this.$store.commit('UPDATE_COMGUID',this.$route.query.comGuid)
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
      width:100%;background:#fff;padding:.8rem 0 .4rem 0;
      .icon_success{display: block;width:2.4rem;height:2.14rem;margin:0 auto;}
      h3{width:92%;margin:0 auto;overflow:hidden;line-height: 1rem;font-size: .35rem;text-align: center;color:#0091ff;}
      h3 span{width:92%;margin:0 auto;overflow:hidden;display: block;color:#2a333c;font-size: .28rem;line-height: .4rem;font-weight:normal;}
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
      width:100%;margin:.3rem auto;overflow: hidden;background: #fff;
      li{font-size: .3rem;line-height: 1rem;color:#212c35;border-bottom:1px solid #eee;padding:0 .3rem;}
      span{color:#5a6570;float: right;}
    }
  }

  .hava_date_title{height:1rem;line-height: 1rem;color: #0091ff;font-size: .35rem;text-indent: .3rem;background: #F5F5F5;}
  .select_box{
    width:100%;min-height:9rem;overflow: hidden;
    .btn_cont{
      width:100%;overflow: hidden;height:2rem;display: flex;justify-content: space-around;
      .submit_btn{margin:.5rem .3rem;}
    }
    .submit_btn{width: 5.8rem;height:.88rem;line-height:.88rem;margin:.5rem auto 1rem auto; border-radius: .1rem;text-align: center;color:#fff;font-size: .3rem;background: #0091FF;}
  }
  .goHome{width:1.2rem;height:1.4rem;position: absolute;left:0;top:0;}
  .get_away{ background: #F5F5F5;color:#0091ff;}
  .icons{display: block;width:2rem;height:2rem;margin:0 auto 0 auto;}
  .icons:before{font-size: 1.8rem;}
  .ems_cont, .custom_cell{background: #fff;}
  .address_cont{background: #fff;}
  .check_detail_btn{display:block;width: 5.8rem;height:.88rem;line-height:.88rem;margin:.5rem auto 0 auto; border-radius: .1rem;text-align: center;color:#fff;font-size: .28rem;background: #0091FF;}
  .check_detail_btn2{display:block;width: 5.8rem;height:.88rem;line-height:.88rem;margin:.5rem auto 0 auto; border-radius: .1rem;text-align: center;color:#0091FF;font-size: .28rem;border:1px solid  #0091FF;}
  .kindly_reminder{
    width: 6.9rem; margin:.8rem auto;padding-bottom:.8rem;overflow:hidden;background-color: #fff;
    h3{color:#0091ff;line-height: .6rem;font-size: .3rem;}
    p{text-indent: 0rem;font-size: .28rem;margin-bottom:.1rem;text-align: justify;}
  }

</style>

<style>
  .ems_cont .weui-cells__title{height:.7rem;line-height:.7rem;background: #F5F5F5;}
</style>
