export default {
  data() {
    return {
      isFirst: true, // 是否是第一次选择或输入
      showLoading: true, // 是否加载中
      serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1,  // 业务类型，1,为登记，2，为居住证
      sexList:[], // 性别
      nationList:[],  // 民族
      adresasTypeList:[],  // 户口类型
      polityList:[],  // 政治面貌
      cultureList:[],  // 文化程度
      marryList:[],  // 婚姻状况
      liveTypeList:[],  // 居住方式
      resonList:[],  // 居住事由
      houseTypeList:[],  // 房屋类型
      lesseeList:[],  // 是否承租人
      occupationList:[],  // 职业
      hasJobOptions: [],   // 就业情况
      relationList: [],   // 关系
      inputValid: {  // 输入框校验
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
        cellPhone: (val) => {
          if (this.isFirst) return {valid: true}
          return {
            valid: this.$regExp.phone.test(val),
            msg: '手机号不合法！'
          }
        }
      }
    }
  },
  methods: {
    getDictionaryData () {
      if (/step1/g.test(this.$route.path)) {
        this.nationList = this.$Utils.getLocalStorage('MZ');
      } else {
        this.adresasTypeList = this.$Utils.getLocalStorage('HKXZ');
        this.polityList = this.$Utils.getLocalStorage('ZZMM');
        this.cultureList = this.$Utils.getLocalStorage('WHCD');
        this.marryList = this.$Utils.getLocalStorage('HYZK');
        this.liveTypeList = this.$Utils.getLocalStorage('JZFS');
        this.resonList = this.$Utils.getLocalStorage('ZZSY');
        this.houseTypeList = this.$Utils.getLocalStorage('ZZDXZ');
        this.lesseeList = this.$Utils.getLocalStorage('SF');
        this.occupationList = this.$Utils.getLocalStorage('JZY');
        this.hasJobOptions = this.$Utils.getLocalStorage('JYQK');
        // this.relationList = this.$Utils.getLocalStorage('GX');


      }
      this.sexList = this.$Utils.getLocalStorage('XB');
    },
    setTitle () {
      if (this.$route.query.serviceType > 1) {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住证办理'});
      } else {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住信息登记'});
      }
    }
  },
  created () {
    this.getDictionaryData()
    this.setTitle();
  },
  mounted (){
    document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
  },
  destroyed () {
    document.removeEventListener('optionMenu', this.goNext, false) // 删除支付宝右上角点击事件
  }
}
