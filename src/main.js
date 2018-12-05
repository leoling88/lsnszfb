// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import router from './router/index'
import App from './App'
import './assets/css/style.css'//自定义页面样式
import './assets/css/notes.css'//自定义页面样式
import store from './vuex/store'
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)
import { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

import utils from './script/utils'//配置基础工具类
Vue.use(utils)

import ajaxError from './api/ajaxError'//配置基础工具类
Vue.use(ajaxError)
import lrz from 'lrz' 

// import VueScroller from 'vue-scroller'
// Vue.use(VueScroller)
import Carousel3d from 'vue-carousel-3d';
Vue.use(Carousel3d);

FastClick.attach(document.body)

Vue.prototype.$bus = new Vue({});//两个组件传递参数全局属性

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box');

const history = window.sessionStorage;
history.clear()
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

router.beforeEach(function (to, from, next) {
  window.scrollTo(0,0);
  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', 1)
    } else {
      store.commit('UPDATE_DIRECTION', -1)
    }
  } else {
    ++historyCount;
    history.setItem('count', historyCount);
    to.path !== '/' && history.setItem(to.path, historyCount);
    store.commit('UPDATE_DIRECTION', 1)
  }

  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
});
