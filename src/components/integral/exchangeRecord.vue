<template>
  <div class="template_container" style="background: #F6F5F5;">
    <scroller lock-x ref="wrapper" :use-pullup="true" :pullup-config="pullupConfig" @on-pullup-loading="infinite">
      <div style="padding-bottom:0.5rem;">
        <div class="record" v-for="item in recordList">
          <div class="record_title">
            <div class="fl">订单编号{{item.orderid}}</div>
            <div class="fr record_succ">{{item.statusName}}</div>
          </div>
          <div class="record_con">
            <div class="con_fl fl"><img :src="item.goodsList.littlepic" alt=""></div>
            <div class="con_fr fl">
              <div class="fr_text1">{{item.goodsList.goodstitle}}</div>
              <div class="fr_text2">积分消费：{{item.ointegration}}</div>
              <div class="fr_text2">兑换时间：{{item.createdate}}</div>
            </div>
          </div>
          <router-link :to="`/exchangeDetails/${item.orderid}`"><div class="find_xq">查看详情</div></router-link>
        </div>
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
          recordList:[],
          currentPage: 1,
          showBtline:false,
          idCard:this.$route.params.idCard,
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
        this.orderList(this.currentPage,this.idCard);
      },
      orderList (pageIndex,idCard) {  // 兑换列表查询
        api.orderList(pageIndex,idCard).then((res) => {
          if(res.data.success){
            if (pageIndex == 1){
              this.recordList = res.data.jsonRes
            } else if(res.data.jsonRes.length > 0) {
              this.recordList = this.recordList.concat(res.data.jsonRes);
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
    },
    created(){

    },
    mounted(){
      this.orderList(this.currentPage,this.idCard);
      this.$nextTick(() => {
        this.$refs.wrapper.reset();
      })
    }
  }
</script>
<style scoped lang="less">
  .record{
    max-width:750px;margin:0 auto;background-color:#fff;padding:.28rem .30rem .34rem .30rem;margin-top:.20rem;color:#838e99;
    overflow:hidden;position:relative;
    .record_title{
      font-size:.28rem;overflow:hidden;margin-bottom:.29rem;
      .record_succ{color:#228ae6;}
    }
    .record_con{
      width:100%;
      .con_fl{
        width:1.42rem;height:1.42rem;margin-right:.28rem;
        img{width:100%;display:block;}
      }
      .con_fr{
        width:3.80rem;
        .fr_text1{font-size:.32rem;font-weight:bold;color:#2a333c;margin-bottom:.14rem;text-overflow: ellipsis;
          display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow:hidden;}
        .fr_text2{font-size:.24rem;}
      }
    }
    .find_xq{font-size:.24rem;color:#ff575a;border: solid .02rem #ff575a;border-radius:.24rem;width:1.28rem;height:.46rem;
      line-height:.46rem;overflow:hidden;text-align:center;position:absolute;bottom:.34rem;right:.30rem;}
  }
  .bottomLine{color:#666;text-align:center;margin:10px 0;}
</style>
