
import baseUrl from './config';
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = baseUrl;


export default {

  /*
   * 获取来穗数据字典
   * params: {object} 表单数据对象
   *  openid: 支付宝id
   *  opentype: 1,支付宝应用, 2,来穗小程序
   *  wxsqn: 微信授权码
   * typeCode: 字典编码类型
   */
  // queryDictionaryList (params) {
  //   return axios.post('/mobile/laisuiQueryDictionaryList', qs.stringify({
  //     openid: params.openid,
  //     opentype: 1,
  //     account: params.account,
  //     wxsqn: params.wxsqn,
  //     typeCode: params.typeCode
  //   }));
  // },
  queryDictionaryList (typeCode) {  // 本地数据字段（多个）
    return axios.get(`/mobile/queryDictionaryList?typeCodes=XZQ,XB,MZ,WHCD,ZZMM,HKXZ,HYZK,SF,JZFS,ZZDXZ,ZZSY,JZY`);
  },

  // queryDictionaryList (params) {
  //   return axios.get(`/mobile/queryDictionary?typeCode=${params.typeCode}`);
  // },

  // 学历字典
  StudyGrade () {
    return axios.get('/mobile/dataDescList?type=StudyGrade');
  },

  // 户口类型字典
  getRegType () {
    return axios.get('/mobile/dataDescList?type=RegType');
  },

  // 婚姻状况字典
  getMarriyState () {
    return axios.get('/mobile/dataDescList?type=MarriyState');
  },

  // 政治面貌字典
  getPoliticalStatus () {
    return axios.get('/mobile/dataDescList?type=PoliticalStatus');
  },

  // 居住处所类型字典
  getHouseType () {
    return axios.get('/mobile/dataDescList?type=HouseType');
  },

  // 是否承租人字典
  getLessee () {
    return axios.get('/mobile/dataDescList?type=Lessee');
  },

  // 居住方式字典
  getLiveType () {
    return axios.get('/mobile/dataDescList?type=LiveType');
  },

  // 居住事由字典
  getReson () {
    return axios.get('/mobile/dataDescList?type=Reson');
  },

  // 与填表人关系字典
  getRelation () {
    return axios.get('/mobile/dataDescList?type=Relation');
  },

  // 就业情况字典
  getEmploymentStatus () {
    return axios.get('/mobile/dataDescList?type=employmentStatus');
  },

  /*
   * 首页新闻列表
   * param: page 新聞页数
   * param: newsType 新聞类型
   * param: newsArea 区域，目前写死南沙
   */
  getNewsList (page,type) {
    return axios.get(`/mobile/newsWebIntf/newslist?opentype=1&rows=5&newsType=${type}&index=${page}&newsArea=440115`);
  },

  /*
   * 新闻詳情
   * param: newsId 新聞id
   */
  newsDetail (newsId) {
    return axios.get(`/mobile/newsWebIntf/newsDetail?comGUID=${newsId}`);
  },

  /*
   * 新闻点赞
   * param: newsId 新聞id
   */
  newsThumbsUp (newsId) {
    return axios.post(`/mobile/newsWebIntf/upLikecnt?comGUID=${newsId}`);
  },

  /*
   * 新闻浏览次数
   * param: newsId 新聞id
   */
  newsViewcnt (newsId) {
    return axios.post(`/mobile/newsWebIntf/upViewcnt?comGUID=${newsId}`);
  },

  /*
   * 首页banner
   * params: 表单数据对象
   */
  homePage () {
    return axios.post('/mobile/newsWebIntf/homePage')
  },

  /*
   * 获取从支付宝返回的信息
   */
  peopleDetails (comGuid) {
    return axios.get(`/mobile/peopleDetails?comGuid=${comGuid}&homeType=lsns_`);
  },

  /*
   * 提交居住证办理基础信息
   * formData: 表单数据对象
   * formData: 表单数据对象
   */
  saveResideInfo (params) {
    return axios.post(`/mobile/peopleSave?jsonStr=${JSON.stringify(params.formData)}&homeType=${params.homeType}`)
  },

  /*
   * 保存预约信息接口
   * params: {object} 表单数据对象
   *  openid: 支付宝id
   *  idCard: 身份证号
   */
  saveAppointment (params) {
    return axios.get('/mobile/saveAppointment', {
      params: {
        openid: params.openid,
        idCard: params.idCard,
        checktimeidls: params.checktimeidls,
        checktimels: params.checktimels
      }
    })
  },

  /*
   * 查询预约详情
   * params: {object} 表单数据对象
   *  openid: 支付宝id
   *  idCard: 身份证号
   *  appointmentId: 预约号
   */
  appointmentDetail (params) {
    return axios.get(`/mobile/appointmentDetail`, {
      params: {
        openid: params.openid,
        idCard: params.idCard,
        appointmentId: params.appointmentId
      }
    })
  },

  /*
   * 详情信息回显
   * params: {string} 身份证号码
   */
  rebackPeopleInfo (params) {
    return axios.post(`/mobile/rebackPeopleInfo?idCard=${params}`)
  },

  /*
   * 流动人员登记结果查询
   * params: {string}
   * jhid  交易编号
   */
  queryUploadLdryResult (params) {
    return axios.get(`/mobile/queryUploadLdryResult`, {
      params: {
        jhid: params.jhid,
        idCard: params.idCard,
        opentype: 1,
        openid: params.openid
      }
    })
  },

  /*
   * 子女保存接口
   * params: 表单数据对象
   */
  childrenSave (params) {
    return axios.post(`/mobile/childrenSave?jsonStr=${JSON.stringify(params)}`)
  },

  /*
   * 删除子女接口
   * params: {object} 表单数据对象
   * delType: 删除类型，1，全部删除，2、单个删除
   * parentUuid: 用户主键ID
   * childrenArr: 用户主子女主键ID
   */
  deleteChildren (params) {
    return axios.get('/mobile/deleteChildren', {
      params: {
        delType: params.delType,
        parentUuid: params.parentUuid,
        childrenArr: params.childrenArr
      }
    })
  },

  /*
  *  居住证接口
  * */
  applyResidence (idCard) {
    return axios.get('/mobile/applyResidence?idCard='+idCard)
  },

  /*
  *  查询办理居住证办理剩余天数接口
   * params: {object} 表单数据对象
   * idCard: 身份证
   * openid: openid
   * name: 姓名
  * */
  daysRemailing (params) {
    return axios.get('/mobile/daysRemailing', {
      params: {
        idCard: params.idCard,
        name: params.name,
        openid: params.openid
      }
    })
  },

  /*
   *  查询是否有传图片
   * */
  isHavePic (idCard) {
    return axios.get('/mobile/isHavePic?idCard='+idCard)
  },

  /*
  *  图片上传接口
  *  params {object}
  *  fileType 图片类型
  *  idCard 身份证号
  *  picList 图片数组
  * */
  uploadPic(params) {
    return axios.post('/mobile/uploadPic', qs.stringify({
      picList: JSON.stringify(params.picList),
      idCard: params.idCard,
      fileType: params.fileType
    }))
  },
  /*
   *  图片上传接口
   *  params {String}  uuid
   * */
  deletePic (params) {
    return axios.post('/mobile/delPic?uuid='+ params)
  },
  /*
   *  获取短信验证码接口
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 支付宝id
   *  mobile: 手机号
   * */
  sendMessage (params) {
    return axios.post('/mobile/laisuiSendMessage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      mobile: params.mobile
    }))
  },
  /*
   *  注册接口
   *  params {Object}
   *  openid: 支付宝id
   *  xm: 姓名
   *  zjhm: 证件号码
   *  password：登录密码 8-16 字母或数字
   *  mobile： 手机号码
   *  checkCode：短信验证码
   * */
  saveUser (params) {
    return axios.post('/mobile/laisuiSaveUser',qs.stringify({
      openid: params.openid,
      opentype: 1,
      xm: params.name,
      zjhm: params.idCard,
      // password: params.passWord,
      mobile: params.mobile,
      checkCode: params.identifyingCode
    }))
  },
  /*
   *  登录接口
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  account: 证件号码或手机号码
   *  password：登录密码
   * */
  login (params) {
    return axios.post('/mobile/laisuiLogin',qs.stringify({
      opentype: 1,
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      password: params.password
    }))
  },
  /*
   *  找回密码接口
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  checkCode: 短信验证码
   *  newPassword：新密码
   *  mobile: 手机号码
   * */
  findPassword (params) {
    return axios.post('/mobile/laisuiFindPassword',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      opentype: 1,
      checkCode: params.checkCode,
      newPassword: params.newPassword,
      mobile: params.mobile
    }))
  },
  /*
   *  行政区查询
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  wxsqm：授权码(第三方)
   *  itemName：字典名称，支持模糊查询
   * */
  queryXzqList (params) {
    return axios.post('/mobile/laisuiQueryXzqList',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      wxsqm: params.wxsqm,
      itemName: params.itemName
    }))
  },
  /*
   *  街镇查询
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  xzq: 行政区代码
   *  itemName: 代码名称，支持模糊查询
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryJzdmPage (params) {
    return axios.post('/mobile/laisuiQueryJzdmPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      xzq: params.xzq,
      currentPage: params.currentPage,
      itemName: params.itemName,
    }))
  },
  /*
   *  街路巷查询 (图南)
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jz: 街镇代码
   *  itemName: 街路巷名称，支持模糊查询
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryJddmPage (params) {
    return axios.post('/mobile/laisuiQueryJddmPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jz: params.jz,
      itemName: params.itemName,
      currentPage: params.currentPage
    }))
  },

  /*
   *  街路巷查询（本地）
   *  params {Object}
   *  typeCode: 街镇代码
   *  itemName: 街路巷名称，支持模糊查询
   *  currentPage 分页页码
   *  pageSize 单页数据条数,目前写死50条
   * */
  queryDictionaryListPage (params) {
    return axios.get('/mobile/queryDictionaryListPage',{
      params: {
        typeCode: params.typeCode,
        itemName: params.itemName,
        currentPage: params.currentPage,
        pageSize: 50
      }
    })
  },

  /*
   *  门牌号查询/出租屋（栋）信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jddm: 街道代码
   *  mpmc: 门牌名称
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryFwxxzPage (params) {
    return axios.post('/mobile/laisuiQueryFwxxzPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jddm: params.jddm,
      mpmc: params.mpmc,
      currentPage: params.currentPage
    }))
  },
  /*
   *  房号查询/出租屋（套）信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  zhid: 房屋栋ID
   *  dy: 详址 支持模糊查询
   *  currentPage: 当前页 如果为空或不是正整数，默认为1
   * */
  queryFwxxfhPage (params) {
    return axios.post('/mobile/laisuiQueryFwxxfhPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      zhid: params.zhid,
      currentPage: params.currentPage,
      dy: params.dy
    }))
  },
  /*
   *  查询企业单位信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  dwmc: 单位名称 支持模糊查询
   *  currentPage: 当前页 如果为空或不是正整数，默认为1
   * */
  queryDwxxPage (params) {
    return axios.post('/mobile/laisuiQueryDwxxPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      dwmc: params.dwmc,
      currentPage: params.currentPage
    }))
  },
  /*
   *  查询最近七天预约登记
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jz: 街镇代码
   *  yyrq: 预约日期（YYYY-MM-DD）必须大于当天，只能预约七天范围内的
   * */
  laisuiQuerySmhsszList (params) {
    return axios.post('/mobile/laisuiQuerySmhsszList',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jz: params.jz,
      yyrq: params.yyrq
    }))
  },
  /*
   *  查询居住证信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  zjhm: 证件号码
   *  xm: 姓名
   *  opentype: 1: 支付宝应用,2: 来穗小程序
   * */
  laisuiJzzCardInfo (params) {
    return axios.post('/mobile/laisuiJzzCardInfo',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      opentype: 1,
      zjhm: params.zjhm,
      xm: params.xm
    }))
  },

  /*
   *  查询用户预约结果的街道地址
   *  params {Object}
   *  idCard: 证件号码
   * */
  getStreeDate (params) {
    return axios.post('/mobile/getStreeDate',qs.stringify({
      idCard: params.idCard,
    }))
  },

  /*
   *  积分首页列表
   *  params {Object}
   *  index: 页数
   *  rows: 每页条数
   * */
  // goodsList (params) {
  //   return axios.post('/mobile/goodsList',qs.stringify({
  //     index: params.index,
  //     rows: params.rows
  //   }))
  // },
  goodsList (page) {
    return axios.post(`/mobile/goodsList?rows=6&index=${page}`)
  },
  /*
     *  我的积分
     *  params {Object}
     *  userId: 用户id
     * */
  selectJiFen (params) {
    return axios.post('/mobile/selectJiFen',qs.stringify({
      userId: params.userId
    }))
  },
  /*
     *  商品详情查询
     *  params {Object}
     *  goodsId: 用户id
     * */
  goodsDetail (params) {
    return axios.post('/mobile/goodsDetail',qs.stringify({
      goodsId: params.goodsId
    }))
  },
  /*
       *  兑换记录列表
       *  params {Object}
       *  index: 页数
       *  rows: 每页条数
       * */
  orderList (page) {
    return axios.post(`/mobile/orderList?rows=6&index=${page}`)
  },
  /*
       *  兑换记录列表详情
       *  params {Object}
       *  orderId: 兑换记录id
       * */
  orderDetail (params) {
    return axios.post('/mobile/orderDetail',qs.stringify({
      orderId: params.orderId
    }))
  },
  /*
   *  兑换
   *  params {Object}
   *  idCard: 身份证
   *  goodsId: goodsId
   * */
  changIntegration (params) {
    return axios.post('/mobile/changIntegration',qs.stringify({
      idCard: params.idCard,
      goodsId: params.goodsId
    }))
  },
  /**社保查询接口 */
  /**个人信息查询 */
  findPersonalBasicInfo(params) {
    return axios.get(`https://zwt.createt.cn/gzGovTong/mobile/shebao/findPersonalBasicInfo?aac147=${params.idCard}`);
  },
  /**缴费状态查询
   * personalNo: 社保号
   *  idCard: 身份证
   *  type: 业务类型，1.养老 2.农转居  3.失业保险 4.工伤保险 5.生育保险
   */
  personalPaymentStatus(params) {
    https://zwt.createt.cn/gzGovTong/mobile/shebao/personalPaymentStatus
      return axios.get('https://zwt.createt.cn/gzGovTong/mobile/shebao/personalPaymentStatus', {
        params: {
          personalNo: params.personalNo,
          idCard: params.idCard,
          type: params.type
        }
      })
  },
  /*
   *  个人缴费历史查询（城镇职工/农转居）
   *  params {Object} 参数对象
   *  aac001: 个人编号(必填)
   *  aae140: 险种类型 1.养老 2.农转居  3.失业保险 4.工伤保险 5.生育保险；险种参数为空，返回的是全部险种
   *  aae003s: 起始年月
   *  aae003d: 结束年月
   * */
  personalContribution(params) {
    return axios.get('https://zwt.createt.cn/gzGovTong/mobile/shebao/personalContribution', {
      params: {
        aac001: params.aac001,
        aae140: params.aae140,
        aae003s: params.aae003s,
        aae003d: params.aae003d
      }
    })
  },

  /*
   *  医疗缴费历史历史查询（城镇职工/农转居）
   *  params {Object} 参数对象
   *  aac001: 个人编号(必填)
   *  aae030: 起始年月
   *  aae031: 结束年月
   * */
  findMedicalPayHistory(params) {
    return axios.get('https://zwt.createt.cn/gzGovTong/mobile/shebao/findMedicalPayHistory', {
      params: {
        aae031: params.aae031,
        aae030: params.aae030,
        aac001: params.aac001
      }
    })
  },



}
