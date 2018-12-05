<template>
  <div class="template_container">
    <step class="noBorbt" step="1" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>
    <div class="form_cont" id="qualifyCheck3" >
      <!-- <div @click="goNext">下一步</div> -->
      <!--个人基本信息-->
      <group title="个人基本信息" class="group_cont borbte5 changeCell">
        <cell title="姓  名" :value="formData.realName"></cell>
        <cell title="公民身份号码" :value="formData.idCard"></cell>
<!--         <cell title="手机号码" :value="formData.phone"></cell>
 -->      </group>
      <!--居住地址信息-->
      <group title="居住地址信息" class="group_cont borbte5 changeCell">
        <cell title="地区" :value="formData.addressName"></cell>
        <cell title="街镇" :value="formData.streetTownName"></cell>
        <cell title="街道巷" :value="formData.streetAlleysName"></cell>
        <cell title="门牌" :value="formData.doorNumberName"></cell>
        <cell title="房号" :value="formData.roomNumberName"></cell>
<!--         <cell title="派出所" :value="formData2.polices"></cell>
 -->       <!--  <cell title="居住事由" :value="formData.reson"></cell>
        <cell title="联系方式" :value="formData.liveType"></cell>  -->
        <custom-selector v-model="formData.reson" describe="居住事由" :options="resonList"  :disabled="true" ></custom-selector >
        <custom-selector v-model="formData.liveType" describe="居住方式" :options="liveTypeList"   :disabled="true" ></custom-selector>


      </group>
      <!--确认、取消弹窗-->
      <div v-transfer-dom>
        <Alert v-model="Alerts.isShow" title="操作提示" :hide-on-blur="true">
          <p style="text-align:center;">{{Alerts.text}}</p>
        </Alert>
      </div>
      <!--确认、取消弹窗 END-->

    </div>
    <div>
      <p class="notesTis">请仔细核对以上信息，如需要修改请返回上一步，核对无误后确认提交。</p>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn"  @click="goNext">确认提交</a>
      </div>
    </div>
  </div>
</template>
<script>

  import {Alert, Group, Cell,TransferDomDirective as TransferDom } from 'vux'
  import customSelector from '../common/customSelector.vue'
  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'qualifyCheck3',
    components: {Group, Cell, Step, Alert,customSelector},
    directives: {TransferDom},
    data() {
      return {
        formData: { // 表单数据
          realName: this.$route.params.name,
          idCard: this.$route.params.idCard,
          openid: this.$route.params.openid,
          phone:'',
          orginType: 1,// 支付宝标记,
          opentype: 1,
          homeType: 'lspy_',  // 番禺区域标记,
          rid: this.$route.params.cid,   //签注流程id
          type: 12345,  //1.居住证 2.居住登记3.EMS
          zhimascore: '',
          address:'',   //地区
          address: '1',  //现居住行政区key,440113表示番禺区
          addressName: '',
          streetTownCode: '2', // 街镇key
          streetTownName: '',
          streetAlleysCode: '3',  //街道巷key
          streetAlleysName: '',
          newStreetAlleysName: '',  // 手动新增街道巷
          doorNumberCode: '4',  // 门牌号key
          doorNumberName: '',
          newDoorNumberName: '', // 手动新增门牌号
          roomNumberCode: '5', //房号key
          roomNumberName: '',
          reson:'6' ,//居住事由key
          jzsyName:'',//居住事由
          liveType:'7',//居住方式key
          jzfsName:'',//居住方式
          newRoomNumberName: '', // 手动新增房号
          newAddress: '',
          getway: this.$route.params.getway,    //是改签 1不是，2是

          recordstate:1,  //0登记中，1,登记状  ，2已提交

        },

        Alerts:{
          isShow: false,
          text:''

        },  
        liveTypeList:[],
        resonList:[],

      }
    },
    methods: {
      checkVal () {
        if (!this.formData.realName || !this.formData.idCard || !this.formData.streetTownCode ||!this.formData.streetAlleysCode || !this.formData.doorNumberCode || !this.formData.roomNumberCode || !this.formData.liveType || !this.formData.reson || !this.formData.recordstate)  {
          this.Alerts.isShow = true
          this.Alerts.text = '参数缺失！'
          return false
        }else{
          return true
        }

      },
      goNext () {
        if(this.checkVal ()){
          this.onConfirm () 

        }
      },
      getAlipayInfo () {
        this.$store.commit('UPDATE_LOADING', true);

        api.requireData({
            idCard: this.formData.idCard,
            realName: this.formData.realName,
            homeType: this.formData.homeType,
            type: this.formData.type, 
            rid:this.formData.rid, 

          }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);



          if(res.data.success){
            this.formData.address = '440113'
            this.formData.addressName = '番禺区'
                // if (this.formData.address == _data.jzcountycode) {  // 如果用户数据是番禺区的才会回填
            if (this.formData.getway == 1){     //来自签注
              const _data = res.data.obj.renewPeopleInfo
              this.formData.streetTownCode = _data.streettowncode       //街镇
              this.formData.streetTownName = _data.streettownname       //街镇
              this.formData.streetAlleysCode = _data.streetalleyscode       //街道巷
              this.formData.streetAlleysName = _data.streetalleysname
              this.formData.reson = _data.livereson      //居住事由key
              this.formData.liveType = _data.livemode     //居住方式key
              this.formData.doorNumberCode = _data.doornumbercode     //房号
              this.formData.doorNumberName = _data.doornumbername   //房号
              this.formData.roomNumberCode = _data.roomnumbercode    //详址/房号
              this.formData.roomNumberName = _data.roomnumbername    //详址/房号
            }else{
              const _odata = res.data.obj.residentialPermit
              this.formData.streetTownCode = _odata.jz       //街镇
              this.formData.streetTownName = _odata.jz_dict       //街镇
              this.formData.streetAlleysCode = _odata.jwh       //街道巷
              this.formData.streetAlleysName = _odata.jwh_dict
              this.formData.reson = _odata.zzsy      //居住事由key
              this.formData.liveType = _odata.jzfs     //居住方式key
              this.formData.doorNumberCode = _odata.jddm     //房号
              this.formData.doorNumberName = _odata.jddm_dict   //房号
              this.formData.roomNumberCode = _odata.roomnumbercode    //详址/房号
              this.formData.roomNumberName = _odata.mpmc    //详址/房号
              
            }

              this.isReback = true

            } else {
              this.isReback = false
            }
            // this.formDataBackup = Object.assign(this.formDataBackup, this.formData)
            // if(this.userStyle == 1){
            //   api.setPeopleDetailsMS({idCard:this.idCard}).then(res => {
            //   });
            // }

          // }
        }).catch((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          this.isReback = false
        })
      },
      getDictionary(){ // 获取所有的字典
        let _this = this
        api.queryDictionaryList().then(res => {
          if(res.data.success) {
            const data = res.data.obj;
            this.laisuiFilerData(data.JZFS, this.liveTypeList);//居住方式
            this.laisuiFilerData(data.ZZSY, this.resonList);//居住事由

          }
        });

      },
      laisuiFilerData(srcData, toData){ // 来穗接口筛选数据字典
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              value: item.itemName ? item.itemName : item.mph,
              key: item.itemCode ? item.itemCode : item.zhid
            })
          });
        }
      },
      onConfirm () {  // 确认
        this.$store.commit('UPDATE_LOADING', true);

          api.setJZDJDatas(this.formData).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
              this.$router.push({path:'/qualifyCheck4/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.getway});             
            }else{
              this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
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
    },
    mounted () {
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件
      this.getAlipayInfo();
      this.getDictionary();

    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, true) // 删除支付宝右上角点击事件
    }
  }
</script>
<style lang="less">
  #qualifyCheck3 .weui-cell__ft{padding-right:0;}
 #qualifyCheck3 .weui-cell__ft:after {display: none;}
</style>
