<template>
  <div class="template_container">

    <scroller lock-x ref="wrapper" height="-40px">
      <div class="box2">
        <!--居住证-->
        <div :class="['card_cont', active == 1 ? 'active' : '']">
          <ul class="cont">
            <li>
              <span>来穗人员服务 | 积分卡</span>
              <span>出租屋等级<img v-for="item in 3" class="star_icon" src="../../../static/images/icon_start.png"></span>
            </li>
            <li>
              <span>激活立享受来穗服务</span>
              <span @click="goActive">{{active == 2 ? '待审核' : '我要激活'}}</span>
            </li>
            <li>
              <span>{{decodeURI($route.query.name)}}</span>
              <span>{{$route.query.idCard}}</span>
              <span>{{decodeURI($route.query.address)}}</span>
            </li>
            <li v-show="false"><span>积分</span><span>278</span></li>
          </ul>
        </div>

        <div class="title_cont">来穗服务</div>
        <div class="link_bar_cont" ref="linkBar">
          <a @click="certFace">
            <img src="../../../static/images/icon_base.jpg">
            <span>居住登记</span>
            <span>来穗人员信息登记</span>
           </a>
          <template>
            <a v-if="active == 1" href="/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=2&innerType=1&homeType=lspy_&type=1">
              <img src="../../../static/images/icon_idcard.png">
              <span>居住证</span>
              <span>居住证申领/续签</span>
            </a>
            <a v-else>
              <img src="../../../static/images/icon_idcard.jpg">
              <span>居住证</span>
              <span>居住证申领/续签</span>
            </a>
          </template>

          <!--<router-link to="/integralSchool">-->
            <!--<img src="../../../static/images/icon_integra_home.jpg">-->
            <!--<span>房屋租赁</span>-->
            <!--<span>来穗人员入户评测</span>-->
          <!--</router-link>-->
          <a>
            <img src="../../../static/images/icon_integra_home_active.jpg">
            <span>房屋租赁</span>
            <span>房屋出租/发布</span>
          </a>
          <template>
            <a v-if="true" href="/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=2&innerType=1&homeType=lspy_&type=2">
              <img src="../../../static/images/icon_integra_school_active.png">
              <span>积分服务</span>
              <span>积分入学/入户</span>
            </a>
            <a v-else>
              <img src="../../../static/images/icon_integra_school.jpg">
              <span>积分服务</span>
              <span>积分入学/入户</span>
            </a>
          </template>

        </div>
        <div class="title_cont">特色专区</div>
        <div class="link_bar_cont" ref="linkBar">
          <router-link :to="`/integralExchange/${$route.query.idCard}/${decodeURI($route.query.name)}`">
            <img src="../../../static/images/icon_integra_active.jpg">
            <span>积分兑换</span>
            <span>20元话费天天抽</span>
          </router-link>
          <!--<router-link to="/policyLaw">-->
            <!--<img src="../../../static/images/icon_integra.jpg">-->
            <!--<span>政策法规</span>-->
            <!--<span>学法、守法、遵法</span>-->
          <!--</router-link>-->
          <!--<a>-->
            <!--<img src="../../../static/images/icon_integra.jpg">-->
            <!--<span>积分兑换</span>-->
            <!--<span>20元话费天天抽</span>-->
          <!--</a>-->
          <a>
            <img src="../../../static/images/icon_policy.png">
            <span>政策法规</span>
            <span>学法、守法、遵法</span>
          </a>
        </div>
      </div>
    </scroller>

    <ul class="btom_cont">
      <li>番禺区来穗人员服务管理局</li>
      <li>服务电话：<a href="tel:020-84691533">020-84691533</a></li>
    </ul>

    <!--由于调支付宝扫脸接口缓慢，这个东东是为了防止重点用-->
    <div v-if="showloading" class="layout"></div>

  </div>
</template>
<script>
  import api from '../../api/api'
  import {Scroller} from 'vux'
  import { mapState } from 'vuex'
  export default {
    name: 'home',
    components: {Scroller},
    data() {
      return {
        showloading: false,
        comGuid: this.$route.query.comGuid,
        active: this.$route.query.active, // 居住证激活专题，1：激活，2：未激活
      }
    },
    computed: {
      ...mapState([
        'loadingShow','idNo'
      ])
    },
    methods: {
      goActive () {
        location.href = '/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&homeType=lspy_&innerType=1&type=1'
      },
      goIntegraHome () {  // 前往居住证
        if (this.idNo) {  // 先检测用户是否已经在来穗局登记了
          api.applyResidence(this.idNo).then((res) => {
            if (res.data.success) { // 后台进行登陆操作成功
                const data = JSON.parse(res.data.jsonRes)
                if (data.ackCode == 1) {  // 后台登陆成功，直接跳转居住证首页
//                  this.$router.push({path:'/login',query: {userDone: 1, idNo: this.idNo}});
                  this.$router.push({path:'/integralHome',query: {idNo: this.idNo}});
                } else { // 后台登陆不成，跳转到登陆页面
                  this.$router.push({path:'/login',query: {idNo: this.idNo}});
                }
            } else { //
              this.$router.push({path:'/login'});
            }
          });
        } else {
          this.$store.commit('SHOWTOAST', '请先登记居住信息！');
        }
      },
      certFace () {
        this.$store.commit('UPDATE_LOADING', true);
        this.showloading = true
        location.href = "/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&innerType=1&homeType=lspy_&type=1"
      }
    },
    mounted(){
      this.$store.commit('UPDATE_ID_NO', this.$route.query.idCard)
    },
    destroyed () {
      this.showloading = false
    }
  }
</script>

<style lang="less" scoped>

  .home_header{width: 100%;margin: 0 auto;line-height: 1rem;height: 1rem; font-size: 0.35rem;text-align: center;color: #25303c;}
  .card_cont{
    width:6.68rem;height:4.39rem;margin: .26rem auto 0 auto;background: url(../../../static/images/card_bg.jpg) no-repeat center top;background-size: 100% auto;
    .cont{
      width:5.9rem;height:3.63rem;margin:0 auto;color: #ffffff;position: relative;
      span{display: block;}
      li:nth-of-type(1){
        span{display:inline-block;height:.97rem;line-height:1rem;font-size: .24rem;color: #fefffe;}
        span:last-of-type{float: right;display: none;}
        .star_icon{width:.25rem;height:.25rem;margin-left: .1rem;}
      }
      li:nth-of-type(2){
        span{width:100%;display:block;margin:0 auto;font-size: .33rem;color: #fefffe;text-align:center;}
        span:last-of-type{width: 2.3rem;height: .93rem;margin-top:.33rem;line-height:.93rem;border-radius: 0.08rem;border: 1px solid #ffffff;}
      }
      li:nth-of-type(3){
        display: none;
        span:nth-of-type(1){margin:.05rem 0 .07rem 0;font-size: .49rem;color: #fefffe;}
        span:nth-of-type(2){font-size: .29rem;color: #fefffe;}
        span:nth-of-type(3){margin-top:.43rem;font-size: .24rem;color: #cbeaff;}
      }
      li:nth-of-type(4){
        width: 1.26rem;height: 1.26rem;border: solid .02rem #ffffff;border-radius:1000px;position: absolute;right:0;top:1.07rem;font-size: .22rem;text-align: center;display: none;
        span:first-of-type{margin-top:.2rem;}
        span:last-of-type{font-size: .39rem;color: #fefffe;line-height: .48rem}
      }
    }
  }
  .card_cont.active li:nth-of-type(3),.card_cont.active li:nth-of-type(4),.card_cont.active li:nth-of-type(1) span:last-of-type{display: block;}
  .card_cont.active li:nth-of-type(2){display: none;}

  .title_cont{width: 100%;height: .68rem;line-height:.68rem;background-color: #f5f5f5;text-indent:.3rem;font-size: .3rem;color: #5a6570;}

  /*linkBar*/
  .link_bar_cont{
    width:7rem;margin:0 auto;padding:.16rem 0 .49rem 0;overflow: hidden;background: #fff;
    a{
      display: block;float:left;width:3.5rem;margin:.37rem 0;font-size: .25rem;color:#4a5560;position: relative;
      img{width:.85rem;height:.85rem;float: left;}
      span{width:2.65rem;display: block;text-indent: .28rem;}
      span:first-of-type{font-size: .3rem;float:right;color: #2a333c;}
      span:last-of-type{font-size: .25rem;float:right;color: #4a5560;}
    }
  }
  /*tabBar*/
  .tab_bar{width:100%;height:1.05rem;overflow: hidden;}

  .btom_cont{
    width:100%;height:40px;overflow:hidden;text-align: center;background: #FAFAFA;position: fixed;bottom: 0;left:0;
    li{font-size: 12px;line-height:16px;color:#A1ACB5;}
    li:first-of-type{margin-top:4px;}
    a{color:#0B8FF4;}
  }
  .layout{width:100%;height:100%;overflow: hidden;position: fixed;left:0;top:0; z-index: 99999999999999;}

</style>
