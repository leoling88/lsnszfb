import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  loadingShow: false,
  showLoadMore: false,
  toastShow: false,
  toastMsg:'',
  toastWidth:'auto',
  showTabbar:'',
  showTabbarIndex:'',
  comGuid: '',
  alipayAcount: '',  // 支付宝id
  idNo: '',
  openid: '',// 微信的openid
  wxsqm: '',// 授权码(第三方)
  wxsqn: '',  // 微信授权码
  direction: 1,// 页面滑动的方向，1表示从右边滑入，-1表示从左边滑入,
  zdlist: '' // 数据字典
}

// 定义所需的 mutations
const mutations = {
  UPDATE_ZIDIAN(state, data) {
    state.zdlist = data;
  },
  //显示公共底部菜单栏
  SHOWTABBAR(state, data) {
    state.showTabbar = true;
    state.showTabbarIndex = data;
  },
  //隐藏公共底部菜单栏
  HIDETABBAR(state) {
    state.showTabbar = false;
  },
  //显示提示框
  SHOWTOAST(state, data) {
    state.toastMsg = data.text||data;
    state.toastWidth  = data.width||'auto';
    state.toastShow = true;
  },
  //清空显示提示框
  CLEARSHOWTOAST(state, data) {
    state.toastShow = data;
  },
  UPDATE_LOADING(state, data) {
    state.loadingShow = data;
  },
  // 更新扫脸后COMGUID
  UPDATE_COMGUID(state, data) {
    state.comGuid = data;
  },

  // 更新扫脸后alipayAcount
  UPDATE_ALIPAY_ACOUNT(state, data) {
    state.alipayAcount = data;
    state.openid = data;
    state.wxsqn = data;
  },
  // 更新身份证号
  UPDATE_ID_NO(state, data) {
    state.idNo = data;
  },
  // 更新loadMore
  UPDATE_LOAD_MORE(state, data) {
    state.showLoadMore = data;
  },
  // 更新direction
  UPDATE_DIRECTION(state, data) {
    state.direction = data;
  }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})
