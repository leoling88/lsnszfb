<template>
    <div class="template_container">
      <scroller ref="scroller" lock-x>
        <div style="overflow: hidden;" class="step2Detailed">
          <step step="2" stepText1="基础信息" stepText2="详情信息" stepText3="信息确认"></step>
          <div class="form_cont">
            <div @click="goNext" v-if="nextBut">下一步（支付宝）</div>{{isReback}}
            <cell title="户籍地址" :value="formData.hjAddressDetail"></cell>
            <custom-selector v-model="formData.addressType" describe="户口类型" :options="adresasTypeList" :isLink="false" :disabled="true"></custom-selector>
            <custom-selector v-model="formData.polity" describe="政治面貌" :options="polityList" :isLink="false" :disabled="true"></custom-selector>
            <custom-selector v-model="formData.culture" describe="文化程度" :options="cultureList" :isLink="false" :disabled="true"></custom-selector>
            <custom-selector v-model="formData.marry" describe="婚姻状况" :options="marryList" :isLink="false" :disabled="true"></custom-selector>
            <div v-if="formData.marry == 2" class="is_married">
              <cell title="配偶姓名" :value="formData.spouseName"></cell>
              <cell title="配偶身份证号" :value="formData.spouseIdNo"></cell>
            </div>

            <!--居住-->
            <group title="居住信息" class="group_cont">
              <custom-selector class="no_before" v-model="formData.liveType" describe="居住方式" :options="liveTypeList" :isLink="false" :disabled="true"></custom-selector>
              <custom-selector v-model="formData.reson" describe="居住事由" :options="resonList" :isLink="false" :disabled="true"></custom-selector>
              <custom-selector v-model="formData.houseType" describe="房屋类型" :options="houseTypeList" :isLink="false" :disabled="true"></custom-selector>
              <custom-selector v-model="formData.lessee" describe="是否承租人" :options="lesseeList" :isLink="false" :disabled="true"></custom-selector>
              <cell title="来本市日期" :value="formData.comeDate"></cell>
            </group>

            <!--就业情况-->
            <group title="就业信息" class="group_cont"></group>
            <custom-selector class="no_before" v-model="formData.hasJob" describe="就业情况" :options="hasJobOptions"  :isLink="false" :disabled="true"></custom-selector>
            <div class="is_married" v-if="formData.hasJob == 1">
              <custom-selector v-model="formData.occupation" describe="职业" :options="occupationList" :isLink="false" :disabled="true"></custom-selector>
              <template v-if="isShowUnit">
                <cell title="单位名称" :value="formData.workCompany"></cell>
                <cell  v-show="formData.unitAdress" title="单位地址" :value="formData.unitAdress"></cell>
                <cell v-show="formData.unitNumber" title="企业编号" :value="formData.unitNumber"></cell>
                <cell v-show="formData.unitPhone" title="单位电话" :value="formData.unitPhone"></cell>
              </template>
            </div>

            <!--子女-->
            <group title="子女信息" class="group_cont" v-show="formData.liveType == '04' && formData.children.length > 0">
              <template v-for="(item,index) in formData.children">
                <div class="child_title">第{{index + 1}}个孩子</div>
                <cell title="姓名" :value="formData.children[index].childName"></cell>
                <custom-selector v-model="formData.children[index].sex" describe="性别" :options="sexList" :isLink="false" :disabled="true"></custom-selector>
                <custom-selector v-model="formData.children[index].relation" describe="关系" :options="relationList" :isLink="false" :disabled="true"></custom-selector>
                <cell v-show="formData.children[index].birthdayDate" class="address_cont" v-model="formData.children[index].birthdayDate" title="出生日期" :readonly="true"></cell>
                <cell v-show="formData.children[index].childIdNo" title="身份证号" :value="formData.children[index].childIdNo"></cell>
              </template>
            </group>
          </div>
        </div>
      </scroller>

    </div>
</template>
<script>
    import {Scroller, XInput, Group, Datetime, ChinaAddressV4Data, Confirm,TransferDomDirective as TransferDom, Value2nameFilter as value2name,Search, Icon, Cell } from 'vux'
    import customSelector from '../common/customSelector.vue'
    import SelectorSearch from '../common/SelectorSearch.vue'
    import Step from '../common/Step.vue'
    import api from '../../api/api'
    import { mapState } from 'vuex'
    export default {
      name: 'step2Detailed',
      components: {Scroller, Group, XInput, Datetime, ChinaAddressV4Data, customSelector, Confirm, Step, SelectorSearch, Search, Icon, Cell},
      directives: {
        TransferDom
      },
      data() {
          return {
            nextBut: true,     //显示下一步按钮
            serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1,  // 业务类型，1,为登记，2，为居住证第一次办理， 3：为居住证续签
            Confirm: {
              isShowConfirm: false,
              confirmText: '确定要删除当前子女的信息吗?',
              state: false // true 为提交表单
            },
            isShowUnit: true, // 是否显示单位信息
            isFirst: true, // 是否是第一次选择或输入
            showLoading: true, // 是否加载中
            deleIndex: '',
            delType: 2, // 删除子女信息参数，1，为全部删，2，为单个删，默认
            uuid: '',
            childUuid: '',
            comGuid: this.$route.query.comGuid,
            openid: this.$route.query.openid,
            formData: { // 表单数据
              homeType: 'lsns_',  // 南沙区域标记
              zhimascore: this.$route.query.zhimascore,
              idNo:this.$route.params.idNo,
              culture: '',// 文化程度
              polity: '',// 政治面貌
              addressType: '',// 户口所在地类型
//              hjaddress: '',// 户籍地区
              hjAddressDetail:'',// 户籍详细地址
              occupation:'',// 职业
              workCompany:'',// 单位名称
              unitAdress: '',// 单位地址
              unitNumber: '',// 单位编号
              unitPhone: '', // 单位电话
              marry: '',// 婚姻状况
              spouseName:'',//配偶姓名
              spouseIdNo:'',//配偶身份证号
              comeDate: '', //来本市日期
              hasJob: '',// 就业情况
              houseType: '', // 房屋类型
              lessee: '', // 是否承租人
              liveType: '', // 居住方式
              reson: '',// 居住事由
              children: [] // 子女
            },
            cultureList:[],
            polityList:[],
            adresasTypeList:[],
            marryList:[],
            lesseeList:[],
            liveTypeList:[],
            houseTypeList:[],
            resonList:[],
            occupationList:[], // 职业
            UnitList: [], // 单位
            showAddress: false,
            addressData:ChinaAddressV4Data,
            hasJobOptions: [],
            sexList:[],
            relationList:[]
          }
      },
      computed: {
        ...mapState([
          'wxsqm','wxsqn'
        ]),
        unitFlag: function () {  // 是否就业并且职业代码不是36,37,39,42,51
          return this.isShowUnit && this.formData.hasJob
        }
      },
      watch: {
        formData: {
          handler: function (val) {  // 职业代码为(36,37,39,42,51)其中任意一项时单位信息不显示
            if (val.occupation == 36 || val.occupation == 37 || val.occupation == 39 || val.occupation == 42 || val.occupation == 51) {
              this.isShowUnit = false
            } else {
              this.isShowUnit = true
            }
          },
          deep: true
        }
      },
      methods: {
        goNext () {
          const query = {
            serviceType: this.serviceType,
            comGuid:this.comGuid,
            openid:this.openid,
            zhimascore: this.formData.zhimascore
          }
          // this.$router.push({path:`/step3/${this.formData.idNo}`, query});    20180814 by leoLig
          this.$router.push({path:'/step3/' + this.formData.idNo});

        },
        getDictionary () { // 获取所有的字典
          api.queryDictionaryList().then(res => {
            if(res.data.success) {
              const data = res.data.obj;
              this.laisuiFilerData(data.HKXZ, this.adresasTypeList);//户口类型
              this.laisuiFilerData(data.ZZMM, this.polityList);//政治面貌
              this.laisuiFilerData(data.WHCD, this.cultureList);//文化程度
              this.laisuiFilerData(data.HYZK, this.marryList);//婚姻状况
              this.laisuiFilerData(data.JZFS, this.liveTypeList);//居住方式
              this.laisuiFilerData(data.ZZSY, this.resonList);//居住事由
              this.laisuiFilerData(data.ZZDXZ, this.houseTypeList);//房屋类型
              this.laisuiFilerData(data.SF, this.lesseeList);//是否承租人
              this.laisuiFilerData(data.JZY, this.occupationList);//职业
              this.laisuiFilerData(data.XB, this.sexList);//性别
            }
          });

          api.getEmploymentStatus().then(res => { // 就业情况
            if(res.data.success) {
              const data = res.data.obj;
              this.filerData(data, this.hasJobOptions);
            }
          });

          api.getRelation().then(res => { // 与填表人关系
            if(res.data.success) {
              const data = res.data.obj;
              this.filerData(data, this.relationList);
            }
          });
        },
        filerData(srcData, toData){ // 筛选数据字典
          if(srcData instanceof Array && toData instanceof Array){
            srcData.forEach(irem => {
              toData.push({
                value: irem.description,
                key: irem.subtype
              })
            });
          }
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
        getPeopleInfo () {
          api.rebackPeopleInfo(this.formData.idNo).then((res) => {
            const data = res.data.jsonRes[0]
            if(res.data.success){
              this.uuid = data.uuid // 用户标识
              this.formData.culture = data.culture // 文化程度
              this.formData.polity = data.polity   // 政治面貌
              this.formData.addressType = data.addressType    // 户口所在地类型
//              this.formData.hjaddress = value2name(data.hjaddress, ChinaAddressV4Data).toString()   // 户籍地区
              this.formData.hjAddressDetail = data.hjAddressDetail    // 户籍详细地址
              this.formData.occupation = data.occupation  // 职业
              this.formData.unitNumber = data.unitNumber // 企业编号
              this.formData.unitAdress = data.unitAdress // 企业地址
              this.formData.workCompany = data.workCompany ? data.workCompany.split(',')[0]: '' // 单位名称
              this.UnitList = data.workCompany ? [{key:data.workCompany, value: data.workCompany}] : []
              this.formData.unitPhone = data.unitPhone    // 单位电话
              this.formData.marry = data.marry    // 婚姻状况
              this.formData.spouseName = data.spouseName  //配偶姓名
              this.formData.spouseIdNo = data.spouseIdNo   //配偶身份证号
              this.formData.comeDate = data.comeDate//来本市日期
              this.formData.hasJob = data.hasJob// 就业情况
              this.formData.lessee = data.lessee   // 是否承租人
              this.formData.liveType = data.liveType    // 居住方式
              this.formData.reson = data.reson    // 居住事由
              this.formData.houseType = data.houseType    // 居住事由
              this.formData.children = data.children// 子女
              this.$refs.scroller.reset()
            }
          })
        }
      },
      mounted(){
        if (window.AlipayJSBridge) this.nextBut = false
        if (this.serviceType == 1) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住信息登记'});
        } else {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证办理'});
        }
        this.getDictionary();
        this.getPeopleInfo();
        document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
      },
      destroyed () {
        document.removeEventListener('optionMenu', this.goNext, false) // 删除支付宝右上角点击事件
      }
    }
</script>
<style lang="less">
  .form_cont{width:100%;overflow: hidden;}
  .go_next_btn{width:1rem;height:1rem;line-height:1rem;position: absolute;top:0;right:.3rem;color:#fff;}
  .group_cont{width:100%;overflow: hidden;
    .weui-cells__title{background: #eee;height:1rem;line-height:1.2rem;margin:0;}
  }

  .has_before{
    position: relative;
    &:before{content: " "; width:100%;position: absolute;height: 1px;border-top: 1px solid #D9D9D9;border-top: 1px solid #D9D9D9;  color: #D9D9D9;left: 15px;display: block;transform: scaleY(0.5);position: absolute;bottom:0;}
  }
  .is_married{overflow: hidden;width:100%;/*height:1.97rem;*/position: relative;transition: all 1s ease;
    &:before{content: " "; width:100%;position: absolute;height: 1px;color: #D9D9D9;left: 15px;display: block;transform: scaleY(0.5);}
  }
  .add_childen_btn{width:5.8rem;height:.88rem;background:#0091FF;margin:.5rem auto;height:.88rem;line-height: .88rem;text-align: center;color:#fff;border-radius: 0.08rem;}
  .child_title{height:1.1rem;line-height: 1.2rem;text-indent:15px;padding-right:.4rem;border-top:1px dashed #D9D9D9;color:#1f67d0;}
  .child_title:first-of-type{border:none;}
  .child_del_btn{float: right;margin-top:.3rem;}
  .step2Detailed .weui-cell__ft{flex: 3;}
</style>
<style>
  .dweiName .vux-cell-primary{width:28% !important;flex:inherit;}
  .dweiName .weui-cell__ft{width:78% !important;flex:inherit;word-break:break-all;}
</style>
