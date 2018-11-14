<template>
  <div class="template_container">

    <step step="1"></step>
    <div class="form_cont">
<!--       <div @click="goNext">下一步</div>{{isReback}}
 -->
      <!--地图组件目前还没有完成定位当前地址的功能-->
      <!--<AMap v-model="formData.locationAddress" describe="当前地址" :areaName="formData.areaName" @change="amapChange" ref="AMap"></AMap>-->

      <cell title="人员照片" ><img class="user_pic" :src="formData.userPic"></cell>

      <x-input v-model="formData.name" title="姓名" placeholder="请输入姓名" :show-clear="false" placeholder-align="right" :readonly="true" text-align="right"></x-input>

      <x-input v-model="formData.idNo" title="身份证" placeholder="请输入身份证" :show-clear="false" placeholder-align="right" :disabled="true" text-align="right"></x-input>

      <x-input v-model="formData.sexC" title="性别" placeholder="" :show-clear="false" placeholder-align="right" :disabled="true" text-align="right"></x-input>
<!--       <custom-selector v-model="formData.sex" describe="性别" :options="sexList" :isFirst="isFirst" ></custom-selector>
 -->
      <!--改造在vux 中的datetime组件，watch了required属性，在其改变值的时候，调用datetime校验-->
<!--       <datetime :required="!isFirst" class="address_cont" v-model="formData.birthday" title="出生日期" :max-year="new Date().getFullYear()" :min-year="1900" ref="dateTime"></datetime>
 -->
      <x-input v-model="formData.birthday" title="出生日期" placeholder="" :show-clear="false" placeholder-align="right" :disabled="true" text-align="right"></x-input>
 
      <custom-selector v-model="formData.nation" describe="民族" :options="nationList" :isFirst="isFirst"></custom-selector>

      <x-input v-model="formData.phoneNo" title="联系手机" placeholder="请输入联系手机号" :show-clear="true" placeholder-align="right" type="text" :max="11" text-align="right" :required="true" ref="phoneNo" :is-type="inputValid.cellPhone"></x-input>

      <p class="tips">请选择真实居住地址，虚假信息将会影响个人的信用积分。</p>

      <custom-selector class="no_before" v-model="formData.address" describe="现居住地区" :options="areaList" :isFirst="isFirst" :showLoading="showLoading" :disabled="true" @change="addressChange"></custom-selector>

      <selectorSearch v-model="formData.streetTownCode" describe="街镇" :options="streetTownList" :disabled="formData.address.length <= 1" :isFirst="isFirst" @scrollBottom="queryJzdmPage" @searchWord="queryJzdmPage" @change="streetTownChange" ref="streetTown" :showLoading="showLoading"></selectorSearch>

      <selectorSearch v-model="formData.streetAlleysCode" describe="街道巷" :options="streetAlleysList" :disabled="formData.streetTownCode.length <= 1" :isFirst="isFirst" @scrollBottom="queryJddmPage" @searchWord="queryJddmPage" @change="streetAlleysChange" ref="streetAlleys" :showLoading="showLoading"></selectorSearch>

      <selectorSearch v-model="formData.doorNumberCode" describe="门牌号" :options="doorNumberList" :disabled="formData.streetAlleysCode.length <= 1 || formData.streetTownCode.length <= 1" :isFirst="isFirst" @scrollBottom="queryFwxxzPage" @searchWord="queryFwxxzPage" @change="doorNumberChange" ref="doorNumber" :showLoading="showLoading"></selectorSearch>

      <selectorSearch v-model="formData.roomNumberCode" describe="详址/房号" :options="roomNumberList" @scrollBottom="queryFwxxfhPage"  @searchWord="queryFwxxfhPage" @change="roomNumberChange" :disabled="formData.doorNumberCode.length <= 1 || formData.streetAlleysCode.length <= 1 || formData.streetTownCode.length <= 1" :isFirst="isFirst" ref="roomNumber" :showLoading="showLoading"></selectorSearch>

    </div>


    <div v-transfer-dom>
      <confirm v-model="isShowConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">请您核实所填信息是否正确，确认无误后再提交！</p>
      </confirm>
    </div>

  </div>
</template>
<script>
  import {XInput, XButton, Group, Cell, Icon, Datetime, Confirm, TransferDomDirective as TransferDom, Value2nameFilter as value2name} from 'vux'
  import customSelector from '../common/customSelector.vue'
  import AMap from '../common/AMap.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import mixin from '../../mixins/mixin'
  import Step from '../common/Step.vue'
  import moment from 'moment'
  import api from '../../api/api'
  export default {
    name: 'step1',
    mixins: [mixin],
    components: {XInput,XButton, Group, Cell, Icon, Datetime, customSelector, Confirm,Step,SelectorSearch, AMap},
    directives: {
      TransferDom
    },
    data() {
      return {
        isShowConfirm: false,
        isReback: true,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        formData: { // 表单数据

          alipayAcount: this.$route.params.alipayAcount,
          userPic: '../../../static/images/house_m.jpg',// 照片
          zhimascore: '',
          recordstate: 1, // 登记状态
          name: '',// 姓名
          idNo: '', // 身份号
          phoneNo: '',  // 手机号
          sex: '',  // 性别
          sexC:'',   //性别中文
          birthday: '', // 生日
          nation:  '', // 民族
          address: '1',  //现居住行政区key,440115表示南沙区
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
          newAddress: '',
          areaName: '山东省淄博市张店区',
          locationAddress: '',   // 定位地址
//          mailingAddress: ''  // 快递地址
        },
        uploadData:{},
        areaList:[{
          key: '440115',
          value: '南沙区'
        }],
        streetTownList:[],
        streetAlleysList:[],
        doorNumberList:[],
        roomNumberList: [],
        showAddress: false,
        addAdressBtn: {
          text: '+ 新增地址',
          isOpen: false
        }
      }
    },
    filters: {
      hideMiddle(val) {
        return `${val.substr(0, 6)}********${val.substr(val.length - 4)}`
      }
    },
    methods: {
      amapChange (item, index) {
        if (index == 0) {
          this.formData.roomNumberName = item.address
        } else {
          this.formData.roomNumberName = item.address + item.name
        }
      },
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
        this.formData.addressName = '南沙区'
      },
      streetTownChange (key, name) {  // 选择街镇
        if (this.isReback) { // 数据回填
          this.queryJddmPage(this.formData.streetAlleysName)  // 查询街道巷
          console.log('街镇',this.formData.streetTownName)
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
          console.log('街道巷',this.formData.streetAlleysName)
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
          console.log('门牌号', this.formData.doorNumberName)
        } else {
          this.formData.roomNumberCode = ''
          this.roomNumberList = []
          this.queryFwxxfhPage()  // 查询房号
        }
        this.formData.doorNumberName = name
      },
      newDoorNumberChange (val) { // 手动新增门牌号
        if (val) {
          this.formData.newDoorNumberName = val
          this.formData.doorNumberCode = -1
          this.formData.roomNumberCode = -1
        }
      },
      roomNumberChange (key, name) {  // 选择房号
        this.isReback = false  // 数据回填结束
        this.formData.roomNumberName = name
        console.log('选择房号', this.formData.roomNumberName)
      },
      newRoomNumberChange (val) { // 手动新增房号
        if (val) {
          this.formData.newRoomNumberName = val
          this.formData.roomNumberCode = -1
        }
      },
      newAddressChange (val) { // 新地址chenge事件
        if (val) {
          this.formData.streetAlleysCode = -1
          this.formData.doorNumberCode =  -1
          this.formData.roomNumberCode =  -1
        }
      },
      deleNewAddress () { // 删除新地址
        this.formData.newAddress = ''
      },
      imageuploaded(res) {
        if (res.errcode == 0) {
          this.src = res.data.src;
        }
      },
      goNext(){  // 下一步按钮
        this.isFirst = false
        this.$refs.phoneNo.validate();
        const validate = this.validate();

        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          this.isShowConfirm = !this.isShowConfirm
        }
      },
      onConfirm () {  // 确认
        this.$store.commit('UPDATE_LOADING', true);
        api.saveResideInfo({
          formData: this.formData,
          homeType: 'lsns_'  // 南沙区域标记
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            const query = {
              serviceType: this.$route.query.serviceType,
              comGuid: this.$route.params.comGuid,
              openid:this.$route.params.alipayAcount,
              zhimascore:this.formData.zhimascore
            }
            this.$router.push({path:'/step2/' + this.formData.idNo, query});
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
          errorMsg = '请选择街镇！'
        } else if (!this.formData.streetAlleysCode || this.formData.streetAlleysCode == '3') { // 街道巷
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
      peopleDetails () {  // 扫脸回填接口
        this.$store.commit('UPDATE_LOADING', true);
        api.peopleDetails(this.$route.params.comGuid).then(res => {
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
            }else{
              _sex =  _idcard.charAt(_idcard.length-1)
              if(_sex % 2 ==0){
                this.formData.sex  = 2
                this.formData.sexC = '女'
              } 
              else{
                this.formData.sex  = 1
                this.formData.sexC = '男'                
              }
            }
           // localStorage.setItem("user_sex",this.formData.sex);
            this.$Utils.setLocalStorage('USER-SEX', this.formData.sex);
            this.formData.userPic = data.pic;
            this.formData.name = data.realname ? data.realname : '';
            //this.$Utils.setLocalStorage('USER-NAME', this.formData.name);
            this.formData.idNo = data.idcard ? data.idcard : '';
            this.formData.zhimascore = data.zhimascore ? data.zhimascore : '';
            this.$emit('UPDATE_ID_NO', this.formData.idNo)
            //this.formData.sex = data.sex ? data.sex : '';
            this.formData.birthday = moment(data.birthday).format("YYYY-MM-DD");
            this.formData.nation = data.nation ? data.nation : ''; // 民族
            this.formData.phoneNo = data.linkphone ? data.linkphone : '';
            this.$store.commit('UPDATE_ID_NO',data.idcard);  // 保存用户的身份证号，在居住证办理时会用到
            this.formData.address = '440115'
            this.formData.addressName = '南沙区'
            if (this.formData.address == attributes.address) {  // 如果用户数据是南沙区的才会回填
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
          openid: this.$route.params.alipayAcount,
          wxsqn: this.$route.params.alipayAcount,
          account: this.formData.idNo,
          xzq: this.formData.address,
          itemName: keyWord ? keyWord : '',
          currentPage: currentPage ? currentPage : 1
        }).then((res) => {
          const data = JSON.parse(res.data.jsonRes[0]);
//          this.$store.commit('UPDATE_LOAD_MORE', false);
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
          openid: this.$route.params.alipayAcount,
          wxsqn: this.$route.params.alipayAcount,
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
          openid: this.$route.params.alipayAcount,
          wxsqn: this.$route.params.alipayAcount,
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
          openid: this.$route.params.alipayAcount,
          wxsqn: this.$route.params.alipayAcount,
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
      }
    },
    created () {
      this.peopleDetails();
    }
  }
</script>
<style lang="less" scoped>
  .form_cont{position: relative;width:100%;overflow: hidden;}
  .user_pic{width:auto;height:1.2rem;}
  .go_prev_btn{width:1rem;height:48px;line-height:48px;position: absolute;top:0;left:.3rem;color:#fff;text-indent: -99999px;}
  .go_next_btn{width:1rem;height:1rem;line-height:1rem;position: absolute;top:0;right:.3rem;color:#fff;}
  .tips {
    width:100%;padding:7px 15px;overflow:hidden;line-height: .45rem;font-size:.26rem;box-sizing:border-box;position: relative;color:red;background: #EEEEEE;
    &:after{content:'';display:block;width:100%;height:1px;border-top: 1px solid #D9D9D9;transform: scaleY(0.5);position: absolute;top:0;left:15px;}
    &:before{content: '提示：';color: #333;float: left;display: block;height:.6rem;}
    span{color:#333;display: inline-block;height:1rem;float: right;}
  }

</style>

