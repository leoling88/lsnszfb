import Vue from 'vue'
import router from '../router/index'
import utils from '../script/utils'

Vue.use(router)
Vue.use(utils)

export default{
  install(Vue){
    Vue.prototype.$Error=function(error){
      //debugger;
      // console.log(error);
      if(typeof error.response !=="object") return;
      let state = error.response.status;
      if (state == 400) {//接口抛出400错误
        var errDate=JSON.parse(error.response.request.responseText);
        var req =utils.base64encode('state=0&title='+escape(errDate.msg)+'&msg=');
        router.push({ path: '/systemTip',query: { req: req }})
      }else if(state == 404){//请求路径错误！
        router.push({ path: '/nofind'})
      }else if(state == 415){//请求路径或者请求参数错误！
        var req =utils.base64encode('state=0&title='+escape('请求参数错误')+'&msg='+escape('请仔细检查接口请求的路径和请求参数'));
        router.push({ path: '/systemTip',query: { req: req }})
      }else{
        router.push({ path: '/networkAnomaly' })//网络异常跳转
      }

    }
  }
}









