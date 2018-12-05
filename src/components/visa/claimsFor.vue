<template>
  <div class="template_container">
    <step class="noBorbt" step="2" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>

    <div class="form_cont">
      <!-- <div @click="goNext">下一步</div> -->
      <!--居住地址信息-->
      <group title="申领居住证方式" class="group_cont borbte5">
        <custom-selector v-model="formData.place" describe="领证方式" :options="wayList" :disabled="true" v-if="formData.typeNum == 1" ></custom-selector >
        <custom-selector v-model="formData.place" describe="领证方式" :options="wayList" :disabled="false" v-else ></custom-selector >
      </group>
    </div>
    <!--EMS-->
    <div class="form_cont marT_3 box_style" v-if="formData.place === 1">
      <x-address class="hjaddress" title="地区" v-model="formData.hjaddress" :list="addressData" placeholder="请选择广东省市区" ref="hjaddress"></x-address>
      <x-input v-model="formData.emsAddress" title="详细地址" placeholder="详细地址" :show-clear="true" placeholder-align="right" type="text"  text-align="right" :required="true"  ref="add" :is-type="inputValid.cellAdd"> </x-input>      
      <x-input v-model="formData.emsPhone" title="联系人手机号" placeholder="请输入联系手机号" :show-clear="true" placeholder-align="right" type="tel" :max="11" text-align="right" :required="true" ref="phone" :is-type="inputValid.cellPhone"></x-input>
      <x-input v-model="formData.emsName" title="联系人姓名" placeholder="联系人姓名" :show-clear="true" placeholder-align="right" type="text" :max="11" text-align="right" :required="true"  ref="name" :is-type="inputValid.cellName"></x-input>
    </div>
    <!--EMS end-->
    <!--自领--
    <div class="form_cont marT_3 box_style" v-if="formData.place === 2">

      <cell title="服务站" :value="formData.serviceStation" ></cell>
      <cell title="联系地址" :value="formData.serviceAdd" ></cell>
      <cell title="联系电话" :value="formData.servicePhone"></cell>


    </div>
    --自领 end-->

    <div class="mb30">
      <a href="javascript:;" class="check_detail_btn" @click="goNext">下一步</a>
    </div>
    <div class="content_1" v-if="formData.place === 2">
      1.由申请人自行到所属辖区来穗机构服务中心进行取证；
    </div>
    <div class="content_1" v-if="formData.place === 1">
      1.由邮政揽收员上门取证，同时收取25元邮政速递费；<br/>
2.证件擦写后，由邮政派件员再派件上门；<br/>
3.目前收件地址仅支持广州市番禺区；
    </div>

    <!--确认、取消弹窗-->
    <div v-transfer-dom>
      <Alert v-model="Alerts.isShow" title="操作提示" :hide-on-blur="true">
        <p style="text-align:center;">{{Alerts.text}}</p>
      </Alert>
    </div>
    <!--确认、取消弹窗 END-->


  </div>
</template>
<script>
  import {Alert, XInput, Group, Cell,  XAddress, ChinaAddressV4Data,TransferDomDirective as TransferDom} from 'vux'
  import customSelector from '../common/customSelector.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'claimsFor',
    components: {Alert, XInput, Group, Cell, customSelector, Step, SelectorSearch, XAddress, ChinaAddressV4Data},
    directives: {TransferDom},
    data() {
      return {
        formData:{
          realName: this.$route.params.name,
          idCard: this.$route.params.idCard,
          phone:'',
          place:'',    //状态码
          address: '',
          cardTime: '',
          openid: this.$route.params.openid,
          orginType: 1,// 支付宝标记,
          opentype: 1,
          homeType: 'lspy_',  // 番禺区域标记,
          rid: this.$route.params.cid,   //签注流程id
          type: 1,  //1.居住证 2.居住登记3.EMS
          typeNum: this.$route.params.getway , //申领方式
          emsName:'',
          emsPhone:'',
          emsAddress:'',
          nameValue:'',
          homeType: 2,
          orginType: 1,
          getway:  this.$route.params.getway,  //签注领取方式  0：全部可选   1：只能EMS
        },
        alertMsg:{
          value:true,
          msg:''
        },
        showLoading:true,
        wayList:[
          { 
            key: 1,
            value: 'EMS速递取证'
          },
          { 
            key: 2,
            value: '自行领取'
          }          
        ],
        Confirm:{
          isShow: false,
          text:'您确认信息准备无误并提交吗'
        },
        addressData: '',
        Alerts:{
          isShow: false,
          text:''
        },
        inputValid: {
          cellPhone: (val) => {
            return {
              valid: this.$regExp.phone.test(val),
              msg: '手机号不合法！'
            }
          },
          cellAdd: (val) => {
            if (val) {
              return true
            }
          },
          cellName: (val) => {
            if (val) {
              return true
            }
          },
          cellArea: (val) => {
            if (val) {
              return true
            }
          }
        }

      }
    },
    methods: {
      verifyVal () {           //检查参数
        let _reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if(!this.formData.hjaddress){
          this.$store.commit('SHOWTOAST', '请选择收件省市区')
          return false
        }else if(!this.formData.emsAddress) {
          this.$store.commit('SHOWTOAST', '请填写详细收件地址')
          return false
        }else if(escape(this.formData.emsAddress).indexOf( "%u" ) < 0 || this.formData.emsAddress.length < 3){
          this.$store.commit('SHOWTOAST', '详细地址至少三个中文字符')
          return false
        }else if (!this.formData.emsPhone){ 
          this.$store.commit('SHOWTOAST', '请填写联系人手机号码')
          return false
        }
        else if (!this.formData.emsName) {
          this.$store.commit('SHOWTOAST', '请填联系人姓名') 
          return false
        }
        else{
          return true
        }

      },
      emsOrder() {     //EMS信息提交
        this.$store.commit('UPDATE_LOADING', true);
        api.emsOrderCreation({
          idCard: this.formData.idCard,
          scontactor: this.formData.emsName,
          scustMobile: this.formData.emsPhone,
          address: this.formData.emsAddress,
          streettownCode: this.formData.hjaddress,
          streettownName: this.$refs.hjaddress.nameValue,
          homeType: 2,
          orginType: 1,
          rid: this.formData.rid,
        }).then((res) => {
          if (res.data.success) {       //提交成功跳致最终提交页面
            this.$router.push({path:'/qualifyCheck6/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.place});
          } else {
            this.$store.commit('SHOWTOAST', 'EMS订单发起失败！');
            this.$store.commit('UPDATE_LOADING', false);
          }
        }).catch((res) => {
          this.$store.commit('SHOWTOAST', '网络异常，请稍后再试');
          this.$store.commit('UPDATE_LOADING', false);
        })

      },
      requireData () {        //获取广东地区地址列表
        let _guandongLists  = []
        for(var _i=0; _i <ChinaAddressV4Data.length; _i++){
          if  (ChinaAddressV4Data[_i].value.substr(0, 2) == 44){
           _guandongLists.push(ChinaAddressV4Data[_i])
          }
        }
        this.addressData = _guandongLists
        this.formData.place = 2
      },

      goNext () {
        if (!this.formData.place) this.$store.commit('SHOWTOAST', '请选择领取方式');
        else {
          if(this.formData.place == 1){     //如果选择EMS
            if(this.verifyVal()) {
               this.emsOrder()
            }
          }else{    //如果选择自主申领

            this.$store.commit('UPDATE_LOADING', true);
            api.getWay({       //提交自主申领
              receiveType: 1,
              rid: this.formData.rid        
            }).then(res => {
              this.$store.commit('UPDATE_LOADING', false);
              if(res.data.success) {
                this.$router.push({path:'/qualifyCheck6/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.place});
              }else{
                //returnStatus
              }
            }).catch(() => {
              this.$store.commit('UPDATE_LOADING', false);
              this.$store.commit('SHOWTOAST', '网络异常!')
            }) 
          }
        }
      },
      checkLQState() {       //检查是否有资格签注
        this.$store.commit('UPDATE_LOADING', true);
        api.checkLQState(this.formData.rid).then(res => {
          const _odata = res.data.obj
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            if (_odata.dayFlag) {     //是否居住证过期前5个工作日
              this.formData.place = 2
              this.formData.typeNum = 2
            }else {          //符合条件进行EMS操作
            }
          }else{
          }
        }).catch(() => {
        this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        }) 
      },
      noEffect () {   //默认无响应
      }  
    },
    created() {

      this.requireData()   
      this.checkLQState()
    },
    mounted () {
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件

    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, false) // 删除支付宝右上角点击事件
    }
  }
</script>
<style lang="less" scoped>
.template_container{min-height:13.5rem;background:#efeff4;}
.form_cont{border:none;background:#fff; }
.box_style{}
.weui-cell:before{
  left:0!important;;
}
.content_1{margin:.5rem .4rem;color:#888;font-size:.26rem;}
.marT_3{margin-top:.3rem;}
</style>
