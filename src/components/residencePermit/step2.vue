<template>
  <div class="template_container">
    <step step="2" stepText1="基础信息" stepText2="详情信息" stepText3="信息确认"></step>
    <div class="form_cont">
      <div @click="goNext" v-if="nextBut">下一步（支付宝）</div>{{isReback}}
      <x-address class="hjaddress" title="户籍地区" v-model="formData.hjaddress" :list="addressData" placeholder="请选择省市区"></x-address>
      <x-input v-model="formData.hjAddressDetail" title="户籍详址" placeholder="请填写户籍详情地址" :show-clear="true" placeholder-align="right" text-align="right" :required="true" ref="hjAddressDetail" :readonly="!!formData.addressBackUp" @click.native="mainOptChange"></x-input>
      <custom-selector v-model="formData.addressType" describe="户口类型" :options="adresasTypeList"  :isFirst="isFirst"></custom-selector>
      <custom-selector v-model="formData.polity" describe="政治面貌" :options="polityList" :isFirst="isFirst"></custom-selector>
      <custom-selector v-model="formData.culture" describe="文化程度" :options="cultureList" :isFirst="isFirst"></custom-selector>
      <custom-selector v-model="formData.marry" describe="婚姻状况" :options="marryList" :isFirst="isFirst"></custom-selector>
      <div v-if="formData.marry == 2" class="is_married">
        <x-input type="text" v-model="formData.spouseIdNo" title="配偶身份证号" placeholder="请填写配偶身份证号" :show-clear="true" placeholder-align="right" text-align="right" :max="18" :required="true" ref="spouseIdNo" :is-type="inputValid.spouseIdNo" onkeyup="this.value=this.value.toUpperCase()" ></x-input>
        <x-input v-model="formData.spouseName" title="配偶姓名" placeholder="请填写配偶姓名" :show-clear="true" placeholder-align="right" text-align="right" :required="true" ref="spouseName" :is-type="inputValid.spouseName"></x-input>
      </div>

      <!--居住-->
      <group title="居住信息" class="group_cont">
        <custom-selector class="no_before" v-model="formData.liveType" describe="居住方式" :options="liveTypeList" :isFirst="isFirst"></custom-selector>
        <custom-selector v-model="formData.reson" describe="居住事由" :options="resonList" :isFirst="isFirst" ></custom-selector>
        <custom-selector v-model="formData.houseType" describe="房屋类型" :options="houseTypeList" @change="liveTypeChange" :isFirst="isFirst"></custom-selector>
        <custom-selector v-model="formData.lessee" describe="是否承租人" :options="lesseeList" :isFirst="isFirst"></custom-selector>
        <datetime class="address_cont" v-model="formData.comeDate" title="来本市日期" :min-year=1900 :max-year="maxYear" :required="!isFirst"></datetime>
      </group>

      <!--就业情况-->
      <group title="就业信息" class="group_cont"></group>
      <custom-selector class="no_before" v-model="formData.hasJob" describe="就业情况" :options="hasJobOptions" :isFirst="isFirst" ></custom-selector>
      <div class="is_married" v-if="formData.hasJob == 1">

        <custom-selector v-model="formData.occupation" describe="职业" :options="occupationList" :isFirst="isFirst" @change="occupationChange"></custom-selector>

        <template v-if="isShowUnit">
          <selectorSearch v-model="formData.workCompany" describe="单位名称" :options="UnitList" :disabled="formData.occupation == ''" :isFirst="isFirst" @scrollBottom="queryDwxxPage" @searchWord="queryDwxxPage" @change="unitChange" ref="workCompany" :showLoading="showLoading" @entryValChange="entryValChange"></selectorSearch>

          <x-input v-model.trim="formData.unitAdress" title="单位地址" placeholder="请输入单位地址" placeholder-align="right" text-align="right" :readonly="formData.workCompany != -1" :isFirst="isFirst" :required="false" ref="unitAdress"></x-input>
          <x-input v-model.trim="formData.unitNumber" title="企业编号" placeholder="请输入企业编号" placeholder-align="right" text-align="right" :readonly="formData.workCompany != -1" :isFirst="isFirst" :required="true" ref="unitNumber"></x-input>
          <x-input v-model.trim="formData.unitPhone" title="单位电话" placeholder="请输入单位电话" placeholder-align="right" text-align="right" :isFirst="isFirst" :required="false" ref="unitPhone" :max="12"></x-input>

        </template>
      </div>

      <!--子女-->
      <div class="btn-switch" v-show="formData.liveType == '04'" :class="{'on':isSwitch}" @click="clickSwitch"><i></i></div>
      <group title="是否有子女信息" class="group_cont" v-show="formData.liveType == '04'">
        <div  v-show="isSwitch">
          <template v-for="(item,index) in formData.children" >
            <div class="child_title">第{{index + 1}}个孩子<icon class="child_del_btn" type="cancel" @click.native="deleChild(index, item.uuid)"></icon></div>
            <x-input v-model="formData.children[index].childName" title="姓名" placeholder="请填写子女姓名" :show-clear="true" placeholder-align="right" text-align="right" :max="15" :required="true" :ref="`childName${index}`" :is-type="inputValid.spouseName"></x-input>
            <custom-selector v-model="formData.children[index].sex" describe="性别" :options="sexList" :isFirst="true" @change="cSexSelce(index)"></custom-selector>
  <!--           <custom-selector v-model="formData.children[index].relation" describe="关系" :options="relationList" :isFirst="true"></custom-selector> -->

            <x-input v-model="formData.children[index].GX" title="关系" placeholder="" :show-clear="false" placeholder-align="right" :disabled="true" text-align="right"><input v-model="formData.children[index].relation" type="hidden"></input></x-input>

            <datetime class="address_cont" v-model="formData.children[index].birthdayDate" title="出生日期" :min-year=1900 :max-year="maxYear"></datetime>
            <x-input v-model="formData.children[index].childIdNo" title="身份证号" placeholder="请输入身份证" :show-clear="true" placeholder-align="right" type="number" :min="15" :max="18" text-align="right"></x-input>
          </template>
          <div class="add_childen_btn" @click="addChild">+ 添加子女</div>
        </div>

      </group>
    </div>

    <div v-transfer-dom>
      <confirm v-model="Confirm.isShowConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">{{Confirm.confirmText}}</p>
      </confirm>
    </div>

    <div v-transfer-dom>
      <alert v-model="Alert.state" title="操作提示" @on-hide="gonNextStep(Alert.type)">{{Alert.text}}</alert>
    </div>

  </div>
</template>
<script>
  import {XInput, Group, Datetime,XAddress, ChinaAddressV4Data, Confirm,TransferDomDirective as TransferDom, Value2nameFilter as value2name,Search, Icon, Alert } from 'vux'
  import customSelector from '../common/customSelector.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  import Scroller from "../../../node_modules/vux/src/components/scroller/index";
  export default {
    name: 'step2',
    components: {Scroller, Group, XInput, Datetime, XAddress, ChinaAddressV4Data,customSelector, Confirm, Step, SelectorSearch, Search, Icon, Alert},
    directives: {TransferDom},
    data() {
      return {
        nextBut: true,     //显示下一步按钮
        serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1,  // 业务类型，1,为登记，2，为居住证
        isShowUnit: true, // 是否显示单位信息
        isFirst: true, // 是否是第一次选择或输入
        isReback: false,  // 数据是否回填，主要为了解决数据回填时阻止触发事件
        showLoading: true, // 是否加载中
        deleIndex: '',
        delType: 2, // 删除子女信息参数，1，为全部删，2，为单个删，默认
        uuid: '',
        childUuid: '',
        comGuid: this.$route.query.comGuid,
        openid: this.$route.params.idCard,// this.$route.query.openid,
        formDataBackup: {},  // 用户数据副本，用于比较用户数据是否变更
        formData: { // 表单数据
          homeType: 'lspy_',  // 南沙区域标记
          jhid: '',  // 交易编号
          zhimascore: this.$route.query.zhimascore,
          recordstate: 2, // 登记状态
          idNo: this.$route.params.idCard,
          culture: '',// 文化程度
          polity: '',// 政治面貌
          addressType: '',// 户口所在地类型
          addressBackUp: '',// 户籍详细地址副本
          hjaddress: [],
          hjAddressDetail:'',// 户籍详细地址
          occupation:'-1',// 职业
          workCompany:'',// 单位名称
          newWorkCompany: '',  // 手动输入单位名称
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
        relationList:[],
        maxYear: new Date().getFullYear(), // 最大年份
        addCompanyBtn: {
          text: '+ 新增公司',
          isOpen: false
        },
        Confirm: {
          isShowConfirm: false,
          confirmText: '确定要删除当前子女的信息吗?',
          state: false // true 为提交表单
        },
        isSwitch: false,  //子女信息开关样式
        Alert: {
          state: false,
          type: 1,
          text: '请您到辖区来穗机构服务窗口进行主项信息变更 ！'
        },
        isMainOptChange: false,
        inputValid: {
          spouseName: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.name.test(val),
              msg: '姓名不合法！'
            }
          },
          spouseIdNo: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.cardID.test(val),
              msg: '身份证号不合法！'
            }
          },
          unitPhone: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.fixedPhone.test(val),
              msg: '单位联系号码不合法！'
            }
          },
        }
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
      cSexSelce (index) {
        let _childSex = this.formData.children[index].sex
        let _parentSex = localStorage.getItem("USER_SEX")
        let _GX = this.relationList;
          if(_parentSex == 1){
            if (_childSex == 1){
              this.formData.children[index].GX = _GX[0].value;
              this.formData.children[index].relation = _GX[0].key
            }else if (_childSex == 2) {
              this.formData.children[index].GX = _GX[2].value;
              this.formData.children[index].relation = _GX[2].key
            }
          }else if(_parentSex == 2){
            if (_childSex == 1){
              this.formData.children[index].GX = _GX[1].value;
              this.formData.children[index].relation = _GX[1].key
            }else if (_childSex == 2){
              this.formData.children[index].GX = _GX[3].value;
              this.formData.children[index].relation = _GX[3].key
            }


          }

      },
      clickSwitch () {
        if(this.formData.children.length > 0) {
            let valid = false
            let errorMsg = '请先删除子女信息后再关闭'
            this.$store.commit('SHOWTOAST', errorMsg);

        }else{
          if (this.isSwitch) {
            this.isSwitch = false
          }
          else this.isSwitch = true          
        }

      },
      goNext () {
        const validate = this.validate()
        const validateChild = this.validateChild()
        this.checkAllInput()
        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else if(this.formData.liveType == '04' && this.isSwitch && !validateChild.valid ) {  // 校检子女信息
          this.$store.commit('SHOWTOAST', validateChild.errorMsg);
        } else {
          if (this.hasChange()) {  // 用户信息有变更
            this.Confirm.state = true
            this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
            this.Confirm.confirmText = '确认并核对系统登记信息内容无误？'
          } else {
            this.Alert.state = true
            this.Alert.type = 2
            this.Alert.text = '您居住登记信息已登记在系统内，您已完成本次居住信息登记！'
          }
        }
      },
      liveTypeChange (val) {  // 居住方式切换
        if (val == 2 && this.formData.children.length == 0) {
          this.formData.children.push({
            childName:'',  // 子女姓名
            sex: '',  // 子女性别
            relation: '',  // 与填表人关系
            birthdayDate: '',  // 出生日期
            childIdNo:'',  // 子女身份证号
          });
        }
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';
        if (this.formData.hjaddress.length < 3 || this.formData.hjaddress.indexOf('') != -1) { // 户籍地区
          errorMsg = '请选择户籍地区！'
        } else if (!this.formData.hjAddressDetail) { // 户籍详细地址
          errorMsg = '请填写户籍详细地址！'
        } else if (!this.formData.addressType) { // 户口类型！
          errorMsg = '请选择户口类型！'
        } else if (!this.formData.polity) { // 政治面貌
          errorMsg = '请选择政治面貌！'
        } else if (!this.formData.culture) { // 文化程度
          errorMsg = '请选择文化程度！'
        } else if (!this.formData.marry) { // 婚姻状况
          errorMsg = '请选择婚姻状况！'
        } else if (this.formData.marry == 2 && !this.formData.spouseName) { // 配偶姓名
          errorMsg = '请输入配偶的姓名！'
        }  else if (this.formData.marry == 2 && !this.$regExp.name.test(this.formData.spouseName)) { // 配偶姓名是否合法
          errorMsg = '配偶的姓名不合法！'
        } else if (this.formData.marry == 2 && !this.formData.spouseIdNo) { // 配偶身份证
          errorMsg = '请输入配偶的身份证！'
        } else if (this.formData.marry == 2 && !this.$regExp.cardID.test(this.formData.spouseIdNo)) { // 配偶身份证是否合法
          errorMsg = '配偶的身份证不合法！'
        } else if (!this.formData.liveType) { // 居住方式
          errorMsg = '请选择居住方式！'
        } else if (!this.formData.reson) { // 居住事由
          errorMsg = '请选择居住事由！'
        } else if (!this.formData.lessee) { // 是否承租人
          errorMsg = '请选择是否承租人！'
        } else if (!this.formData.comeDate) { // 来本市日期
          errorMsg = '请选择来本市日期！'
        } else if (!this.formData.hasJob) { // 就业情况
          errorMsg = '请选择就业情况！'
        } else if (this.formData.hasJob == 1 && !this.formData.occupation) { // 职业
          errorMsg = '请选择您的职业！'
        } else if (this.formData.hasJob == 1 && (!this.formData.workCompany || (!this.formData.workCompany == -1 && !this.formData.newWorkCompany))) { // 单位名称
          errorMsg = '请选择单位名称！'
        } else if (this.formData.hasJob == 1 && (!this.formData.unitNumber )) { // 单位编辑号
          errorMsg = '企业编号为空，请重新选择单位名称进行获取！'
        } else {
          valid = true
          errorMsg = ''
        }
        // 有配偶，居住方式是合租才有子女信息
        return {valid, errorMsg}
      },
      validateChild () {  // 子女信息校验
        let valid = false;
        let errorMsg = '';

        this.formData.children.forEach((item) => {
          if (!item.childName) {  // 姓名
            valid = false;
            errorMsg = '请输入孩子的姓名！'
          } else if (!this.$regExp.name.test(item.childName)) {
            valid = false;
            errorMsg = '孩子的姓名不合法！'
          } else if (!item.sex) {
            valid = false;
            errorMsg = '请选择孩子的性别！'
          } else if (!item.relation) {
            valid = false;
            errorMsg = '请选择关系！'
          } else if (!item.birthdayDate && !item.childIdNo) { // 出生日期和身份证号都没有值
            valid = false;
            errorMsg = '请选择孩子的出生日期或身份证号！'
          } else if (item.birthdayDate && item.childIdNo.length > 0 && !this.$regExp.cardID.test(item.childIdNo)) { // 出生日期和身份证号都有值，只需判断身份证号是否合法
            valid = false;
            errorMsg = '孩子的身份证号不合法！'
          } else if (item.childIdNo.length > 0 && !this.$regExp.cardID.test(item.childIdNo)) { // 只填身份证号
            valid = false;
            errorMsg = '孩子的身份证号不合法！'
          } else {
            valid = true
            errorMsg = ''
          }
        });
        if (this.formData.children.length == 0) {
          valid = false
          errorMsg = '请添加子女信息'
        }
        return {valid, errorMsg}
      },
      addChild () {  // 增加子女
        const validate = this.validateChild()
        if (validate.valid || this.formData.children.length == 0) {  // 在子女验证通过后才能新增
          this.formData.children.push({
            childName:'',  // 子女姓名
            sex: '',  // 子女性别
            relation: '',  // 与填表人关系
            birthdayDate: '',  // 出生日期
            childIdNo:'',  // 子女身份证号
          });
        } else {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        }
      },
      deleChild (index, childUuid) {
        if (index != this.formData.children.length - 1) {
          this.$store.commit('SHOWTOAST', '请先删除最后那个孩子的信息！');
        } else {
          this.deleIndex = index
          this.childUuid = childUuid
          this.Confirm.state = false
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
          this.Confirm.confirmText = '确定要删除当前子女的信息吗?'
        }
      },
      onConfirm () {  // 删除子女信息
        if (!this.Confirm.state) {
          if (this.childUuid) {
            api.deleteChildren({
              delType: this.delType,
              parentUuid: this.uuid,
              childrenArr: this.childUuid
            }).then((res) => {
              const data = res.data
              if (data.success) {
                this.$store.commit('SHOWTOAST', '操作成功！');
              }
            })
          }
          this.formData.children.splice(this.deleIndex, 1)
        } else { // 提交表单
          this.$store.commit('UPDATE_LOADING', true);
          api.saveResideInfo({
            formData: this.formData,
            homeType: 'lspy_'  // 南沙区域标记
          }).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
              this.formData.jhid = res.data.attributes.jhid
              // const query = {
              //   serviceType: this.serviceType,
              //   comGuid:this.comGuid,
              //   openid:this.openid,
              //   zhimascore: this.formData.zhimascore,
              //   jhid: this.formData.jhid
              // }
              // //this.$router.push({path:`/step3/${this.formData.idNo}`, query});

              this.$router.push({path:'/step3/' + this.formData.idNo });
            } else {
              this.$store.commit('SHOWTOAST',res.data.msg);
            }
          }).catch(() => {
            this.$store.commit('UPDATE_LOADING', false);
          })
        }
      },
      gonNextStep () {
        if (this.Alert.type == 1) return
        // const query = {
        //   serviceType: this.serviceType,
        //   comGuid:this.comGuid,
        //   openid:this.openid,
        //   zhimascore: this.formData.zhimascore
        // }
        //this.$router.push({path:`/step3/${this.formData.idNo}`, query});  20180814 旧
          this.$router.push({path:'/step3/' + this.formData.idNo});

      },
      goFileUploader () {
        const query = {
          idCard: this.formData.idNo,
          fileType: 2,
          isRenewal: true,
          isChange: 1,
          comGuid:this.comGuid,
          openid:this.openid,
          serviceType: this.serviceType,
          data: JSON.stringify(this.formData)
        }
        this.$router.push({path: '/fileUploader', query})
      },
      getDictionary(){ // 获取所有的字典
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
      unitFilterData (srcData, toData) {  // 针对企业单位信息
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              value: item.dwmc,  // 单位名称
              key: `${item.dwmc},${item.dwdz},${item.qybh},${item.lxdh}`,  // 因为单位名称会有相同的情况,所以为了保证key的唯一性，把单位的名称，地址，编号，企业电话都写在一起，用逗号分隔
              dwdz: item.dwdz,  // 单位地址
              qybh: item.qybh,  // 企业编号
              lxdh: item.lxdh  // 企业电话
            })
          });
        }
      },
      getPeopleInfo () {

        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo(this.formData.idNo).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            this.$store.commit('UPDATE_LOADING', false);
            this.uuid = data.uuid // 用户标识
            this.formData.jhid  = data.jhid
            this.formData.culture = data.culture // 文化程度
            this.formData.polity = data.polity   // 政治面貌
            this.formData.addressType = data.addressType    // 户口所在地类型
            if (data.hjaddress[0]!='') {     //是否已有记录
              this.formData.hjaddress = data.hjaddress
            }else{
              const _p = this.openid.slice(0,2) + '0000'
              const _c = this.openid.slice(0,4) + '00'
              const _a = this.openid.slice(0,6)
              this.formData.hjaddress = [ _p, _c, _a]
            }
            this.formData.hjAddressDetail = data.hjAddressDetail // 户籍详细地址
            this.formData.addressBackUp = data.hjAddressDetail   // 户籍详细地址
            this.formData.occupation = data.occupation  // 职业
            this.formData.workCompany = data.workCompany ? data.workCompany : '' // 单位名称
            this.queryDwxxPage(this.formData.workCompany.split(',')[0])
            this.formData.newWorkCompany = data.newWorkCompany ? data.newWorkCompany : '' // 单位名称
            this.formData.unitNumber = data.unitNumber // 企业编号
            this.formData.unitAdress = data.unitAdress // 企业地址
            this.formData.unitPhone = data.unitPhone    // 单位电话
            this.formData.marry = data.marry    // 婚姻状况
            this.formData.spouseName = data.spouseName != 'null' ? data.spouseName : ''  //配偶姓名
            this.formData.spouseIdNo = data.spouseIdNo ? data.spouseIdNo : ''   //配偶身份证号
            this.formData.comeDate = data.comeDate//来本市日期
            this.formData.hasJob = data.hasJob// 就业情况
            this.formData.lessee = data.lessee   // 是否承租人
            this.formData.liveType = data.liveType    // 居住方式
            this.formData.reson = data.reson    // 居住事由
            this.formData.houseType = data.houseType    // 居住事由
            this.formData.children = data.children// 子女
            if(data.children.length > 0){
              this.isSwitch = true
            }
            this.formDataBackup = Object.assign(this.formDataBackup, this.formData)

          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      checkAllInput () { // input验证
        this.isFirst = false
        this.$refs.hjAddressDetail.validate()  // 户籍详细地址
        if (this.formData.marry == 2) {  // 婚姻状况
          this.$refs.spouseName.validate()
          this.$refs.spouseIdNo.validate()
        }
        if (this.unitFlag == 1) {  // 有就业
          this.$refs.unitAdress.validate()
          this.$refs.unitPhone.validate()
          this.$refs.unitNumber.validate()
        }
      },
      occupationChange (code, name) {  // 选择职业
        if (this.isShowUnit) {
          this.formData.workCompany = ''
          this.formData.unitAdress = ''
          this.formData.unitNumber = ''
          this.formData.unitPhone = ''
          this.UnitList = []
          this.queryDwxxPage()
        }
      },
      queryDwxxPage (keyWord, currentPage, isClear) {  // 查询企业单位信息, currentPage: 分页，keyWord：搜索关键字，isClear：是否清空数组
        this.showLoading = true
        if (isClear) this.UnitList = []

        api.queryDwxxPage({
          openid: this.openid,
          wxsqn: this.wxsqn,
          account: this.formData.idNo,
          dwmc: keyWord ? keyWord : '广东',
          currentPage: currentPage ? currentPage : 1
        }).then((res) => {
          this.$store.commit('UPDATE_LOAD_MORE', false)
          this.showLoading = false
          if (res.data.success) {
            const data = JSON.parse(res.data.jsonRes[0]);
            if (data.page.currentPage < currentPage) {
              this.$refs.workCompany.disablePullup()
              return
            }
            if (data.ackCode == 1) this.unitFilterData(data.dataList, this.UnitList);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOAD_MORE', false)
          this.showLoading = false
        })
      },
      entryValChange (val) { // 手动新增单位名称
        if (val) {
          this.formData.newWorkCompany = val
          this.formData.workCompany = -1
          this.formData.unitAdress = ''
          this.formData.unitNumber = ''
          this.formData.unitPhone =''
        }
      },
      unitChange (key, val, unitAdress, unitNumber, unitPhone) {  // 选择单位名称
        const arr = key != -1 ? key.split(',') : ''
        if (this.isReback && this.formData.workCompany && this.formData.workCompany != -1) {
          this.formData.unitAdress = arr[1]
          this.formData.unitNumber = arr[2]
          this.formData.unitPhone = arr[3] != 'null' ? arr[3] : ''
        } else {
          this.isReback = true
        }
      },
      mainOptChange (value) {
        if (this.formData.addressBackUp) {
          this.Alert.state = true
          this.Alert.type = 1
          this.Alert.text = '请您到辖区来穗机构服务窗口进行主项信息变更 ！'
        }
      },
      hasChange() {
        for (let i in this.formData) {
          if (this.formData[i] != this.formDataBackup[i]) return true
        }
      }
    },
    created() {
      this.getDictionary();
      this.getPeopleInfo();
      if (this.serviceType == 1) {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住信息登记'});
      } else {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证办理'});
      }
      if (window.AlipayJSBridge) this.nextBut = false
    },
    mounted () {
      document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goNext, true) // 删除支付宝右上角点击事件
    }
  }
</script>
<style lang="less">
.btn-switch{width:1rem;height:.5rem;border:.04rem solid #fff;border-radius:.4rem; position: absolute;margin-top:.28rem;right:.2rem;z-index:1000;background:#e1e1e1; }
.btn-switch i{display:block;width:.5rem;height:.5rem;border-radius:50%;background:#fff;margin-left:.5rem;}

.btn-switch.on{background: #0091FF}
.btn-switch.on i{margin-left:0;}
  .form_cont{width:100%;overflow: hidden;}
  .go_next_btn{width:1rem;height:1rem;line-height:1rem;position: absolute;top:0;right:.3rem;color:#fff;}
  .group_cont{width:100%;overflow: hidden;
    .weui-cells__title{font-size:.3rem;background: #eee;height:1rem;line-height:1.2rem;margin:0;}
  }
  .no_before .weui-cell:before{display: none;}
  .has_before{
    position: relative;
    &:before{content: " "; width:100%;position: absolute;height: 1px;border-top: 1px solid #D9D9D9;border-top: 1px solid #D9D9D9;  color: #D9D9D9;left: 15px;display: block;transform: scaleY(0.5);position: absolute;bottom:0;}
  }
  .is_married{overflow: hidden;width:100%;/*height:1.97rem;*/position: relative;transition: all 1s ease;
    &:before{content: " "; width:100%;position: absolute;height: 1px;color: #D9D9D9;left: 15px;display: block;transform: scaleY(0.5);border-top:.01rem solid #ccc}
  }
  .add_childen_btn{width:5.8rem;height:.88rem;background:#0091FF;margin:.5rem auto;height:.88rem;line-height: .88rem;text-align: center;color:#fff;border-radius: 0.08rem;}
  .child_title{height:1.1rem;line-height: 1.2rem;text-indent:15px;padding-right:.4rem;border-top:1px dashed #D9D9D9;color:#1f67d0;}
  .child_title:first-of-type{border:none;}
  .child_del_btn{float: right;margin-top:.3rem;}

  .icons{display: block;width:1rem;height:1rem;margin:0 auto .3rem auto;position: relative;}
  .icons:before{font-size: 1rem;position: absolute;left: 0;top:0;}

</style>
