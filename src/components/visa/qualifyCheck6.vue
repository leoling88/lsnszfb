<template>
  <div class="template_container">
    <step class="noBorbt" step="3" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>
    <div class="form_cont" id="qualifyCheck6" >
      <!-- <div @click="goNext">下一步</div> -->
      <!--个人基本信息-->
      
      <div class="box">
        <group title="个人基本信息" class="group_cont borbte5 changeCell">
          <cell title="姓　名" :value="formData.realName"></cell>
          <cell title="身份号码" :value="formData.idCard"></cell>
          <cell title="手机号码" :value="formData.phone"></cell>
        </group>
      </div>


      <!--居住地址信息-->
      <div class="box">
        <span class="more" @click="clickModify(1)" v-if="formData.isModify == 1">修改</span>
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
      </div>
      <!--随行人员信息（15周岁及以下--
      <div class="box">
        <group title="随行人员信息（15周岁及以下）" class="group_cont borbte5 changeCell">
          <cell title="姓名" :value="formData3.name"></cell>
          <cell title="身份证号码" :value="formData3.idNum"></cell>
          <cell title="与申请人关系" :value="formData3.relation"></cell>
        </group>
      </div>
      --领取方式-->
      <div class="box" @click="clickModify(2)">
        <span class="more" @click="clickModify" v-if="formData.isModify == 2">修改</span>
        <group title="领证方式" class="group_cont borbte5 changeCell">
          <cell title="领证方式" :value="formData.getwayTitle1"></cell>
          <cell :title="formData.lqfs.label1" :value="formData.getwayServer1"></cell>
          <cell :title="formData.lqfs.label2" :value="formData.getwayPhone1"></cell>
          <cell :title="formData.lqfs.label3" :value="formData.getwayAdd1"></cell>
        </group>
      </div>
    </div>
    <div>
      <p class="notesTis">请仔细核对以上信息，如需要修改请返回上一步，核对无误后确认提交。</p>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn" @click="goNext">确认提交</a>
      </div>
    </div>
    <!--确认、取消弹窗-->
    <div v-transfer-dom>
      <Alert v-model="Alerts.isShow" title="操作提示" :hide-on-blur="true">
        <p style="text-align:center;">{{Alerts.text}}</p>
      </Alert>
    </div>
    <!--确认、取消弹窗 END-->
    <div v-transfer-dom>
      <confirm v-model="Confirm.isShow" title="操作提示" @on-confirm="resetDatas">
        <p style="text-align:center;">{{Confirm.text}}</p>
      </confirm>
    </div>

  </div>
</template>
<script>
  import {Alert, Group, Cell, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import Step from '../common/Step.vue'
  import customSelector from '../common/customSelector.vue'

  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'qualifyCheck6',
    components: { Confirm, Alert, Group, Cell, Step, customSelector},
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
          getway:this.$route.params.getway,    //领取方式
          getwayTitle1:'',
          getwayAdd1:'',
          getwayPhone1:'',
          getwayName1:'',
          getwayServer1:'',
          recordstate:1,  //0登记中，1,登记状  ，2已提交
          isModify:'', //是否可修改 1.不能修改领取方式，能修改居住数据 2.可以修改领取方式，不能修改居住数据
          lqfs:{
            label1:'街道名称',
            label2:'街道电话',
            label3:'街道地址'

          }

        },
        Alerts:{
          isShow: false,
          text:''

        },
        Confirm:{
          isShow: false,
          type:'',
          text:''
        },
        liveTypeList:[],
        resonList:[],

      }
    },
    methods: {
      checkVal () {
        if (!this.formData.rid)  {
          this.Alerts.isShow = true
          this.Alerts.text = '参数缺失！'
          return false
        }else{
          return true
        }

      },
      goNext () {
        this.$router.push({path:'/returnStatus/' + this.formData.idCard + '/'+this.formData.rid});
      },
      getAlipayInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        // if (this.formData.getway == 2){
        //   this.formData.type = 245
        // }else if(this.formData.getway == 1){
        //   this.formData.type = 134
        // }
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
            const _operate = res.data.obj.operate
            const _attributes = res.data.obj.areaContact     //自主领取
            if (this.formData.getway == 2 ){     //自主领取
                this.formData.getwayTitle1 = '自行领取'   //自主领取方式
                this.formData.lqfs.label1 = '街道名称'
                this.formData.lqfs.label2 = '街道电话'
                this.formData.lqfs.label3 = '街道地址'
                this.formData.getwayAdd1 = _attributes.address    //自主领取地址
                this.formData.getwayServer1 = _attributes.fullName    //自主领取服务站名称
                this.formData.getwayPhone1 = _attributes.phone    //自主领取服务站电话
                this.formData.isModify = res.data.obj.operate    //是否修改信息
              if (_operate == 2) {
                const _odatas = res.data.obj.residentialPermit     //自主领取 
                this.formData.lqfs.label1 = '详细地址'
                this.formData.lqfs.label2 = '联系人电话'
                this.formData.lqfs.label3 = '联系人姓名'
                this.formData.streetTownCode = _odatas.jz       //街镇
                this.formData.streetTownName = _odatas.jz_dict       //街镇
                this.formData.streetAlleysCode = _odatas.jwh       //街道巷
                this.formData.streetAlleysName = _odatas.jwh_dict
                this.formData.reson = _odatas.zzsy      //居住事由key
                this.formData.liveType = _odatas.jzfs     //居住方式key
                this.formData.doorNumberCode = _odatas.jddm     //房号
                this.formData.doorNumberName = _odatas.jddm_dict   //房号
                this.formData.roomNumberCode = _odatas.roomnumbercode    //详址/房号
                this.formData.roomNumberName = _odatas.mpmc    //详址/房号
              }else{
                const _datas = res.data.obj.renewPeopleInfo     //自主领取 
                this.formData.streetTownCode = _datas.streettowncode       //街镇
                this.formData.streetTownName = _datas.streettownname       //街镇
                this.formData.streetAlleysCode = _datas.streetalleyscode       //街道巷
                this.formData.streetAlleysName = _datas.streetalleysname
                this.formData.reson = _datas.livereson      //居住事由key
                this.formData.liveType = _datas.livemode     //居住方式key
                this.formData.doorNumberCode = _datas.doornumbercode     //房号
                this.formData.doorNumberName = _datas.doornumbername   //房号
                this.formData.roomNumberCode = _datas.roomnumbercode    //详址/房号
                this.formData.roomNumberName = _datas.roomnumbername    //详址/房号
              }


            }else if(this.formData.getway == 1 ){    //EMS
              const _oattributes = res.data.obj.ems     //EMS
              const _odatas = res.data.obj.residentialPermit     //EMS               
              this.formData.lqfs.label1 = '详细地址'
              this.formData.lqfs.label2 = '联系人电话'
              this.formData.lqfs.label3 = '联系人姓名'
              this.formData.getwayTitle1 = 'EMS速递取证'   //自主领取方式
              this.formData.getwayAdd1 = _oattributes.scontactor //收件人姓名
              this.formData.getwayServer1 = _oattributes.scustAddr       //收件地址
              this.formData.getwayPhone1 = _oattributes.scustMobile    //自主领取服务站电话
              this.formData.isModify = res.data.obj.operate    //是否修改信息                            
              if(_operate == 2) {
                this.formData.streetTownCode = _odatas.jz       //街镇
                this.formData.streetTownName = _odatas.jz_dict       //街镇
                this.formData.streetAlleysCode = _odatas.jwh       //街道巷
                this.formData.streetAlleysName = _odatas.jwh_dict
                this.formData.reson = _odatas.zzsy      //居住事由key
                this.formData.liveType = _odatas.jzfs     //居住方式key
                this.formData.doorNumberCode = _odatas.jddm     //房号
                this.formData.doorNumberName = _odatas.jddm_dict   //房号
                this.formData.roomNumberCode = _odatas.roomnumbercode    //详址/房号
                this.formData.roomNumberName = _odatas.mpmc    //详址/房号

              }


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

      clickModify(index){
        if (index == 1){
            this.Confirm.isShow = true
            this.Confirm.text = '您确认要修改"居住地址信息吗？'
            this.Confirm.type = 1

        }else if(index == 2){
            this.Confirm.isShow = true
            this.Confirm.text = '您确认要修改"领证方式吗？'
            this.Confirm.type = 2
        }

      },
      resetDatas() {
        if (this.Confirm.type == 1) {
          this.$router.push({path:'/recordChange/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid}) 
        }else if (this.Confirm.type == 2) {
          this.$router.push({path:'/claimsFor/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.getway});             

        }
      },
      noEffect () {   //默认无响应
      }  

      
    },
    created() {
      const backtype = localStorage.getItem('backType')
      if (backtype == 'ban'){       //用于禁止提交成功后从结果页返回
        this.$router.push({path:'/jzz?alipayId='+sessionStorage.getItem('alipay_id')});
      }   

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
   #qualifyCheck6 .weui-cell__ft{padding-right:0;}
 #qualifyCheck6 .weui-cell__ft:after {display: none;}
</style>
