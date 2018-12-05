<template>
  <div class="template_container">
    <scroller lock-x ref="wrapper" :use-pullup="true" :pullup-config="pullupConfig" @on-pullup-loading="infinite">
    <!--新闻列表 start-->
    <div class="news_box">
      <div class="nav_content_box">
        <template v-for="item in policyList">
          <!--小图-->
          <div class="item_box" v-if="item.shorttitleimg">
            <router-link :to="`/newsDetail/${item.comGUID}?newName=${encodeURI(newName)}`">
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
          <!--大图-->
          <div class="item_box longtitleimg" v-else-if="item.shorttitleimg">
            <router-link :to="`/newsDetail/${item.comGUID}?newName=${encodeURI(newName)}`">
              <div class="item_title">{{item.newstitle}}</div>
              <div class="item_img"><img :src="item.longtitleimg"/></div>
              <div class="item_info_box">
                <span>{{item.newsSource}}</span>
                <span>{{item.viewcnt}}</span>
              </div>
            </router-link>
          </div>
          <!--无图-->
          <div class="item_box other" v-else>
            <router-link :to="`/newsDetail/${item.comGUID}?newName=${encodeURI(newName)}`">
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
        </template>
        <load-more v-if="showBtline" class="load_more" :show-loading="false" :tip="policyList.length <= 0 ? '暂无数据' : '我是有底线的'"></load-more>
      </div>

    </div>
    <!--新闻列表 end-->
    </scroller>
  </div>
</template>
<script>
  import api from '../../api/api'
  import {Scroller, LoadMore} from 'vux'
  export default {
    name: 'policyLaw',
    components: {Scroller, LoadMore},
    data() {
        return {
          policyList:[],
          pageIndex:1,
          newsType:this.$route.query.newsType,
          newName:decodeURI(this.$route.query.newName),
          newsArea:440113, //区域新闻，1.天河，2.白云区，3，南沙区，440113.番禺区
          showBtline:false,
          pullupConfig:{
            content: '正在努力加载...',
            pullUpHeight: 30,
            height: 40,
            autoRefresh: false,
            downContent: '松手加载更多',
            upContent: '加载更多',
            loadingContent: '正在努力加载...',
            clsPrefix: 'xs-plugin-pullup-'
          }
        }
    },
    methods: {
      infinite() { // 上拉加载
        this.pageIndex ++;
        this.getNewSList();
      },
      getNewSList () {  // 兑换列表查询
        api.newsList({
          index: this.pageIndex,
          newsType: this.newsType,
          newsArea: this.newsArea
        }).then((res) => {
          const data = res.data
          if(data.success && data.jsonRes.length > 0){
            data.jsonRes.map((item) => {this.policyList.push(item)})
            this.$refs.wrapper.donePullup();
            this.$refs.wrapper.reset();
            if (this.pageIndex >= data.total) {
              this.$refs.wrapper.disablePullup();
              if (this.policyList.length == 0) this.$refs.wrapper.reset({top: 0});
              this.showBtline = true;
            } else {
              this.$refs.wrapper.donePullup();
              this.$refs.wrapper.reset();
            }
          } else {
            this.$refs.wrapper.disablePullup();
            this.showBtline = true;
          }
        }).catch((res) => {
          this.$refs.wrapper.disablePullup();
          this.showBtline = false
        });
      },
    },
    created () {
      if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: this.newName});
    },
    mounted(){
      this.getNewSList();
    }
  }
</script>
<style scoped lang="less">
// 小图新闻
.item_box{
  width:100%;overflow:hidden;padding:.26rem .2rem;margin:0 auto;box-sizing: border-box;background: #fff;border-top:.2rem solid #f5f5f5;
  .lf_cont{width:4.2rem;float:left;overflow: hidden;
    .item_title{height:1.4rem;overflow:hidden;font-size: .33rem;line-height: .48rem;text-overflow:ellipsis;display: -webkit-box;  -webkit-line-clamp: 3;-webkit-box-orient: vertical;
    }
  }
  .item_info_box{height:.4rem;line-height: .4rem;color:#999999;font-size: .22rem;
    span{display: inline-block;height:100%;}
    span:first-of-type{width:70%;float:left;}
    span:last-of-type{width:auto;float:right;background: url(../../../static/images/icon_viewcnt.png) no-repeat left center;background-size:.37rem .16rem; text-indent: .37rem;}
  }
  .rg_cont{width:2.77rem;height:1.88rem;overflow:hidden;float:right;overflow: hidden;
    img{width:100%;height:100%;}
  }
  .item_title{color:#222222;}
}
.item_box:first-of-type{border-top:none;}
//无图新闻
.item_box.other{
  .lf_cont{width:100%;
    .item_info_box span:first-of-type{width:80%;}
    .item_info_box span:last-of-type{width:auto;}
  }
  .rg_cont{display: none;}
}
// 大图新闻
.item_box.longtitleimg{
  padding:0 .2rem;
  .item_title{height:.85rem;line-height:.85rem;width:100%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;}
  .item_info_box{height:.67rem;line-height:.67rem;}
  .item_info_box span:first-of-type{width:80%;}
  .item_info_box span:last-of-type{width:auto;}
}

  .no_data{overflow:hidden;width:100%;background-color: #fff;}
  .bottomLine{color:#666;text-align:center;margin:10px 0;}


</style>
