<template>
  <div class="template_container">
    <scroller lock-x ref="wrapper" :use-pullup="true" :pullup-config="pullupConfig" @on-pullup-loading="infinite">
    <!--新闻列表 start-->
    <div class="news_box">
        <div class="item_box" v-for="item in policyList">
          <router-link :to="`/policylawDetail/${item.comGUID}`">
              <div class="lf_cont">
                <div class="item_title">{{item.newstitle}}</div>
                <div class="item_info_box">
                  <span>{{item.newsSource}}</span>
                  <span>{{item.viewcnt}}</span>
                </div>
              </div>
              <div class="rg_cont"><img :src="item.shorttitleimg"/></div>
          </router-link>
        </div>
      <div class="bottomLine" v-if="showBtline">暂无数据</div>
    </div>
    <!--新闻列表 end-->
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
          policyList:[],
          currentPage:1,
          newsType:1,
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
        this.getNewSList(this.currentPage,this.newsType);
      },
      getNewSList (pageIndex,type) {  // 兑换列表查询
        api.newsList(pageIndex,type).then((res) => {
          if(res.data.success){
            if (pageIndex == 1){
              this.policyList = res.data.jsonRes
            } else if(res.data.jsonRes.length > 0) {
              this.policyList = this.policyList.concat(res.data.jsonRes);
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
    mounted(){
      this.getNewSList(this.currentPage,this.newsType);
      this.$nextTick(() => {
        this.$refs.wrapper.reset();
      })
    }
  }
</script>
<style scoped lang="less">
  // 小图
  .item_box{
    width:100%;overflow:hidden;padding:.25rem .2rem;margin:0 auto;box-sizing: border-box;background: #fff;border-top:.1rem solid #eee;
    .lf_cont{width:4.2rem;float:left;overflow: hidden;
      .item_title{height:1.4rem;overflow:hidden;font-size: .32rem;line-height: .46rem;text-overflow:ellipsis;text-align: justify;}
    }
    .item_info_box{height:.4rem;line-height: .4rem;color:#a1acb5;font-size: .22rem;
      span{display: inline-block;height:100%;}
      span:first-of-type{width:70%;float:left;}
      span:last-of-type{width:auto;float:right;background: url(/static/images/icon_viewcnt.png) no-repeat left center;background-size:.37rem .16rem; text-indent: .37rem;}
    }
    .rg_cont{width:2.65rem;height:1.8rem;overflow:hidden;float:right;overflow: hidden;
      img{width:100%;height:100%;}
    }
    .item_title{color:#212c35;}
  }
  .bottomLine{color:#666;text-align:center;margin:10px 0;}
</style>
