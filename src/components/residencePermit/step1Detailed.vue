<template>
  <div class="template_container">
    <scroller ref="my_scroller" lock-x>
      <div style="overflow: hidden;">
        <step step="1" stepText1="基础信息" stepText2="详情信息" stepText3="信息确认"></step>
        <div class="form_cont">
          <div @click="goNext" v-if="nextBut">下一步（支付宝）</div>{{isReback}}
          <!--<cell title="人员照片" ><img class="user_pic" :src="formData.userPic"></cell>-->

          <x-input v-model="formData.name" title="姓名" placeholder="请输入姓名" :show-clear="false" placeholder-align="right" :readonly="true" text-align="right"></x-input>
          <cell title="身份证" >{{formData.idNo}}</cell>
          <cell title="性别">{{formData.sex}}</cell>
<!--           <custom-selector v-model="formData.sex" describe="性别" :options="sexList" :isLink="false" :disabled="true"></custom-selector> -->

          <x-input v-model="formData.birthday" title="出生日期" placeholder-align="right" type="text" :max="11" text-align="right" :readonly="true" :show-clear="false"></x-input>

          <custom-selector v-model="formData.nation" describe="民族" :options="nationList" :isLink="false" :disabled="true"></custom-selector>

          <x-input v-model="formData.phoneNo" title="联系手机" placeholder="请输入联系手机号" placeholder-align="right" type="text" :max="11" text-align="right" :readonly="true" :show-clear="false"></x-input>

          <cell title="现居住地区" :value="formData.addressName"></cell>
          <cell title="街镇" :value="formData.streetTownName"></cell>
          <cell title="街道巷" :value="formData.streetAlleysName"></cell>
          <cell title="门牌号" :value="formData.doorNumberName"></cell>
          <cell title="详址/房号" :value="formData.roomNumberName"></cell>
        </div>
      </div>
    </scroller>

  </div>
</template>
<script>
  import {Scroller, XInput,Group, Cell, Icon, Datetime, Confirm, TransferDomDirective as TransferDom, Value2nameFilter as value2name} from 'vux'
  import customSelector from '../common/customSelector.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import Step from '../common/Step.vue'
  import moment from 'moment'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step1Detailed',
    components: {Scroller, XInput,Group, Cell, Icon, Datetime, customSelector, Confirm,Step,SelectorSearch},
    directives: {
      TransferDom
    },
    data() {
      return {
        nextBut: true,     //显示下一步按钮
        serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1,  // 业务类型，1,为登记，2，为居住证第一次办理， 3：为居住证续签
        isShowConfirm: false,
        isReback: false,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        showLoading: true,
        readonly: true,
        comGuid:this.$route.params.comGuid,
        maxYear: new Date().getFullYear(),
        idCard: this.$route.params.idCard,
        homeType: this.$route.params.homeType,     //地区

        formData: { // 表单数据
          alipayAcount: this.$route.params.alipayAcount,  // 即openid
          zhimascore: '',
          userPic: '',// 照片
          name: '',// 姓名
          idNo: '', // 身份号
          phoneNo: '',  // 手机号
          sex: '',  // 性别
          birthday: '', // 生日
          nation:  '', // 民族
          address: '',  //现居住行政区key
          addressName: '',
          streetTownCode: '', // 街镇key
          streetTownName: '',
          streetAlleysCode: '',  //街道巷key
          streetAlleysName: '',
          doorNumberCode: '',  // 门牌号key
          doorNumberName: '',
          roomNumberCode: '', //地详细地址/房号key
          roomNumberName: ''
        },
        uploadData:{},
        sexList:[],
        nationList:[],
        areaList:[],
        streetTownList:[],
        streetAlleysList:[],
        doorNumberList:[],
        roomNumberList: [],
        showAddress: false
      }
    },
    computed: {
      ...mapState([
        'openid','wxsqm','wxsqn'
      ])
    },
    filters: {
      hideMiddle(val) {
        return `${val.substr(0, 6)}********${val.substr(val.length - 4)}`
      }
    },
    methods: {
      imageuploaded(res) {
        if (res.errcode == 0) {
          this.src = res.data.src;
        }
      },
      goNext(){  // 下一步按钮
        const query = {
          serviceType: this.serviceType,
          comGuid: this.$route.params.comGuid,
          openid:this.$route.params.alipayAcount,
          zhimascore:this.formData.zhimascore
        }
        this.$router.push({path:'/step2Detailed/' + this.formData.idNo, query});
      },
      getDictionary(){ // 获取所有的字典
        api.queryDictionaryList().then(res => {
          if(res.data.success) {
            const data = res.data.obj;
            this.laisuiFilerData(data.XB, this.sexList);
            this.laisuiFilerData(data.MZ, this.nationList);
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
      getAlipayInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.getPeopleDetailsMS({idCard:this.idCard,homeType:this.homeType}).then(res => {
        // api.getUserDetails(this.comGuid).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const attributes = res.data.attributes
          const data = res.data.obj
          if(res.data.success && attributes){

            this.formData.userPic = data.pic;
            this.formData.name = data.realname ? data.realname : '';
            this.formData.idNo = data.idcard ? data.idcard : '';

            let _idcard = data.idcard
            let _sex
            if(_idcard.length > 15){
              _sex = _idcard.charAt(_idcard.length - 2)
              if(_sex % 2 ==0) this.formData.sex = '女'
              else  this.formData.sex = '男'
                console.log("1")
            }else{
              _sex =  _idcard.charAt(_idcard.length-1)
               console.log("2")
              if(_sex % 2 ==0) this.formData.sex = '女'
              else  this.formData.sex ='男'
            }
            this.formData.zhimascore = data.zhimascore;
            this.$emit('UPDATE_ID_NO', this.formData.idNo)
            this.formData.birthday = moment(data.birthday).format("YYYY-MM-DD");
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
            }
          }
        }).catch((res) => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      getName (value) {  // 将省市区编码转中文
        return value2name(value, ChinaAddressV4Data).split(' ')
      }
    },
    created () {
      if (window.AlipayJSBridge) {
        AlipayJSBridge.call('setOptionMenu', {
          title : '下一步',
          redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
          color : '#2a333c', // 必须以＃开始ARGB颜色值
        });
        AlipayJSBridge.call('showOptionMenu');
        this.nextBut = false;
      }
    },
    mounted () {
      if (this.serviceType == 1) {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住信息登记'});
      } else {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证办理'});
      }
      this.$store.commit('UPDATE_COMGUID',this.comGuid);
      this.$store.commit('UPDATE_ALIPAY_ACOUNT',this.formData.alipayAcount);
      this.getAlipayInfo();
      this.getDictionary();
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

