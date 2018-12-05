<template>
    <div class="template_container">
      <scroller lock-x>
        <div>
          <div class="item_cont" v-for="(item,index) in tranList"  @click="toggle(index)">
          	<!--居住证续期/办理-->
            <div class="item_tit">
              <div class="icon"> <img src="../../../static/images/icon_integral_card_active.jpg" /></div>
              <div class="text">
                <strong v-if="item.CourierAim == 0">居住证续期</strong>
                <strong v-if="item.CourierAim == 1">居住证办理</strong>
                <span>{{item.address}}</span>
              </div>
              <div class="date">{{format(item.submitTime)}}</div>
            </div>
            <!--居住证续期/办理 END-->
          <!-- </div> -->
			<!--EMS快递运费支付成功-->
			<div class="progress_cont" :class="item.status ? 'progress-cont-acitve' : ''" v-show="item.status">
				<div class="icon">
					<img src="../../../static/images/icon_ems_pointer_active.jpg">
				</div>
				<div class="text">
					<strong class="success-pay" v-if="item.Paystatus == 1">EMS快递运费支付成功</strong>
					<strong class="failed-pay" v-if="item.Paystatus == 2">EMS快递运费支付失败</strong>
					<span>{{format2(item.Paytime)}}</span>
				</div>
				<div class="btn" v-if="item.Paystatus == 2">
					<router-link to="/payConfirm" class="repay_btn">重新支付</router-link>
				</div>
				<div class="tranLine2 tranLine"></div>
				<div class="tranLine"></div>
			</div>
			<!--EMS快递运费支付成功 END-->
			
			<!--提交-->
			<div class="progress_cont" :class="item.status ? 'progress-cont-acitve' : ''"  v-show="item.status">
				<div class="icon">
					<img src="../../../static/images/icon_ems_pointer_visited.jpg">
				</div>
				<div class="text">
					<strong>提交</strong>
					<span>{{format2(item.submitTime)}}</span>
				</div>
				<div class="tranLine"></div>
			</div>
			<!--提交 END-->
          </div>
        </div>
      </scroller>
    </div>
</template>
<script>
  import {Scroller} from 'vux'
  import api from '../../api/api'
  import moment from 'moment'
  export default {
    components: {Scroller},
    data() {
      return {
        result: 1,
        smallshow:0,
        lastLnshow:false,
        tranList:[]
        /*tranList:[
            {
                "address":"河北省唐山市路北区北京路505",
                "CourierAim":0,
                "submitTime":1529635346000,
                "Paystatus":1,
                "Paytime":1529635372000,
                "status":true
            },
            {
                "address":"210000210100110113详细地址啊",
                "CourierAim":1,
                "submitTime":1529572694000,
                "Paystatus":2,
                "Paytime":1529572717000,
                "status":false
            }
        ]*/
      }
    },
    methods: {
      	//物流信息查询
    	courierInfo () {
    		api.courierInfo({
    			buyAccount:this.$router.history.current.query.buyAccount
    			//buyAccount:'rprtul3907@sandbox.com'
    		}).then((res) => {
    			if(res.success){
    				this.tranList = res.attributes.list;
    				this.tranList.forEach((item,i) => {
    					if(i === 0){
    						item.status = true;
    					} else {
    						item.status = false;
    					}
		            });
    				console.log(this.tranList);
    			}
	        }).catch(()=>{
	          this.$store.commit('UPDATE_LOADING', false);
	        });
    	},
    	//时间格式化--YYYY-MM-DD
    	format (time) {
    		return moment(time).format("YYYY-MM-DD")
    	},
    	//时间格式化--YYYY-MM-DD hh:mm:ss
    	format2 (time) {
    		return moment(time).format("YYYY-MM-DD hh:mm:ss")
    	},
    	//切换滑块
        toggle (index) {
            this.tranList.forEach((item,i) => {
            	item.status = false;
            	if(index === i){
            		item.status = true;
            	}
            });
        }
    },
    mounted(){
		//console.log(moment(1529572694000).format("YYYY-MM-DD"));
		//console.log(this.$router.query.buyAccount);
    },
    created () {
    	//物流信息查询
      	this.courierInfo();
    }
  }
</script>
<style scoped lang="less">
  .template_container{background: #F5F5F5;}
  .item_cont{
    width:100%;overflow: hidden;background: #fff;margin:.1rem auto;box-shadow: 0px .02rem .05rem 0px rgba(166, 166, 166, 0.12);
    .item_tit{
      height: 1.42rem;background: #fff;box-shadow: 0px 1px 0px 0px rgba(166, 166, 166, 0.12);font-size: .24rem;color: #697781;
      .icon{
        width:1.22rem;float: left;
        img{width:.51rem;height:.38rem;margin:.48rem 0 0 .31rem;}
      }
      .text{
        width:4.6rem;float: left;
        strong{display: block;font-size: .35rem;color: #212c35;line-height: .35rem;margin:.3rem 0 .12rem 0;}
      }
      .date{width:1.6rem;float: left;padding-top:.25rem;}
    }
    .progress_cont{
      	height: 1.16rem;position:relative;background: #FAFAFA;font-size: .24rem;color: #697781;
      .icon{
        width:1.22rem;float: left;
        img{width:.3rem;height:.25rem;margin:.48rem 0 0 .44rem;}
      }
      .text{
        width:4rem;float: left;
        strong{font-weight:normal;display: block;font-size: .3rem;color: #697781;line-height: .35rem;margin:.3rem 0 0 0;}
        strong.success-pay{
        	color: #0091FF;
        }
        strong.failed-pay{
        	color: #FD7E14;
        }
      }
      .btn{
      	float: right;
      	width: 2rem;
      	height: .8rem;
      	margin-top: .3rem;
      	
      	.repay_btn{
      		display: inline-block;
      		width: 80%;
      		height: 80%;
      		line-height: .6rem;
      		border: 1px solid #FD7E14;
      		border-radius: .1rem;
      		text-align: center;
      		font-weight: bold;
      		color: #FD7E14;
      		font-size: .3rem;
      	}
      }
      .tranLine{width: .2rem;height: .3rem;border-left: .03rem dashed #c5dff2;position: absolute;left: .56rem;top: .85rem;}
      .tranLine2{top:.06rem;}
    }
    .progress-cont-acitve{
    	animation:moveButtom 1s 0s 1 alternate forwards;
		-webkit-animation:moveButtom 1s 0s 1 alternate forwards; /*Safari and Chrome*/
    }
    @keyframes moveButtom{
		from {opacity:0;}
		to {opacity:1;}
	}
	@-webkit-keyframes moveButtom /*Safari and Chrome*/{
		from {opacity:0;}
		to {opacity:1;}
	}
    .progress_cont:first-of-type .text strong{color: #0091ff;}
    .progress_cont:first-of-type img{display:none;}
    .progress_cont:first-of-type .firstimgShow{display:block;}
    .progress_cont:last-of-type .tranLine{top:.06rem;}
    .progress_cont:first-of-type .tranLine2,.progress_cont:last-of-type .tranLine2{display:none;}
    .progress_cont .tranLine.lastTranline{display:none;}

  }
</style>
