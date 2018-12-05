import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
  routes: [
    //首页
    {
      path: '/',
      component: function (resolve) {
        require(['../components/home/home.vue'], resolve);
      },
      meta: {
        title: '番禺区来穗人员服务管理局',
        // showBottom: false
      }
    },
    //入口首页
    {
      path: '/homePage',
      component: function (resolve) {
        require(['../components/home/homePage.vue'], resolve);
      },
      meta: {
        title: '番禺区来穗人员服务管理局',
        // showBottom: false
      }
    },
    //支付宝扫脸后跳转
    {
      path: '/alipayPage/:idCard',
      component: function (resolve) {
        require(['../components/home/alipayPage.vue'], resolve);
      },
      meta: {
        title: '温馨提示',
        showBottom: false
      }
    },
    //登录
    {
      path: '/login',
      component: function (resolve) {
        require(['../components/home/login.vue'], resolve);
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
        require(['../components/home/register.vue'], resolve);
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
        require(['../components/home/findPassWord.vue'], resolve);
      },
      meta: {
        title: '找回密码',
        showBottom: false
      }
    },
    //登记--基本信息
    {
      path: '/step1/:idCard/:userStyle',  // ===旧支付宝  '/step1/:comGuid/:alipayAcount',
      component: function (resolve) {
        require(['../components/residencePermit/step1.vue'], resolve);
      },
      meta: {
        title: '居住信息登记',
        showRight: true,
        text: '下一步'
      }
    },
    //登记--基本信息回填
    {
      path: '/step1Detailed/:idCard',
      //  == 支付宝   path: '/step1Detailed/:comGuid/:alipayAcount',
      component: function (resolve) {
        require(['../components/residencePermit/step1Detailed.vue'], resolve);
      },
      meta: {
        title: '居住信息登记',
        showRight: true,
        text: '下一步'
      }
    },
    //登记--其他信息
    {
      //path: '/step2/:idNo',
      path: '/step2/:idCard',
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
      //path: '/step3/:idNo',
      path: '/step3/:idCard',
      component: function (resolve) {
        require(['../components/residencePermit/step3.vue'], resolve)
      },
      meta: {
        title: '居住登记结果'
      }
    },
    //EMS 支付结果
    {
      path: '/payResult',
      component: function (resolve) {
        require(['../components/residencePermit/payResult.vue'], resolve)
      },
      meta: {
        title: '支付结果'
      }
    },
    //EMS 确认支付
    {
      path: '/payConfirm',
      component: function (resolve) {
        require(['../components/residencePermit/payConfirm.vue'], resolve)
      },
      meta: {
        title: '确认支付'
      }
    },
    //已办理进度查询
    {
      path: '/transactProgress',
      component: function (resolve) {
        require(['../components/residencePermit/transactProgress.vue'], resolve)
      },
      meta: {
        title: '已办理进度查询'
      }
    },
    //居住证办理-预约
    {
      path: '/appointment/:idNo',
      component: function (resolve) {
        require(['../components/residencePermit/appointment.vue'], resolve)
      },
      meta: {
        title: '居住证办理预约'
      }
    },
    //居住证办理-预约结果
    {
      path: '/appointmentResult/:idNo',
      component: function (resolve) {
        require(['../components/residencePermit/appointmentResult.vue'], resolve)
      },
      meta: {
        title: '居住证办理预约'
      }
    },
    //积分入户
    {
      path: '/integralHome',
      component: function (resolve) {
        require(['../components/residencePermit/integralHome.vue'], resolve)
      },
      meta: {
        title: '居住证申领/续签'
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
        title: ''
      }
    },
    //404页面
    {
      path: '/error',
      component: function (resolve) {
        require(['../components/home/error.vue'], resolve)
      },
      meta: {
        title: '系统错误'
      }
    },
    //发现
    {
      path: '/discovery',
      component: function (resolve) {
        require(['../components/discovery/discovery.vue'], resolve)
      },
      meta: {
        title: ''
      }
    },
    //文件上传
    {
      path: '/fileUploader',
      component: function (resolve) {
        require(['../components/residencePermit/fileUploader.vue'], resolve)
      },
      meta: {
        title: '居住证申领/续签'
      }
    },
    //积分兑换首页
    {
      path: '/integralExchange/:idCard/:name',
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
      path: '/exchangeing/:goodsid/:idCard',
      component: function (resolve) {
        require(['../components/integral/exchangeing.vue'], resolve)
      },
      meta: {
        title: '积分兑换'
      }
    },
    //积分兑换记录
    {
      path: '/exchangeRecord/:idCard',
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
        title: ''
      }
    },
    //政策法规列表详情
    {
      path: '/policylawDetail/:newsId',
      component: function (resolve) {
        require(['../components/policy/policylawDetail.vue'], resolve)
      },
      meta: {
        title: ''
      }
    },
    //积分服务个人信息
    {
      path: '/personInfor',
      component: function (resolve) {
        require(['../components/integralServices/personInfor.vue'], resolve)
      },
      meta: {
        title: '个人信息'
      }
    },
    //积分服务上传资料
    {
      path: '/uploadData',
      component: function (resolve) {
        require(['../components/integralServices/uploadData.vue'], resolve)
      },
      meta: {
        title: '上传资料'
      }
    },
    //积分服务积分中心
    {
      path: '/integralzhxin',
      component: function (resolve) {
        require(['../components/integralServices/integralzhxin.vue'], resolve)
      },
      meta: {
        title: '上传资料'
      }
    },
    //积分服务积分确认
    {
      path: '/integralQueren',
      component: function (resolve) {
        require(['../components/integralServices/integralQueren.vue'], resolve)
      },
      meta: {
        title: '积分确认'
      }
    },
    //签注资格校验by20180920liyp
    {
      path: '/returnStatus/:idCard/:cid',
      component: function (resolve) {
        require(['../components/visa/returnStatus.vue'], resolve)
      },
      meta: {
        title: '资格校验',
        allowBack: false
      }
    },


    //续签0--签注须知
    {
      path: '/jzz',
      component: function (resolve) {
        require(['../components/visa/jzzhome.vue'], resolve);
      },
      meta: {
        title: '番禺区居住证',

      }
    },


    //续签1--签注须知
    {
      path: '/notes/:idCard/:openid/:name',
      component: function (resolve) {
        require(['../components/visa/notes.vue'], resolve)
      },
      meta: {
        title: '签注居住证须知'
      }
    },
    //续签2--资格校验
    {
      path: '/qualifyCheck1/:idCard/:openid/:name',
      component: function (resolve) {
        require(['../components/visa/qualifyCheck1.vue'], resolve)
      },
      meta: {
        title: '签注资格校验'
      }
    },
    //续签3--资格校验2
    {
      path: '/qualifyCheck2/:idCard/:openid/:name/:cid',
      component: function (resolve) {
        require(['../components/visa/qualifyCheck2.vue'], resolve)
      },
      meta: {
        title: '签注资格校验'
      }
    },    
    //手机验证
    // {
    //   path: '/phoneCheck',
    //   component: function (resolve) {
    //     require(['../components/visa/phoneCheck.vue'], resolve)
    //   },
    //   meta: {
    //     title: '手机验证'
    //   }
    // },

    //续签4--确认申请信息
    {
      path: '/qualifyCheck3/:idCard/:openid/:name/:cid/:getway',
      component: function (resolve) {
        require(['../components/visa/qualifyCheck3.vue'], resolve)
      },
      meta: {
        title: '确认申请信息'
      }
    },
    //续签5--申领步骤1
    {
      path: '/claimsFor/:idCard/:openid/:name/:cid/:getway',
      component: function (resolve) {
        require(['../components/visa/claimsFor.vue'], resolve)
      },
      meta: {
        title: '申领居住证方式'
      }
    },
    //续签6--提交身份证明类别
    {
      path: '/qualifyCheck4/:idCard/:openid/:name/:cid/:getway',
      component: function (resolve) {
        require(['../components/visa/qualifyCheck4.vue'], resolve)
      },
      meta: {
        title: '上传身份证明材料'
      }
    },


    //续签7--申领条件 提交提交图片证明
    {
      path: '/qualifyCheck5/:idCard/:openid/:name/:cid/:getway',
      component: function (resolve) {
        require(['../components/visa/qualifyCheck5.vue'], resolve)
      },
      meta: {
        title: '上传签注证明材料'
      }
    },
    //续签8--合法居住类型 提交提交图片证明
    // {
    //   path: '/qualifyCheck6/:idCard',
    //   component: function (resolve) {
    //     require(['../components/visa/qualifyCheck6.vue'], resolve)
    //   },
    //   meta: {
    //     title: '上传签注证明材料'
    //   }
    // },
    //续签000--提交申请
    {
      path: '/qualifyCheck6/:idCard/:openid/:name/:cid/:getway',
      component: function (resolve) {
        require(['../components/visa/qualifyCheck6.vue'], resolve)
      },
      meta: {
        title: '确认申请信息'
      }
    },


    //续签8--居住登记变更
    {
      path: '/recordChange/:idCard/:openid/:name/:cid',
      component: function (resolve) {
        require(['../components/visa/recordChange.vue'], resolve)
      },
      meta: {
        title: '居住登记变更'
      }
    },
    //续签9--办理进度
    {
      path: '/progressBar/:idCard/:cid',
      component: function (resolve) {
        require(['../components/visa/progressBar.vue'], resolve)
      },
      meta: {
        title: '办理进度'
      }
    },
    //续签10--服务站信息
    {
      path: '/serverlists/:idCard',
      component: function (resolve) {
        require(['../components/visa/serverlists.vue'], resolve)
      },
      meta: {
        title: '番禺区服务站信息'
      }
    },


  ]
})
