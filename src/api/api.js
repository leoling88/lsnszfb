import baseUrl from './config';
import axios from 'axios';
import qs from 'qs';
axios.defaults.baseURL = baseUrl //'http://192.168.18.38:8080/cnLaiSui/'//baseUrl;  
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
  // 
  // 
  queryDictionaryList (typeCode) {  // 本地数据字段（多个）
    return axios.get(`/mobile/queryDictionaryList?typeCodes=XZQ,XB,MZ,WHCD,ZZMM,HKXZ,HYZK,SF,JZFS,ZZDXZ,ZZSY,JZY`);
  },
  queryDictionary (typeCode) {  // 本地数据字段(单个)
    return axios.get(`/mobile/queryDictionary?typeCode=${typeCode}`);
  },
  queryDictionaryList (typeCode) {  // 本地数据字段（多个）
    return axios.get(`/mobile/queryDictionaryList?typeCodes=XZQ,XB,MZ,WHCD,ZZMM,HKXZ,HYZK,SF,JZFS,ZZDXZ,ZZSY,JZY`);
  },
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
   * newsType: 新闻类型
   * index: 列表页码
   * newsArea: 地区码
   */
  newsList (params) {
    return axios.get(`/mobile/newsWebIntf/newslist`,{
      params: {
        newsType: params.newsType,
        index: params.index,
        newsArea: params.newsArea,
        opentype: 1,
        rows: params.rows ? params.rows : 10
      }
    });
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
   * 获取从支付宝返回的信息
   */
  getUserDetails (comGuid) {
    return axios.get(`/mobile/peopleDetails?comGuid=${comGuid}&homeType=lspy_`);
  },

  /*
   * 新获取返回的信息(支付&民生)
   */
  getPeopleDetailsMS (params) {
    return axios.get(`/mobile/peopleDetailsMS?idCard=${params.idCard}&homeType=lspy_`);
  },
  /*
   * 新增接资料(支付&民生)
   */
  setPeopleDetailsMS (params) {
    return axios.get(`/mobile/dataInit?idCard=${params.idCard}&homeType=lspy_`);
  },

  /*
   * 获取从民生返回的信息     20180813+ by leoLing
  */
  getUserDetailsMS (params) {
    return axios.get(`/mobile/checkInfo?idCard=${params.idCard}&userName=${params.userName}&homeType=lspy_`);
  },
  /*
   * 获取从支付宝返回的信息  
  */
  getUserDetailsZFB (params) {
    return axios.get(`/mobile/loadRegistMsg?idCard=${params.idCard}&homeType=lspy_`);
  },

  /*
   * 提交居住证办理基础信息
   * formData: 表单数据对象
   * formData: 表单数据对象
   */
  saveResideInfo (params) {
    return axios.post(`/mobile/peopleSave?jsonStr=${JSON.stringify(params.formData)}&homeType=lspy_`)
  },

  /*/mobile/peopleSave?jsonStr=
   * 详情信息回显
   * params: {string} 省份证号码
   */
  rebackPeopleInfo (params) {
    return axios.post(`/mobile/rebackPeopleInfo?idCard=${params}&homeType=lspy_`)
  },

  /*
   * 流动人员登记结果查询
   * params: {string}
   * jhid  交易编号
   */
  queryUploadLdryResult (params) {
    return axios.get(`/mobile/queryUploadLdryResult?homeType=lspy_`, {
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
    return axios.get('/mobile/deleteChildren?homeType=lspy_', {
      params: {
        delType: params.delType,
        parentUuid: params.parentUuid,
        childrenArr: params.childrenArr
      }
    })
  },

  /*
   * 首页banner
   * params: 表单数据对象
   */
  homePage () {
    return axios.post('/newsWebIntf/homePage')
  },

  /*
  *  居住证接口
  * */
  applyResidence (idCard) {
    return axios.get('/mobile/applyResidence?idCard='+idCard)
  },

  /*
  *  查询办理居住证办理剩余天数接口
  * */
  daysRemailing (idCard) {
    return axios.get('/mobile/daysRemailing?idCard='+idCard)
  },

  /*
   *  查询是否有传图片
   * */
  isHavePic (idCard) {
    return axios.get('/mobile/isHavePic?idCard='+idCard+'&homeType=lspy_')
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
      password: params.passWord,
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
   *  街路巷查询
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
   *  门牌号查询/出租屋（栋）信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jddm: 街道代码
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryFwxxzPage (params) {
    return axios.post('/mobile/laisuiQueryFwxxzPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jddm: params.jddm,
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
      wxsqn: params.wxsqn ? params.wxsqn : params.openid,
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
      userId: params.userId,
      name: params.name,
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
  orderList (page,idCard) {
    return axios.post(`/mobile/orderList?rows=6&index=${page}&idCard=${idCard}`)
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
  /*
   *  订单新增接口(去程)
   *  params {Object}
   *  custOrderId: 主键id
   * */
  addTripOrder (params) {
    return axios.post('/mobile/addTripOrder',qs.stringify({
      custOrderId: params.custOrderId
    }))
  },
  /*
   *  订单新增接口(返程)
   *  params {Object}
   *  openId: 主键id
   * */
  addReturnOrder (params) {
    return axios.post('/mobile/addReturnOrder',qs.stringify({
      openId: params.openId
    }))
  },
  /*
   *  物流信息查询接口
   *  params {Object}
   *  expressNbr: 邮件号
   * */
  getMailTrack (params) {
    return axios.post('/mobile/getMailTrack',qs.stringify({
      expressNbr: params.expressNbr
    }))
  },
  /*
   *  邮件号获取接口
   *  params {Object}
   *  amount: 主键id
   *  expressType: 邮件号类型 1：去程， 2：返程
   * */
  getExpressNbr (params) {
    return axios.post('/mobile/getExpressNbr',qs.stringify({
      amount: params.amount,
      expressType: params.expressType
    }))
  },
  /*
   *  物流信息查询接口
   *  params {Object}
   *  custOrderId: 主键id
   *  expressType: 邮件号类型 1：去程， 2：返程
   * */
  queryExpressNbr (params) {
    return axios.post('/mobile/queryExpressNbr',qs.stringify({
      custOrderId: params.custOrderId,
      expressType: params.expressType
    }))
  },
  /*
   *  揽收状态回调接口(客户端提供)
   *  params {String} 主键
   * */
  pushPickupStatus (params) {
    return axios.post('/mobile/pushPickupStatus',qs.stringify({
      params: params.params
    }))
  },

  /*
   *  ems创建订单
   *  params {String} 主键
   *  idcard  身份证号
   *  name 姓名
   *  phoneNo 手机号
   *  area 省市区
   *  receiveAddress 详细地址
   *  cost 邮费
   * *//*
  emsOrderCreation (params) {
	  /*return axios.post('/mobile/emsOrderCreation',qs.stringify({
			oorderid: params.idcard,
      sendername: params.name,
      sendertel: params.phoneNo,
      senderarea: params.area,
      senderaddress: params.receiveAddress
      //cost: params.cost
    }))
    return axios.post('/mobile/infoSave',
    	qs.stringify({
    		sendername: params.sendername,
      	sendertel: params.sendertel,
      	senderarea: params.senderarea,
      	senderaddress: params.senderaddress,
      	courierAim: params.courierAim
    	})
    )
  },*/
  /*
   *  ems支付
   *  custOrderId  订单ID
   *  orderName 订单名称
   *  price 邮费
   *  remark ；备注
   * 
  emsPay (params) {
    return axios.get('/mobile/pay',{
	    	params:{
	    		custOrderId: params.custOrderId,
	      	orderName: params.orderName,
	      	price: params.price,
	      	remark: params.remark
	    	}
    	}
    )
  },*/
	/*
   * 支付后详情
   * 
  courierInfo (params) {
    return axios.get('/mobile/courierInfo',{
	    	params:{
	    		buyAccount: params.buyAccount,
	    	}
    	}
    )
  },*/
  /*
   * 申领EMS-提交信息 
   * */
  emsOrderCreation (params) {
    return axios.post(`/mobile/addEMSOrder?jsonStr=${JSON.stringify(params)}`)
  },
  /*
   * 申领EMS-物流信息
   * */
  logisticsEMS (params) {
    return axios.post('/mobile/expressResidentialInfo',qs.stringify({
      expressNbr: params.expressNbr,
      custOrderId: params.custOrderId
    }))
  },
  /*
   * 签注--居住证签注刷脸后数据 本接口用于查询居住证，入口卡片展示。
   * */
  saolianJZZData (alipayId) {
 return axios.get('/mobile/alipaypeopleinfo?alipayId='+ alipayId)    
  },
  /*
   * 签注--居住证签注刷脸后数据 本接口用于判断用户点居住签注时跳转。
   * */
  checkURL (params) {
    return axios.post('/mobile/entrance',qs.stringify({
      idCard: params.idCard,
      openType: params.openType,
      openId: params.openId,

    })) 
  },

  /*
   * 签注--居住证签注-入口
   * */
  requireJZZData(params) {
    return axios.post(`/mobile/resPermitCard?jsonStr=${JSON.stringify(params)}`)
  },
  /*
   * 签注--校验是否有居住证 
   * */
  checkResidencePermi (params) {
    return axios.post(`/mobile/checkResPermit?jsonStr=${JSON.stringify(params)}`)
  },
  /*
   * 签注--校验资格
   * */
  checkQualification (params) {
    return axios.post(`/mobile/checkCondition?jsonStr=${JSON.stringify(params)}`)
  },
  /*
   * 签注--查询数据
   * */
  requireData (params) {
    return axios.post(`/mobile/rollbackData?jsonStr=${JSON.stringify(params)}`)
  },
  /*
   * 签注--居住登记信息变更
   * */
  regJZDJDatas (params) {
    return axios.post('/mobile/renewChangeInfo',qs.stringify({
      rid: params.rid,
      opentype: params.opentype,
      orginType: params.orginType,
    }))
  },
  /*
   * 签注--居住登记信息变更保存提产
   * */
  setJZDJDatas (params) {
    return axios.post(`/mobile/infoSubmit?jsonStr=${JSON.stringify(params)}`)
  },
  /*
   * 签注--是否重点人员
   * */
  checkZDRY (rid) {
    return axios.post('/mobile/checkSpecial?rid='+rid)
  },
  /*
   * 签注--领取方式
   * */
  getWay(params) {
    return axios.post('/mobile/receiveType',qs.stringify({
      rid: params.rid,
      receiveType: params.receiveType,
    }))
  },
  /*
   * 签注--提交结果
   * */
  setQZDatas(params) {
    return axios.post('/mobile/resPermitSubmit',qs.stringify({
      rid:params.rid,
    }))
  },
  /*
   * 签注--查询是否能EMS领取
   * */
  checkLQState(rid) {
    return axios.post(`/mobile/receivelimit?rid=${rid}`);
  },

  /*
   * 签注--服务站信息
   * */
  requireServiceInfo(params) {
    return axios.post('/mobile/serviceInfo',qs.stringify({
      idCard:params.idCard,
    }))
  },
  /*
   * 签注--办理进度
   * */
  QZprogress(rid) {
    return axios.post(`/mobile/renewProgress?rid=${rid}`);
  },
  /*
   * 签注--街道办理进度
   * */
  JDprogress(rid) {
    return axios.post(`/mobile/queryResult?rid=${rid}`);
  },
  /*
   * 签注--上传图片回滚
   * */
  requirePic(params) {
    return axios.post('/mobile/fileRollback',qs.stringify({
      rid:params.rid,
      step:params.step,

    }))
  },
  /*
   * 签注--上传图片
   * */
  setUpPic(params) {
    return axios.post('/mobile/ResPermitFileUpload',qs.stringify({
      rid:params.rid,
      step:params.step,
      realType:params.realType,
      file:params.file,
      liveType:params.liveType,
      idCardType:params.idCardType,
      conditionType:params.conditionType,
    }))
  },
  /*
   * 签注--上传图片
   * */
  submiUpPic(params) {
    return axios.post('/mobile/nextSubmit',qs.stringify({
      rid:params.rid,
      step:params.step,
      idCardType:params.idCardType,
      conditionType:params.conditionType,
    }))
  },
  /*
   * 签注--删除单张图片
   * */
  delImgData(fid) {
    return axios.post(`/mobile/fileDel?fid=${fid}`);
  },
  /*
   * 签注--查居住证信息
   * */
  requireJZZ(idCard) {
    return axios.post(`/mobile/residentialPermit?idCard=${idCard}`);
  },
  /*
   * 签注--EMS物流信息
   * */
  requireEMSWL(params) {
    return axios.post('/mobile/expressResidentialInfo',qs.stringify({
      expressNbr:params.expressNbr,
      expressNbr:params.expressNbr,
    }))
  },

}
//