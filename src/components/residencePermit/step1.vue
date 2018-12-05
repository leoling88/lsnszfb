<template>
  <div class="template_container">

    <step step="1" stepText1="基础信息" stepText2="详情信息" stepText3="信息确认"></step>
    <div class="form_cont">
      <div @click="goNext" v-if="nextBut">下一步（支付宝）</div>{{isReback}}

      <!--<cell title="照　片"><img class="user_pic" :src="formData.userPic"></cell>-->
      <cell title="姓　名" :value="formData.name" @click.native="mainOptChange"></cell>
      <cell title="身份证" :value="formData.idNo" @click.native="mainOptChange"></cell>
      <cell title="性别" :value="formData.sexC" @click.native="mainOptChange"></cell>

<!--       <custom-selector v-model="formData.sex" describe="性　别" :options="sexList" :isFirst="isFirst" :readOnly="hasRegisted" @on-click="mainOptChange"></custom-selector> -->

      <cell title="出生日期" :value="formData.birthday" @click.native="mainOptChange"></cell>

      <custom-selector v-model="formData.nation" describe="民　族" :options="nationList" :isFirst="isFirst" :readOnly="hasRegisted" @on-click="mainOptChange"></custom-selector>

      <x-input v-model="formData.phoneNo" title="手机号" placeholder="请输入联系手机号" :show-clear="true" placeholder-align="right" type="text" :max="11" text-align="right" :required="true" ref="phoneNo" :is-type="inputValid.cellPhone"></x-input>

      <custom-selector v-model="formData.address" describe="行政区" :options="areaList" :isFirst="isFirst" :showLoading="showLoading" :disabled="true" @change="addressChange"></custom-selector>

      <selectorSearch v-model="formData.streetTownCode" describe="街　镇" :options="streetTownList" :disabled="formData.address.length <= 1" :isFirst="isFirst" @scrollBottom="queryJzdmPage" @searchWord="queryJzdmPage" @change="streetTownChange" ref="streetTown" :showLoading="showLoading"></selectorSearch>


      <selectorSearch v-model="formData.streetAlleysCode" describe="街道巷" :options="streetAlleysList" :disabled="formData.streetTownCode.length <= 1" :isFirst="isFirst" @scrollBottom="queryJddmPage" @searchWord="queryJddmPage" @change="streetAlleysChange" ref="streetAlleys" :showLoading="showLoading"></selectorSearch>

      <selectorSearch v-model="formData.doorNumberCode" describe="门牌号" :options="doorNumberList" :disabled="formData.streetAlleysCode.length <= 1 || formData.streetTownCode.length <= 1" :isFirst="isFirst" @scrollBottom="queryFwxxzPage" @searchWord="queryFwxxzPage" @change="doorNumberChange" ref="doorNumber" :showLoading="showLoading"></selectorSearch>

      <selectorSearch v-model="formData.roomNumberCode" describe="详址/房号" :options="roomNumberList" @scrollBottom="queryFwxxfhPage"  @searchWord="queryFwxxfhPage" @change="roomNumberChange" :disabled="formData.doorNumberCode.length <= 1 || formData.streetAlleysCode.length <= 1 || formData.streetTownCode.length <= 1" :isFirst="isFirst" ref="roomNumber" :showLoading="showLoading"></selectorSearch>

    </div>


    <div v-transfer-dom>
      <confirm v-model="isShowConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">确认并核对系统登记信息内容无误？</p>
      </confirm>
    </div>

    <div v-transfer-dom>
      <alert v-model="Alert.state" title="操作提示">{{Alert.text}}</alert>
    </div>

  </div>
</template>
<script>
  import {XInput, XButton, Group, Cell, Icon, Datetime, Confirm, TransferDomDirective as TransferDom, Value2nameFilter as value2name, Alert } from 'vux'
  import customSelector from '../common/customSelector.vue'
  import AddressEditor from '../common/AddressEditor.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import ScrollerRadio from '../common/ScrollerRadio.vue'
  import Step from '../common/Step.vue'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import moment from 'moment'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step1',
    components: {XInput, XButton, Group, Cell, Icon, Datetime, customSelector, VueCoreImageUpload, Confirm,Step,SelectorSearch, AddressEditor, ScrollerRadio, Alert },
    directives: {
      TransferDom
    },
    data() {
      return {
        nextBut: true,     //显示下一步按钮
        serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1,  // 业务类型，1,为登记，2，为居住证
        isFirst: true, // 是否是第一次选择或输入
        isShowConfirm: false,
        isReback: true,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        showLoading: true,
        readonly: true,
        comGuid: this.$route.params.comGuid,
        maxYear: new Date().getFullYear(),
        formDataBackup: {},  // 用户数据副本，用于比较用户数据是否变更
        homeType: this.$route.params.homeType,     //地区
        idCard: this.$route.params.idCard,
        userStyle:this.$route.params.userStyle,   //是否是新增
        formData: { // 表单数据
          recordstate: 1, // 登：记状态
          alipayAcount: this.$route.params.alipayAcount,  // openid
          userPic: '../../../static/images/house_m.jpg',// 照片
          zhimascore: '',
          name: '',// 姓名
          idNo: '', // 身份号
          phoneNo: '',  // 手机号
          sex: '',  // 性别
          sexC:'',
          birthday: '', // 生日
          nation:  '', // 民族
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
          newRoomNumberName: '', // 手动新增房号
          newAddress: ''
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
        Alert: {
          state: false,
          type: 1,
          text: '请您到辖区来穗机构服务窗口进行主项信息变更 ！'
        },
        inputValid: {
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
      ...mapState([
        'openid','wxsqm','wxsqn','idNo'
      ]),
      hasRegisted: function () {  // 是否已在来穗系统做过登记
        return !!this.formData.nation
      }
    },
    filters: {
      hideMiddle(val) {
        return `${val.substr(0, 6)}********${val.substr(val.length - 4)}`
      }
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

        if (this.isReback) { // 数据回填
          this.queryJddmPage(this.formData.streetAlleysName)  // 查询街道巷
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
        if (this.isReback) {
          this.queryFwxxzPage(this.formData.doorNumberName)  // 查询门牌号,没有分页
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
        this.isReback = false  // 数据回填结束
        this.formData.roomNumberName = name
      },
      goNext(){  // 下一步按钮
        this.isFirst = false
        this.$refs.phoneNo.validate()
        const validate = this.validate()

        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          if (this.hasChange()) {  // 用户信息有变更
            this.isShowConfirm = !this.isShowConfirm
          } else { // 没有变更直接跳下一步
            // const query = {
            //   serviceType: this.serviceType,
            //   comGuid: this.$route.params.comGuid,
            //   openid:this.$route.params.alipayAcount,
            //   zhimascore:this.formData.zhimascore
            // }
            this.$router.push({path:'/step2/' + this.formData.idNo});
          }
        }
      },
      onConfirm () {  // 确认
        this.$store.commit('UPDATE_LOADING', true);
        api.saveResideInfo({
          formData: this.formData,
          homeType: 'lspy_'  // 番禺区域标记
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          console.log(res.data)
          if(res.data.success) {
            const query = {
              // serviceType: this.serviceType,
              // comGuid: this.$route.params.comGuid,
              // openid:this.$route.params.alipayAcount,
              // zhimascore:this.formData.zhimascore
            }
            this.$router.push({path:'/step2/' + this.formData.idNo});
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';
        if (!this.formData.sex || this.formData.sex == null) { // 性别
          errorMsg = '请选择性别！'
        } else if (!this.formData.birthday) { // 生日
          errorMsg = '请选择出生日期！'
        } else if (!this.formData.nation) { // 民族
          errorMsg = '请选择民族！'
        } else if (!this.formData.phoneNo) { // 手机号码
          errorMsg = '手机号不能为空！'
        } else if (!this.$Utils.isPhone(this.formData.phoneNo)) {
          errorMsg = '手机号不合法！'
        } else if (!this.formData.address || this.formData.address == '1') { // 现居住地区
          errorMsg = '请选择居住地区域！'
        } else if (!this.formData.streetTownCode || this.formData.streetTownCode == '2') { // 街镇
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
            this.laisuiFilerData(data.XB, this.sexList);
            this.laisuiFilerData(data.MZ, this.nationList);
          }
        });
/*        api.queryXzqList({   // 行政区域
          openid: this.openid,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
          wxsqm: this.wxsqm
        }).then((res) => {  // 广州行政区
          if (res.data.success) {
            const data = JSON.parse(res.data.jsonRes[0]);
            this.areaList = []
            if (data.ackCode == 1) this.laisuiFilerData(data.dataList, this.areaList);
          }
          this.showLoading = false
        }).catch(() => {
          this.showLoading = false
        });*/
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

//        //api.getUserDetails({idCard:this.comGuid}).then(res => {    //20180813 改
        //

        api.getPeopleDetailsMS({idCard:this.idCard,homeType:this.homeType}).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const attributes = res.data.attributes
          const data = res.data.obj
          if(res.data.success){
            let _idcard = data.idcard
            let _sex
            if(_idcard.length > 15){
              _sex = _idcard.charAt(_idcard.length - 2)
              if(_sex % 2 ==0){
                this.formData.sex  = 2
                this.formData.sexC = '女'
              }
              else{
                this.formData.sex  = 1
                this.formData.sexC = '男'
              }
                console.log("===>" +this.formData.sex)
            }else{
              _sex =  _idcard.charAt(_idcard.length-1)
               console.log("===>" +this.formData.sex)
              if(_sex % 2 ==0){
                this.formData.sex  = 2
                this.formData.sexC = '女'
              }
              else{
                this.formData.sex  = 1
                this.formData.sexC = '男'
              }
            }
            localStorage.setItem("USER_SEX", this.formData.sex)

            this.formData.userPic = data.pic;
            this.formData.name = data.realname ? data.realname : '';
            this.formData.idNo = data.idcard ? data.idcard : '';
            this.formData.zhimascore = data.zhimascore ? data.zhimascore : '';
            this.$emit('UPDATE_ID_NO', this.formData.idNo)
            // this.formData.birthday = moment(data.birthday).format("YYYY-MM-DD");
            
            this.formData.birthday = data.idcard.substring(6,10) + '-' + data.idcard.substring(10,12) + '-' + data.idcard.substring(12,14);

            this.formData.nation = data.nation ? data.nation : ''; // 民族
            this.formData.phoneNo = data.linkphone ? data.linkphone : '';
            this.$store.commit('UPDATE_ID_NO',data.idcard);  // 保存用户的身份证号，在居住证办理时会用到
            this.formData.address = '440113'
            this.formData.addressName = '番禺区'
            if (this.formData.address == attributes.address) {  // 如果用户数据是番禺区的才会回填
              this.formData.newAddress = attributes.newAddress
              this.formData.streetTownCode = attributes.streetTownCode
              this.formData.streetTownName = attributes.streetTownName
              this.formData.streetAlleysCode = attributes.streetAlleysCode
              this.formData.streetAlleysName = attributes.streetAlleysName
              this.formData.newStreetAlleysName = attributes.newStreetAlleysName
              this.formData.doorNumberCode = attributes.doorNumberCode
              this.formData.doorNumberName = attributes.doorNumberName
              this.formData.newDoorNumberName = attributes.newDoorNumberName
              this.formData.roomNumberCode = attributes.roomNumberCode
              this.formData.roomNumberName = attributes.roomNumberName
              this.formData.newRoomNumberName = attributes.newRoomNumberName

              this.isReback = true

            } else {
              this.isReback = false
            }
            this.formDataBackup = Object.assign(this.formDataBackup, this.formData)
            if(this.userStyle == 1){
              api.setPeopleDetailsMS({idCard:this.idCard}).then(res => {
              });
            }

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
          openid: this.idCard,//openid: this.openid,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
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
          openid: this.idCard,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
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
          openid: this.idCard,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
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
          openid: this.idCard,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
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
    mounted () {
      if (this.serviceType == 1) {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住信息登记'});
      } else {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证办理'});
      }
      if (window.AlipayJSBridge) this.nextBut = false
      this.$store.commit('UPDATE_COMGUID',this.comGuid);
      this.$store.commit('UPDATE_ALIPAY_ACOUNT',this.formData.alipayAcount);
      this.getDictionary();
      this.getAlipayInfo();
      document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goNext, false) // 删除支付宝右上角点击事件
    }
  }
</script>
<style lang="less" scoped>
  .form_cont{position: relative;width:100%;overflow: hidden;}
  .user_pic{width:auto;height:1.2rem;}
  .go_prev_btn{width:1rem;height:48px;line-height:48px;position: absolute;top:0;left:.3rem;color:#fff;text-indent: -99999px;}
  .go_next_btn{width:1rem;height:1rem;line-height:1rem;position: absolute;top:0;right:.3rem;color:#fff;}


</style>

