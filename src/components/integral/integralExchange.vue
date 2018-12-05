<template>
  <div class="template_container" style="background: #F6F5F5;">
    <scroller lock-x ref="wrapper" :use-pullup="true" :pullup-config="pullupConfig" @on-pullup-loading="infinite">
      <div style="padding-bottom:1rem;">
        <div class="top_cont">
          <div class="my_integral">
            <span>{{jifen}}</span><span>我的积分</span>
          </div>
          <router-link :to="`/exchangeRecord/${$route.params.idCard}`" class="integral_exchange_record"><img src="../../../static/images/icon_integral.png"/>兑换记录</router-link>
        </div>
        <div class="title_cont">精选推荐</div>

        <!--精品推荐-->
        <ul class="recommend_cont">
          <li v-for="item in integralist">
            <router-link :to="`/exchangeing/${item.goodsid}/${$route.params.idCard}`">
              <div class="pic_box"><img :src="item.littlepic" alt=""></div>
              <span>{{item.goodstitle}}</span>
              <span>积分：<em>{{item.integration}}</em></span>
              <span>库存：<em>{{item.stock}}</em></span>
            </router-link>
          </li>
        </ul>
        <div class="bottomLine" v-if="showBtline">暂无数据</div>
      </div>
    </scroller>

  </div>
</template>
<script>
  import api from '../../api/api'
  import {Scroller} from 'vux'
  export default {
    components: {Scroller},
    data() {
        return {
          integralist:[],
          jifen:'',
          currentPage: 1,
          idCard:this.$route.params.idCard,
          name:this.$route.params.name,
          showBtline:false,
          pullupConfig:{
            content: '正在努力加载...',
            pullUpHeight: 60,
            height: 40,
            autoRefresh: false,
            downContent: '',
            upContent: '请上拉刷新数据',
            loadingContent: '加载中...',
            clsPrefix: 'xs-plugin-pullup-'
          },
        }
    },
    methods: {
      infinite() { // 上拉加载
        this.currentPage ++;
        console.log('上拉加载',this.currentPage);
        this.goodsList(this.currentPage);
      },
      goodsList (pageIndex) {  // 积分列表
        api.goodsList(pageIndex).then((res) => {
          if (res.data.success) {
            this.pullupConfig.content = '请上拉刷新数据';
            if (pageIndex == 1){
              this.integralist = res.data.jsonRes;
            } else if(res.data.jsonRes.length > 0) {
                this.integralist = this.integralist.concat(res.data.jsonRes);
            }
            this.$refs.wrapper.donePullup();//设置上拉刷新操作完成，在数据加载后执行
          }
          this.$refs.wrapper.reset();
          if(res.data.jsonRes.length <= 0) {
            this.$refs.wrapper.disablePullup();
            this.showBtline = true;
          }else {
          }
        })
      },
      selectJiFen () {  // 我的积分
        api.selectJiFen({
          userId: this.idCard,
          name:this.name
        }).then((res) => {
          this.jifen = res.data.jsonRes[0].jifen;
        })
      },
    },
    created(){

    },
    mounted(){
      //第一次加载
      this.goodsList(this.currentPage);
      this.selectJiFen();
      this.$nextTick(() => {
        this.$refs.wrapper.reset();
      })
      console.log('556',this.idCard);
    }
  }
</script>
<style scoped lang="less">
  .home_header{width: 100%;margin: 0 auto;line-height: 1rem;height: 1rem; font-size: 0.36rem;text-align: center;color: #2a333c;background: #fff;}
  .top_cont{
    width:100%;height:1.78rem;background:url(../../../static/images/integral_bg.jpg) no-repeat center top;background-size: 100%;position: relative;
    .my_integral{
      width:50%;float:left;padding-top:.4rem;overflow: hidden;text-align: center;color: #fff;
      span{display: block;font-size: .3rem;}
      span:first-child{font-size: .58rem;line-height: .69rem;}
    }
    .integral_exchange_record{
      width:50%;padding-top:.52rem;display:block;float: right;color: #fff;text-align: center;line-height: .69rem;font-size: .3rem;
      img{width:.46rem;height:.46rem;display: block; margin: 0 auto;}
    }
  }
  .title_cont{
    width: 100%;overflow:hidden;line-height:.8rem;background-color: #f5f5f5;text-indent:.3rem;font-size: .3rem;color: #5a6570;}
  .recommend_cont{width:100%;overflow: hidden;
    li{
      width:3.28rem;height:4.4rem;margin-bottom:.3rem;background: #fff;border:1px solid #F2F3F2;
      .pic_box{
        width:2.57rem;height:2.56rem;background:url("../../assets/images/moren.png") no-repeat center center;background-size:cover;margin:.34rem auto 0 auto;overflow:hidden;text-align: center;display: flex;align-items: center;justify-content: center;
        img{height:100%;width:100%;}
      }
      span{width:2.57rem;margin:.1rem auto 0 auto;overflow:hidden;display: block;color:#2a333c;font-size: .3rem;line-height: .35rem;text-overflow: ellipsis;
        display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow:hidden;}
      span{
         em{font-style: normal;color:#ff575a;font-size: .28rem;}
       }
      span:nth-of-type(1){margin-top:.17rem;}

    }
    li:nth-child(odd){float: left;border-left:0;margin-left:.3rem;}
    li:nth-child(even){float: right;border-right:0;margin-right:.3rem;}
  }
  .bottomLine{color:#666;text-align:center;margin:10px 0;}
</style>
