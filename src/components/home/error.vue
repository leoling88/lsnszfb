<template>
    <div class="template_container">
        <div class="error">
          <img src="../../../static/images/error2.jpg" alt="">
          <p>对不起，因系统维护<br/>服务暂不可用，请稍候再试</p>

          <!--<router-link :to="`/home`" class="check_detail_btn" style="margin-top:.6rem;">返回首页</router-link>-->
          <a href="/cnLaiSui/mobile/laisuiHomeIndex?homeType=lsns_" class="check_detail_btn" >返回首页</a>
        </div>
    </div>
</template>
<script>
  import {XButton} from 'vux'
  import api from '../../api/api'
  export default {
    components: {XButton},
    data() {
      return {

      }
    },
    methods: {
    },
    mounted(){
    }
  }
</script>
<style scoped lang="less">
  .error{margin:3rem auto 0;text-align:center;
    img{width:3.61rem;height:2.84rem}
    p{font-size:.3rem;color:#2b2b2b;}
  }
</style>
