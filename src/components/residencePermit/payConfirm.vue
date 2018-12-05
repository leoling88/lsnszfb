<template>
  <div class="template_container">
    <scroller lock-x>
      <div>
        <dl class="result_cont" v-if="result == 1">
          <dt><img src="../../../static/images/icon_EMS_logo.png" alt=""></dt>
          <dd>
            <group>
              <cell title="金额" value="20"></cell>
              <cell title="备注" value="南沙区来穗局居住证邮寄费"></cell>
            </group>
          </dd>
        </dl>

        <x-button class="submit_btn" :disabled="false" @click.native="emsPay">确认支付</x-button>
      </div>
    </scroller>
  </div>
</template>
<script>
  import {Group, Cell, XButton, Scroller} from 'vux'
  import api from '../../api/api'
  export default {
    components: {Group, Cell,XButton, Scroller},
    data() {
      return {
      	orderId:this.$route.query.orderId,
        result: 1,
        custOrderId: '123456789'
      }
    },
    methods: {
      goPay () { // 调用支付宝收银台
        const _this = this
        this.$store.commit('SHOWTOAST', '支付成功');
        setTimeout(() => { // 模拟支付包支付成功的回调
          _this.addTripOrder(_this.custOrderId)
        }, 2500)
      },
      addTripOrder (custOrderId) { // ems新增一个订单
        api.addTripOrder({custOrderId}).then((res) => {
          const data = JSON.parse(res.data.resul)
          if (data.code == 1000) {
            console.log(data)
//            this.$router.push({path: '/payResult', query: {result: 1}})
          }

        })
      },
      //EMS支付
      emsPay(){
      	/*api.emsPay({
          custOrderId: this.orderId,
	      	orderName: 'EMS国内特快专递',
	      	price: 0.01,
	      	remark: '番禺区来穗局居住证邮寄费'
       }).then((res) => {
       	if(res.status === 200){
        	console.log(res);     	
        	console.log(res.data);     	
       	}
        })*/
        /*const query = {
          orderId:this.orderId
        }
        this.$router.push({path: '/payResult',query})*/
        window.location.href = 'http://192.168.13.18:8080/cnLaiSui/mobile/pay?custOrderId='+this.orderId+'&orderName=EMS国内特快专递&price=20&remark=番禺区来穗局居住证邮寄费'
      },
    },
    mounted(){
			//console.log(this.orderId)
			console.log(this.$router)
			//document.forms[0].submit();
    }
  }
</script>
<style scoped lang="less">
  .template_container{background: #F5F5F5;}
  .result_cont{
    width:100%;overflow: hidden;background: #fff;
    dt{
      height: 3.4rem;background: #F5F5F5;padding-top:.46rem;
      img{width:2.39rem;height:2.62rem;display:block;margin:auto;}
    }
    dd{
      width:100%;overflow: hidden;font-size: .3rem;color: #212c35;line-height: .3rem;
      .weui-cell__ft{color: #212c35;}
    }
  }
  .submit_btn{width: 7.1rem;height: .93rem;margin-top:1.03rem;line-height:.93rem;text-align:center;background-color: #448aff;border-radius: .16rem;color: #ffffff;font-size: .3rem;}
</style>
