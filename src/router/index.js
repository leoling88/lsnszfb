import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    //入口首页
    {
      path: '/',
      component: function (resolve) {
        require(['../components/home/into.vue'], resolve)
      },
      meta: {
        title: '广州来穗通',
        showBottom: false
      }
    },
    //首页
    {
      path: '/home',
      component: function (resolve) {
        require(['../components/home/home.vue'], resolve)
      },
      meta: {
        title: '南沙区来穗人员服务管理局',
        showBottom: false
      }
    },
    //登录
    {
      path: '/login',
      component: function (resolve) {
        require(['../components/home/login.vue'], resolve)
      },
      meta: {
        title: '登录',
        showBottom: false
      }
    },
    //注册
    {
      path: '/register',
      component: function (resolve) {
        require(['../components/home/register.vue'], resolve)
      },
      meta: {
        title: '注册',
        showBottom: false
      }
    },
    //找回密码
    {
      path: '/findPassWord',
      component: function (resolve) {
        require(['../components/home/findPassWord.vue'], resolve)
      },
      meta: {
        title: '找回密码',
        showBottom: false
      }
    },
    //登记--基本信息
    {
      path: '/step1/:comGuid/:alipayAcount',
      component: function (resolve) {
        require(['../components/residencePermit/step1.vue'], resolve)
      },
      meta: {
        title: '居住信息登记',
        showRight: true,
        text: '下一步'
      }
    },
    //登记--基本信息回填
    {
      path: '/step1Detailed/:comGuid/:alipayAcount',
      component: function (resolve) {
        require(['../components/residencePermit/step1Detailed.vue'], resolve)
      },
      meta: {
        title: '居住信息登记',
        showRight: true,
        text: '下一步'
      }
    },
    //登记--其他信息
    {
      path: '/step2/:idNo',
      component: function (resolve) {
        require(['../components/residencePermit/step2.vue'], resolve)
      },
      meta: {
        title: '居住信息登记',
        showRight: true,
        text: '下一步'
      }
    },
    //登记--其他信息回填
    {
      path: '/step2Detailed/:idNo',
      name: 'step2Detailed',
      component: function (resolve) {
        require(['../components/residencePermit/step2Detailed.vue'], resolve)
      },
      meta: {
        title: '居住信息登记',
        showRight: true,
        text: '下一步'
      }
    },
    //登记--街道办理
    {
      path: '/step3/:idNo',
      component: function (resolve) {
        require(['../components/residencePermit/step3.vue'], resolve)
      },
      meta: {
        title: '南沙区居住登记结果'
      }
    },
    //居住证办理-预约
    {
      path: '/appointment/:idNo',
      component: function (resolve) {
        require(['../components/residencePermit/appointment.vue'], resolve)
      },
      meta: {
        title: '南沙区居住证办理预约'
      }
    },
    //居住证办理-预约结果
    {
      path: '/appointmentResult/:idNo',
      component: function (resolve) {
        require(['../components/residencePermit/appointmentResult.vue'], resolve)
      },
      meta: {
        title: '南沙区居住证办理预约'
      }
    },
    //积分入户
    {
      path: '/integralHome',
      component: function (resolve) {
        require(['../components/residencePermit/integralHome.vue'], resolve)
      },
      meta: {
        title: '居住证'
      }
    },
    //积分入学
    {
      path: '/integralSchool',
      component: function (resolve) {
        require(['../components/home/integralSchool.vue'], resolve)
      },
      meta: {
        title: '积分入学'
      }
    },
    //积分入住
    {
      path: '/integralIn',
      component: function (resolve) {
        require(['../components/home/integralIn.vue'], resolve)
      },
      meta: {
        title: '积分入住'
      }
    },
    //新闻详情
    {
      path: '/newsDetail/:newsId',
      component: function (resolve) {
        require(['../components/home/newsDetail.vue'], resolve)
      },
      meta: {
        title: '南沙区来穗人员服务管理局'
      }
    },
    //404页面
    {
      path: '/error',
      component: function (resolve) {
        require(['../components/home/error.vue'], resolve)
      },
      meta: {
        title: '系统维护'
      }
    },
    //文件上传
    {
      path: '/fileUploader',
      component: function (resolve) {
        require(['../components/residencePermit/fileUploader.vue'], resolve)
      },
      meta: {
        title: '居住证申领'
      }
    },
    //积分兑换首页
    {
      path: '/integralExchange',
      component: function (resolve) {
        require(['../components/integral/integralExchange.vue'], resolve)
      },
      meta: {
        title: '积分兑换',
        showRight: true,
        text: '下一步'
      }
    },
    //积分兑换页
    {
      path: '/exchangeing/:goodsid',
      component: function (resolve) {
        require(['../components/integral/exchangeing.vue'], resolve)
      },
      meta: {
        title: '积分兑换'
      }
    },
    //积分兑换记录
    {
      path: '/exchangeRecord',
      component: function (resolve) {
        require(['../components/integral/exchangeRecord.vue'], resolve)
      },
      meta: {
        title: '积分兑换记录'
      }
    },
    //积分兑换记录详情
    {
      path: '/exchangeDetails/:orderid',
      component: function (resolve) {
        require(['../components/integral/exchangeDetails.vue'], resolve)
      },
      meta: {
        title: '兑换记录详情'
      }
    },
    //政策法规列表
    {
      path: '/policyLaw',
      component: function (resolve) {
        require(['../components/policy/policyLaw.vue'], resolve)
      },
      meta: {
        title: '政策法规列表'
      }
    },
    //政策法规列表详情
    {
      path: '/policylawDetail/:newsId',
      component: function (resolve) {
        require(['../components/policy/policylawDetail.vue'], resolve)
      },
      meta: {
        title: '政策法规列表详情'
      }
    },
    {
      path: '/reminder',
      component: function (resolve) {
        require(['../components/home/reminder.vue'], resolve);
      },
      meta: {
        title: '南沙区来穗人员服务管理局'
      }
    },
    //社保查询
    {
      path: '/social/:idCard',
      component: function (resolve) {
        require(['../components/social/social.vue'], resolve);
      },
      meta: {
        title: '社保查询'
      }
    },
    {
      path: '/paymentdetails/:idCard',
      component: function (resolve) {
        require(['../components/social/paymentdetails.vue'], resolve);
      },
      meta: {
        title: '缴费明细'
      }
    },
    {
      path: '/paymentstatus/:idCard',
      component: function (resolve) {
        require(['../components/social/paymentstatus.vue'], resolve);
      },
      meta: {
        title: '缴费状态'
      }
    },
  ]
})
