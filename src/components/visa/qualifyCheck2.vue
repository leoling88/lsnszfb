<template>
  <div class="template_container">
    <step class="noBorbt" step="1" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>
    <div class="form_cont" id="Q2">
      <!-- <div @click="goNext">下一步</div> -->
      <!--个人基本信息-->
      <group title="个人基本信息" class="group_cont">
        <cell title="姓　名" :value="formData.realName"></cell>
        <cell title="身份号码" :value="formData.idCard"></cell>
        <cell title="手机号码" :value="formData.phone"></cell>

      </group>
      <!--现居住证信息-->
      <group title="现居住证信息" class="group_cont borbte5">
        <cell title="地区" :value="formData.place"></cell>
        <cell title="详细地址" :value="formData.address"></cell>
        <cell title="证件有效期至" :value="formData.cardTime">{{formData.cardTime | formatDate}}</cell>
      </group>
    </div>
    <div>
      <p class="notesTis">如现居住地址已更换，请先居住登记信息变更，变更成功后再进行签注居住证</p>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn" @click="validationData" v-bind:class="{off:isOff}">确认并校验资格</a>
        <div class="check_detail_btn2" @click="toModify">居住登记信息变更</div>
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
  import {Alert,Group, Cell, XInput, Confirm, TransferDomDirective as TransferDom} from 'vux'
  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'qualifyCheck2',
    components: {Alert,Group, Cell, XInput, Step, Confirm },
    directives: {TransferDom},
    data() {
      return {
        formData:{
          realName: this.$route.params.name,
          idCard: this.$route.params.idCard,
          phone:'',
          place:'',
          address: '',
          cardTime: '',
          openid: this.$route.params.openid,
          orginType: 1,// 支付宝标记,
          opentype: 1,
          homeType: 'lspy_',  // 番禺区域标记,
          rid: this.$route.params.cid,   //签注流程id
          type: 1,  //1.居住证 2.居住登记3.EMS
          getway: 0  //签注领取方式  0：全部可选   1：只能EMS
        },
        isOff: false,    //验证资格按钮状态
        Alerts:{
          isShow: false,
          text:''

        },
      }
    },
    methods: {
      checkVal () {   //检查参数
        if (!this.formData.realName || !this.formData.idCard || !this.formData.phone 
          || !this.formData.address || !this.formData.cardTime  || !this.formData.place)  {
          this.Alerts.isShow = true
          this.Alerts.text = '参数缺失！'
          return false
        }else{
          return true
        }

      },

      toModify() {     //居住登记信息变更
        let _tpyeName
        let _typeId
        let _rid
        let _time
        this.$store.commit('UPDATE_LOADING', true);
        api.checkQualification({
          idCard: this.formData.idCard,
          realName: this.formData.realName,
          openid: this.formData.openid,
          opentype: this.formData.opentype,
          rid: this.formData.rid        
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            const _data = res.data.obj
            api.regJZDJDatas({
            opentype: this.formData.opentype,
            rid: this.formData.rid,
            orginType: this.formData.orginType,
            }).then(res => {      //检查是否有资格
              this.$store.commit('UPDATE_LOADING', false);
              if(res.data.success) {
                this.$router.push({path:'/recordChange/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '?_subType=0' });  
              }else{
                this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
              }
            }).catch(() => {
              this.$store.commit('SHOWTOAST', '网络异常!')
            })




              // api.checkZDRY(this.formData.rid).then(res => {      //检查是否有资格
              //   this.$store.commit('UPDATE_LOADING', false);
              //   if(res.data.success) {
              //     if (!_data.isPass){     //如果无资格跳入提示页面
              //       if (res.data.obj.type == 4) {
              //           this.$store.commit('SHOWTOAST', '网络异常是，请稍后再试!')
              //       }
              //       else {
              //         if (res.data.obj.type == 1) {   //您不满足居住证续签条件，请XX年XX月XX日后再提交申请
              //           _tpyeName = 'failure'
              //           _typeId = 'F2'
              //           _time = _data.allowDate

              //         }else if(res.data.obj.type == 2){  //您有在正在办理的居住证业务，不能重复办理
              //           _tpyeName = 'failure'
              //           _typeId = 'F10'        
              //         }else if(res.data.obj.type == 3){     //您的居住证信息与居住登记信息不一致，如需续期，请先变更居住登记信息
              //           _tpyeName = 'failure'
              //           _typeId = 'F5'                   
              //         }
              //         this.$router.push({path:'/returnStatus/' + this.formData.idCard +'/' + this.formData.rid + '?_type=ZGjy&_state=' + _tpyeName + '&_num='+ _typeId + '_time=' + _time});    //以校验居住证状态进度查询_type=jzzjy                    
              //       }
              //     }else{          //如果有资格跳入一下步
              //       api.regJZDJDatas({
              //       opentype: this.formData.opentype,
              //       rid: this.formData.rid,
              //       orginType: this.formData.orginType,
              //       }).then(res => {      //检查是否有资格
              //         this.$store.commit('UPDATE_LOADING', false);
              //         if(res.data.success) {
              //           this.$router.push({path:'/recordChange/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid });  
              //         }else{
              //           this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
              //         }
              //       }).catch(() => {
              //         this.$store.commit('SHOWTOAST', '网络异常!')
              //       })
              //     }
              //   }else{
              //     this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
              //   }
              // }).catch(() => {
              //   this.$store.commit('SHOWTOAST', '网络异常!')
              // })
          }else{
            this.$store.commit('SHOWTOAST', '请求失败!')
          }
        }).catch(() => {
        // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        })       
      },
      requireData() {              //获取数据
          this.$store.commit('UPDATE_LOADING', true);
          api.requireData({
            idCard: this.formData.idCard,
            realName: this.formData.realName,
            homeType: this.formData.homeType,
            type: this.formData.type, 
            rid:this.formData.rid, 
          }).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
              const _data = res.data.obj.residentialPermit
              this.formData.place = _data.xzq_dict
              this.formData.phone  = _data.lxdh
              this.formData.cardTime = _data.jzzyxjzrq
              this.formData.address =  _data.jz_dict + _data.jwh_dict + _data.jddm_dict + _data.mpmc + _data.dy
            }else{
              this.$store.commit('SHOWTOAST', '请求失败!')
            }
          }).catch(() => {
            // this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('SHOWTOAST', '网络异常!')
          })


      },
      validationData () {            //确认校验资格
        this.$store.commit('UPDATE_LOADING', true);
        api.checkQualification({
          idCard: this.formData.idCard,
          realName: this.formData.realName,
          openid: this.formData.openid,
          opentype: this.formData.opentype,
          rid: this.formData.rid        
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            if (res.data.obj.type == 4) {      //第三方网络不通
                this.$store.commit('SHOWTOAST', '网络异常，请稍后再试!')
            }else{   //第三方网络正常
              const _data = res.data.obj
              api.checkZDRY(this.formData.rid).then(res => {    //检查重点人员资格
                this.$store.commit('UPDATE_LOADING', false);
                if(res.data.success) {
                  if (!_data.isPass){    //如果无资格
                    if(_data.type == 1){
                      let _tpyeName = 'failure'
                      let _typeId = 'F2'
                      let _time = _data.allowDate
                      this.$router.push({path:'/returnStatus/' + this.formData.idCard +'/' + this.formData.rid + '?_type=ZGjy&_state=' + _tpyeName + '&_num='+ _typeId + '&_time=' + _time});    //以校验资格查询_type=ZGjy
                    }else{
                      this.isOff = true
                      this.Alerts.isShow = true
                      this.Alerts.text = _data.errorMsg

                    }

                    // this.$router.push({path:'/returnStatus/' + this.formData.idCard + '/' +  this.formData.rid });  
                  }else{                //如果有资格
                    this.$router.push({path:'/qualifyCheck4/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.getway });                   
                  }


                }else{
                  this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
                }
              }).catch(() => {
                this.$store.commit('SHOWTOAST', '网络异常!')
              })
            }


          }else{

            //returnStatus
          }
        }).catch(() => {
        // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        })       
      },
      noEffect () {   //默认无响应
      }         
    },
    created() {
      this.requireData()  //获取数据

    },
    mounted () {
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, true) // 删除支付宝右上角点击事件
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ';// ; + h + ':' + m + ':' + s;
      }
    }

}
</script>
<style lang="less" >
</style>
