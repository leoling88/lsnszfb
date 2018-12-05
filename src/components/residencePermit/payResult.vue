<template>
    <div class="template_container">

      <!--支付成功-->
      <dl class="result_cont" v-if="result == 1">
        <dt><img src="../../../static/images/icon_success.png" alt=""></dt>
        <dd>支付成功</dd>
        <!--<dd class="reback_btn">返回</dd>-->
        <!--<router-link to="/transactProgress" class="reback_btn">查看详情</router-link>-->
        <div class="reback_btn" @click="viewDetails()">查看详情</div>
      </dl>

      <!--支付失败-->
      <dl class="result_cont fail" v-else-if="result == 2">
        <dt><img src="../../../static/images/icon_fail.png" alt=""></dt>
        <dd>支付失败</dd>
        <dd>重新支付</dd>
      </dl>


    </div>
</template>
<script>
  import api from '../../api/api'
  export default {
    components: {},
    data() {
      return {
//      result: this.$route.query.result
        result: this.$router.history.current.query.result,//成功失败状态码
      }
    },
    mounted(){
		console.log(this.$router);
    },
    methods:{
    	viewDetails(){
    		const query = {
	            buyAccount:this.$router.history.current.query.buyAccount
	       }
	        this.$router.push({path: '/transactProgress',query});
    	}
    }
  }
</script>
<style scoped lang="less">
  .result_cont{
    width:100%;overflow: hidden;text-align: center;padding-top:.82rem;
    dt{line-height: .25rem;
      img{width:2.4rem;height:2.14rem;margin:auto;}
    }
    dd{font-size: .35rem;color: #333;line-height: .35rem;}
    .reback_btn{width:3.76rem;height:.92rem;display:block;margin:1.22rem auto 0 auto;border-radius: .16rem;border: solid 1px #448aff;font-size: .35rem;line-height:.92rem;color: #448aff;}
  }
  .fail dd:last-of-type{width:3.76rem;height:.92rem;margin:1.82rem auto 0 auto;border-radius: .16rem;border: solid 1px #fd7e14;font-size: .35rem;line-height:.92rem;color: #fd7e14;}
</style>
