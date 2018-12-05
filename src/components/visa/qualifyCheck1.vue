<template>
  <div class="template_container">
    <step class="noBorbt" step="1" stepText1="填写信息" stepText2="上传资料" stepText3="提交申请"></step>
    <div class="form_cont">
      <!-- <div @click="goNext">下一步</div> -->
      <!--手机验证-->
      <group title="个人基本信息" class="group_cont">

        <cell title="姓名" :value="formData.name" text-align="left" ></cell>
        <cell title="身份证号码" :value="formData.idCard" text-align="left" ></cell>
<!--         <x-input v-model="formData.phone" title="联系人手机号" placeholder="请输入联系手机号" :show-clear="true" placeholder-align="right" type="tel" :max="11" text-align="right" :required="true" ref="phone" :is-type="inputValid.cellPhone"></x-input>
 -->
        
      </group>
    </div>
    <div>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn" @click="goNext">下一步</a>
      </div>
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
  import {Alert,Group, Cell, XInput, TransferDomDirective as TransferDom} from 'vux'

  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  import Scroller from "../../../node_modules/vux/src/components/scroller/index";
  export default {
    name: 'qualifyCheck1',
    components: {Alert,Group, Cell, XInput, Step},
    directives: {TransferDom},
    data() {
      return {
        formData:{
          name: this.$route.params.name,
          idCard: this.$route.params.idCard,
          phone:'13111111111',
          openid: this.$route.params.openid,
          orginType: 1,// 支付宝标记,
          opentype: 1,
          homeType: 'lspy_',  // 番禺区域标记,
          rid: '',
        },
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
        }

      }
    },
    methods: {
      checkVal () {    //检查参数
        const myreg=/^[1][3,4,5,7,8][0-9]{9}$/
        if (!this.formData.name || !this.formData.idCard) {
          this.Alerts.isShow = true
          this.Alerts.text = '参数缺失！'
          return false
        }else if(!this.formData.phone){
          this.Alerts.isShow = true
          this.Alerts.text = '手机号码不能为空'
          return false     
        }else if (!myreg.test(this.formData.phone)) {
            this.Alerts.isShow = true
            this.Alerts.text = '手机号码不正确！' 
          return false                
        }else {
          return true

        }

      },
      goNext () {
        if (this.checkVal()) {
          let _tpyeName
          let _typeId
          let _rid
          this.$store.commit('UPDATE_LOADING', true);
          api.checkResidencePermi({      //检查是否有居住证
            idCard: this.formData.idCard,
            realName: this.formData.name,
            homeType: this.formData.homeType, 
            openid: this.formData.openid,
            phone: this.formData.phone,
            orginType: this.formData.orginType,   
            opentype: this.formData.opentype
          }).then(res => {
            const _data = res.data.obj
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {      //有居住证

              if (_data.isPass){     //如果有资格
                _rid = _data.rid      
                this.$router.push({path:'/qualifyCheck2/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.name + '/' + _rid});
              }else{    //资格无效
                if (_data.type == '06') {       //返回不成功
                  this.$store.commit('SHOWTOAST', '网络异常!')
                }else if(_data.type == '02'){  //您不满足居住证续签条件，且您的居住地址不在本区下登记，如需签注，请先变更居住登记信息
                    _tpyeName = 'failure'
                    _typeId = 'F10'        
                }else if(_data.type == '03'){     //您暂无居住证，请先申请居住证
                    _tpyeName = 'failure'
                    _typeId = 'F9'                   
                }else if (_data.type == '01') {   //您的居住证已注销，请重新申领居住证
                    _tpyeName = 'failure'
                    _typeId = 'F7'                  
                }
                this.formData.rid =_data.rid
                this.$router.push({path:'/returnStatus/' + this.formData.idCard +'/' + this.formData.rid + '?_type=JZZjy&_state=' + _tpyeName + '&_num='+ _typeId});    //以校验居住证状态进度查询_type=jzzjy
              }
            }else{
              this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
            }
          }).catch(() => {
            this.$store.commit('SHOWTOAST', '网络异常!')
          })


        }

      },
      noEffect () {   //默认无响应
      }

    },
    created() {
    },
    mounted () {
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, true) // 删除支付宝右上角点击事件
    }
  }
</script>
<style lang="less" >

</style>
