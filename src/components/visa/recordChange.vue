<template>
  <div class="template_container">
    <step class="noBorbt" step="1" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>
    <div class="form_cont" id="recordChange">
      <!-- <div @click="goNext">下一步</div> -->
      <!--居住地址信息-->
      <group title="居住地址信息" class="group_cont borbte5">

        <custom-selector v-model="formData.address" describe="行政区" :options="areaList" :isFirst="isFirst" :showLoading="showLoading" :disabled="true" @change="addressChange"></custom-selector>

        <selectorSearch v-model="formData.streetTownCode" describe="街　镇" :options="streetTownList" :disabled="formData.address.length <= 1" :isFirst="isFirst" @scrollBottom="queryJzdmPage" @searchWord="queryJzdmPage" @change="streetTownChange" ref="streetTown" :showLoading="showLoading" class="on"></selectorSearch>


        <selectorSearch v-model="formData.streetAlleysCode" describe="街道巷" :options="streetAlleysList" :disabled="formData.streetTownCode.length <= 1" :isFirst="isFirst" @scrollBottom="queryJddmPage" @searchWord="queryJddmPage" @change="streetAlleysChange" ref="streetAlleys" :showLoading="showLoading" class="on"></selectorSearch>

        <selectorSearch v-model="formData.doorNumberCode" describe="门牌号" :options="doorNumberList" :disabled="formData.streetAlleysCode.length <= 1 || formData.streetTownCode.length <= 1" :isFirst="isFirst" @scrollBottom="queryFwxxzPage" @searchWord="queryFwxxzPage" @change="doorNumberChange" ref="doorNumber" :showLoading="showLoading" class="on"></selectorSearch>

        <selectorSearch v-model="formData.roomNumberCode" describe="详址/房号" :options="roomNumberList" @scrollBottom="queryFwxxfhPage"  @searchWord="queryFwxxfhPage" @change="roomNumberChange" :disabled="formData.doorNumberCode.length <= 1 || formData.streetAlleysCode.length <= 1 || formData.streetTownCode.length <= 1" :isFirst="isFirst" ref="roomNumber" :showLoading="showLoading" class="on"></selectorSearch>
  
<!--         <custom-selector v-model="formData.place" describe="派出所" :options="placeList"  :isFirst="isFirst"></custom-selector> -->
        <custom-selector v-model="formData.reson" describe="居住事由" :options="resonList"  :isFirst="isFirst"></custom-selector>
        <custom-selector v-model="formData.liveType" describe="居住方式" :options="liveTypeList"  :isFirst="isFirst"></custom-selector>
      </group>
    </div>
    <div>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn" @click="onConfirm">确认修改</a>
      </div>
    </div>



     <!--确认、取消弹窗-->
<!--     <div v-transfer-dom>
      <confirm v-model="Confirm.isShow" title="操作提示" @on-confirm="">
        <p style="text-align:center;">{{Confirm.text}}</p>
      </confirm>
    </div> -->
    <!--确认、取消弹窗 END-->
  </div>
</template>
<script>
  import {XInput, Group, Cell, Datetime,XAddress, ChinaAddressV4Data, Confirm,TransferDomDirective as TransferDom, Value2nameFilter as value2name,Search, Icon, Alert } from 'vux'
  import customSelector from '../common/customSelector.vue'
  import AddressEditor from '../common/AddressEditor.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import ScrollerRadio from '../common/ScrollerRadio.vue'
  import Step from '../common/Step.vue'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import moment from 'moment'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  import Scroller from "../../../node_modules/vux/src/components/scroller/index";
  export default {
    name: 'recordChange',
    components: {Scroller, Group, Cell, XInput, Datetime, XAddress, ChinaAddressV4Data,customSelector, Confirm, Step, SelectorSearch, Search, Icon, Alert},
    directives: {TransferDom},
    data() {
      return {
        serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1,  // 业务类型，1,为登记，2，为居住证
        isFirst: true, // 是否是第一次选择或输入
        isShowConfirm: false,
        isReback: false,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        showLoading: true,
        readonly: true,
        formDataBackup: {},  // 用户数据副本，用于比较用户数据是否变更

        formData: { // 表单数据
          realName: this.$route.params.name,
          idCard: this.$route.params.idCard,
          openid: this.$route.params.openid,
          idNo: this.$route.params.idCard,
          wxsqn: this.$route.params.idCard,

          orginType: 1,// 支付宝标记,
          opentype: 1,
          homeType: 'lspy_',  // 番禺区域标记,
          rid: this.$route.params.cid,   //签注流程id
          type: 2,  //1.居住证 2.居住登记3.EMS
          zhimascore: '',
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
          liveType:'',   //居住方式
          reson:'', //居住事由
          recordstate:0,   //0登记中，1,登记状  ，2已提交

        },
        uploadData:{},
        sexList:[],
        nationList:[],
        areaList:[{
          key: '440113',
          value: '番禺区'
        }],
        streetTownList:[],
        streetAlleysList:[],
        doorNumberList:[],
        roomNumberList: [],
        showAddress: false,
        liveTypeList:[],
        resonList:[],
        Alert: {
          state: false,
          type: 1,
          text: '请您到辖区来穗机构服务窗口进行主项信息变更 ！'
        },
        inputValid: {
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
      ...mapState([
        'openid','wxsqm','wxsqn','idNo'
      ]),
    },
    filters: {

    },
    methods: {

      addressChange (key, name) {  // 选择行政区
        
        if (this.isReback) { // 数据回填
          this.queryJzdmPage()  // 查询街镇
        } else {
          this.formData.streetTownCode = ''
          this.streetTownList = []
          this.formData.streetAlleysCode = ''
          this.streetAlleysList = []
          this.formData.doorNumberCode = ''
          this.doorNumberList = []
          this.formData.roomNumberCode = ''
          this.roomNumberList = []
          this.queryJzdmPage()  // 查询街镇
        }
        this.formData.addressName = '番禺区'
      },
      streetTownChange (key, name) {  // 选择街镇
        console.log('街镇'+this.isReback)

        if (this.isReback) { // 数据回填
          this.queryJddmPage()  // 查询街道巷
        } else {
          this.formData.streetAlleysCode = ''
          this.streetAlleysList = []
          this.formData.doorNumberCode = ''
          this.doorNumberList = []
          this.formData.roomNumberCode = ''
          this.roomNumberList = []
          this.queryJddmPage()  // 查询街道巷
        }

        this.formData.streetTownName = name

      },
      streetAlleysChange (key, name) {  // 选择街道巷
        console.log('街道巷'+this.isReback)
        if (this.isReback) {

          this.queryFwxxzPage()  // 查询门牌号,没有分页
        } else {
          this.formData.doorNumberCode = ''
          this.doorNumberList = []
          this.formData.roomNumberCode = ''
          this.roomNumberList = []
          this.queryFwxxzPage()
        }
        this.formData.streetAlleysName = name
      },
      newStreetAlleysChange (val) { // 手动新增街道巷
        if (val) {
          this.formData.newStreetAlleysName = val
          this.formData.streetAlleysCode = -1
          this.formData.doorNumberCode = -1
          this.formData.roomNumberCode = -1
        }
      },
      doorNumberChange (key, name) {  // 选择门牌号
console.log('门牌号'+this.isReback)
        if (this.isReback) { // 数据回填
          this.queryFwxxfhPage(this.formData.roomNumberName)  // 查询房号
        } else {
          this.formData.roomNumberCode = ''
          this.roomNumberList = []
          this.queryFwxxfhPage()  // 查询房号
        }
        this.formData.doorNumberName = name
      },
      roomNumberChange (key, name) {  // 选择房号
console.log('房号'+this.isReback)

        //this.isReback = false  // 数据回填结束
        this.formData.roomNumberName = name
      },
      goNext(){  // 下一步按钮
        // this.isFirst = false
        // this.$refs.phoneNo.validate()
        // const validate = this.validate()

        // if (!validate.valid) {
        //   this.$store.commit('SHOWTOAST', validate.errorMsg);
        // } else {
        //   if (this.hasChange()) {  // 用户信息有变更
        //     this.isShowConfirm = !this.isShowConfirm
        //   } else { 

        //     // this.$router.push({path:'/step2/' + this.formData.idNo});
        //   }
        // }
      },
      onConfirm () {  // 确认
        this.$store.commit('UPDATE_LOADING', true);
        if (this.validate()) {

          api.setJZDJDatas(this.formData).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
                  this.$router.push({path:'/qualifyCheck3/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/1'});             
            }else{
              this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
            }
          }).catch(() => {
            // this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('SHOWTOAST', '网络异常!')
          })


        }

      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';
        if (!this.formData.streetTownCode || this.formData.streetTownCode == '2') { // 街镇
          errorMsg = '请选择街道巷！'
        }  else if (!this.formData.streetAlleysCode || this.formData.streetAlleysCode == '3') { // 街道巷
          errorMsg = '请选择街道巷！'
        } else if (!this.formData.doorNumberCode || this.formData.doorNumberCode == '4') { // 门牌号
          errorMsg = '请选择门牌号！'
        } else if (!this.formData.roomNumberCode || this.formData.roomNumberCode == '5') { // 房号
          errorMsg = '请选择房号！'
        } else {
          valid = true
          errorMsg = ''
        }
        return {valid, errorMsg}
      },
      getDictionary(){ // 获取所有的字典
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
      roorFilerData(srcData, toData){ // 接口原因这里专门针对房号做一个过滤器
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              value: item.dy,
              key: item.fhid
            })
          });
        }
      },
      getAlipayInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.requireData({
            idCard: this.formData.idCard,
            realName: this.formData.realName,
            homeType: this.formData.homeType,
            type: this.formData.type, 
            rid:this.formData.rid

          }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const attributes = res.data.obj.renewPeopleInfo
          if(res.data.success){
            this.formData.address = '440113'
            this.formData.addressName = '番禺区'
            if (this.formData.address == attributes.jzcountycode) {  // 如果用户数据是番禺区的才会回填
              this.formData.streetTownCode = attributes.streettowncode       //街镇
              this.formData.streetTownName = attributes.streettownname       //街镇
              this.formData.streetAlleysCode = attributes.streetalleyscode       //街道巷
              this.formData.streetAlleysName = attributes.streetalleysname
              this.formData.reson = attributes.livereson      //居住事由key
              this.formData.liveType = attributes.livemode     //居住方式key
              this.formData.doorNumberCode = attributes.doornumbercode     //房号
              this.formData.doorNumberName = attributes.doornumbername   //房号
              this.formData.roomNumberCode = attributes.roomnumbercode    //详址/房号
              this.formData.roomNumberName = attributes.roomnumbername    //详址/房号
              this.isReback = false


            } else {
              this.isReback = false
            }
            // this.formDataBackup = Object.assign(this.formDataBackup, this.formData)
            // if(this.userStyle == 1){
            //   api.setPeopleDetailsMS({idCard:this.idCard}).then(res => {
            //   });
            // }

          }
        }).catch((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          this.isReback = false
        })
      },
      queryJzdmPage (keyWord, currentPage, isClear) {  // 街镇查询, currentPage: 分页，keyWord：搜索关键字，isClear：搜索框文本变动，是否清空数组
        if (isClear) this.streetTownList = [] // 关键字变更，清空数组
        this.showLoading = true
        api.queryJzdmPage({
          openid: this.formData.idCard,//openid: this.openid,
          wxsqn: this.formData.wxsqn,
          account: this.formData.idCard,
          xzq: this.formData.address,
          itemName: keyWord ? keyWord : '',
          currentPage: currentPage ? currentPage : 1
        }).then((res) => {
          const data = JSON.parse(res.data.jsonRes[0]);
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.showLoading = false
          if (res.data.success) {
            if (data.page.currentPage < currentPage) {
              this.$refs.streetTown.disablePullup()
              return
            }
            if (data.ackCode == 1) this.laisuiFilerData(data.dataList, this.streetTownList);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.isReback = false
          this.showLoading = false
        })
      },
      queryJddmPage (keyWord, currentPage, isClear) {  // 街道巷查询 currentPage: 分页，keyWord：搜索关键字，isClear：是否清空数组
        if (isClear) this.streetAlleysList = []
        this.showLoading = true
        api.queryJddmPage({
          openid: this.formData.idCard,//openid: this.openid,
          wxsqn: this.formData.wxsqn,
          account: this.formData.idCard,
          xzq: this.formData.address,
          jz: this.formData.streetTownCode,
          itemName: keyWord ? keyWord : '',
          currentPage: currentPage ? currentPage : 1
        }).then((res) => {
          const data = JSON.parse(res.data.jsonRes[0]);
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.showLoading = false
          if (res.data.success) {
            if (data.page.currentPage < currentPage) {
              this.$refs.streetAlleys.disablePullup()
              this.isReback = false
              return
            }
            if (data.ackCode == 1) this.laisuiFilerData(data.dataList, this.streetAlleysList);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.isReback = false
          this.showLoading = false
        })
      },
      queryFwxxzPage (keyWord, currentPage, isClear) {  // 门牌号查询 currentPage: 分页
        this.showLoading = true
        if (isClear) this.doorNumberList = []

        api.queryFwxxzPage({
          openid: this.formData.idCard,//openid: this.openid,
          wxsqn: this.formData.wxsqn,
          account: this.formData.idCard,
          xzq: this.formData.address,
          account: this.formData.idCard,
          jddm: this.formData.streetAlleysCode,
          mpmc: keyWord ? keyWord : '',
          currentPage: currentPage ? currentPage : 1,
        }).then((res) => {
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.showLoading = false
          if (res.data.success) {
            const data = JSON.parse(res.data.jsonRes[0]);
            this.$store.commit('UPDATE_LOAD_MORE', false);
            if (data.page.currentPage < currentPage) {
              this.$refs.doorNumber.disablePullup()
            
              this.isReback = false
              return
            }

            if (data.ackCode == 1) this.laisuiFilerData(data.dataList, this.doorNumberList);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.isReback = false
          this.showLoading = false
        })
      },
      queryFwxxfhPage (keyWord, currentPage, isClear) {  // 房号查询 currentPage: 分页，keyWord：搜索关键字，isClear：是否清空数组
        this.showLoading = true
        if (isClear) this.roomNumberList = []
        api.queryFwxxfhPage({
          openid: this.formData.idCard,//openid: this.openid,
          wxsqn: this.formData.wxsqn,
          account: this.formData.idCard,
          zhid: this.formData.doorNumberCode,
          currentPage: currentPage ? currentPage : 1,
          dy:  keyWord ? keyWord : '',
        }).then((res) => {
          const data = JSON.parse(res.data.jsonRes[0]);
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.showLoading = false
          if (res.data.success) {
            this.$store.commit('UPDATE_LOAD_MORE', false);
            if (data.page.currentPage < currentPage) {
              this.$refs.roomNumber.disablePullup()
              this.isReback = false
              return
            }
            if (data.ackCode == 1) this.roorFilerData(data.dataList, this.roomNumberList);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOAD_MORE', false);
          this.isReback = false
          this.showLoading = false
        })
      },
      mainOptChange () {  // 主项信息变更
        if (!this.hasRegisted) return
        this.Alert.state = true
        this.Alert.type = 1
        this.Alert.text = '请您到辖区来穗机构服务窗口进行主项信息变更 ！'
      },
      hasChange() {  // 检测用户数据是否变更
        for (let i in this.formData) {
          if (this.formData[i] != this.formDataBackup[i]) return true
        }
      }
    },
    created() {
    },    
    mounted () {
      this.getDictionary();
      this.getAlipayInfo();
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, false) // 删除支付宝右上角点击事件
    }
  }
  </script>
  <style lang="less">
 #recordChange .weui-cell__ft{color:#000!important;}
</style>
