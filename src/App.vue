<template>
  <div id="app">
    <!--<keep-alive include="step1, step2, step1Detailed, step2Detailed"></keep-alive>&lt;!&ndash;发现组件做了缓存之后，组件在切换时动画效果更佳&ndash;&gt;-->

      <transition :name="`slide-${direction == 1 ? 'in' : 'out'}`">
          <router-view  v-wechat-title="$route.meta.title" img-set="/"></router-view>
      </transition>


    <toast v-model="toastShow" type="text" :time="2000" :width="toastWidth" is-show-mask :text="toastMsg" position="middle" @on-hide="onHide"></toast>

    <Loading :show="loadingShow"></Loading>
  </div>
</template>

<script>

  import Loading  from './components/common/Loading.vue'
  import { mapState } from 'vuex';
  import { Toast} from 'vux'
  export default {
    components: {Loading,Toast},
    data() {
      return {
      };
    },
    computed: {
      ...mapState([
        'loadingShow','toastShow','toastMsg','toastWidth','direction'
      ])
    },
    created() {
      this.$store.commit('UPDATE_LOADING', true);
    },
    mounted(){
      this.$router.beforeEach((to, from, next) => {
        this.$store.commit('UPDATE_LOADING', true);
        next()
      });
      this.$router.afterEach((to) => {
        this.$store.commit('UPDATE_LOADING', false);
      })

//      本来是要做监控后台发来的数据的
//      if (webSocket in window) {
//        var webSocket = new WebSocket("ws://192.168.13.48:8080/cnLaiSui/mobile/websocket");
//        //监听窗口关闭事件，当窗口关闭时，主动去关闭webSocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
//        window.onbeforeunload = function () {
//          webSocket.close();
//        }
//        webSocket.addEventListener('open', () => {     // 链接服务器成功回调
//          console.log('链接服务器成功')
//        }, false)
//        webSocket.addEventListener('message', (event) => {  // 监听服务器推送的信息
//          console.log(event.data)
//        }, false)
//        webSocket.addEventListener('error', (event) => {
//          console.log('error', event)
//        })
//      }


    },
    watch: {
      // 监视路由，参数为要目标路由和当前页面的路由
      '$route' (to, from){
          if (window.AlipayJSBridge) {

            if (/step1|step2/g.test(to.path)) {
              AlipayJSBridge.call('setOptionMenu', {
                title : '下一步',
                redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
                color : '#2a333c', // 必须以＃开始ARGB颜色值
              });
            }
            else if (/step3|returnStatus/g.test(to.path)) {
              AlipayJSBridge.call('setOptionMenu', {
                title : '首页',
                redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
                color : '#2a333c', // 必须以＃开始ARGB颜色值
              });
            }
            else {
              AlipayJSBridge.call('setOptionMenu', {
                title : '  ',
                redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
                color : '#2a333c', // 必须以＃开始ARGB颜色值
              });
            }


//            else if (/fileUploader/g.test(to.path)) {
//              AlipayJSBridge.call('setOptionMenu', {
//                title : '返回',
//                redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
//                color : '#2a333c', // 必须以＃开始ARGB颜色值
//              });
//            }
            // else {
              
            //   AlipayJSBridge.call('setOptionMenu', {
            //     reset: true,
            //   });
            //   AlipayJSBridge.call('setTitle', {title: to.meta.title});
            // }
            AlipayJSBridge.call('showOptionMenu');
          }
      }
    },
    methods: {
      onHide () {
        this.$store.commit('CLEARSHOWTOAST', false);
      }
    },



    
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
#app{width:100%;height:100%;}

.slide-in-enter-active,.slide-in-leave-active,.slide-out-enter-active,.slide-out-leave-active{
  will-change: transform;
  transition: all 250ms;
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

// 页面从左侧滑入
.slide-in-enter{
  transform: translate3d(100%,0,0);
}
.slide-in-leave-to{
  transform: translate3d(-100%,0,0);
}

// 页面从右侧滑入
.slide-out-enter{
  transform: translate3d(-100%,0,0);
}
.slide-out-leave-to{
  transform: translate3d(100%,0,0);
}
</style>
