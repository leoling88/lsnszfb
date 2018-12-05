<template>
  <div class="template_container">
    <div class="news_title">{{newstitle}}</div>
    <div class="new_info">
      <span>{{publictime}}</span>
      <span><img src="../../../static/images/icon_viewcnt1.png"><em>{{viewcnt}}</em></span>
      <span @click="thumbsUp">
        <img v-if="zanShow" src="../../../static/images/zan.png">
        <img v-if="zan1Show" src="../../../static/images/zan1.png">
        <em>{{thumbs}}</em>
      </span>
    </div>
    <div class="news_cont" v-html="content"></div>
  </div>
</template>
<script>
  import api from '../../api/api'
  export default {
    name: 'newsDetail',
    components: {},
    data() {
      return {
        newName: decodeURI(this.$route.query.newName),
        zanShow:true,
        zan1Show:false,
        thumbs: 0,
        newstitle: '',
        publictime: '',
        newsSource: '',
        viewcnt: '',
        newsId:this.$route.params.newsId,
        content: '123123'
      }
    },
    methods: {
      thumbsUp () {// 点赞
        api.newsThumbsUp(this.newsId).then(res =>{
          if(res.data.success) {
            this.thumbs = res.data.likecnt;
          }
        });
        this.zanShow=false;
        this.zan1Show=true;
      }
    },
    created () {
      if (window.AlipayJSBridge) {
        AlipayJSBridge.call('setTitle', {title: this.newName == 'undefined' ? '番禺区来穗人员服务管理局': this.newName});
      }
    },
    mounted(){
      api.newsDetail(this.newsId).then(res => {  // 新闻详情
        if(res.data.success){
          this.newstitle = res.data.jsonRes[0].newstitle;
          this.publictime = res.data.jsonRes[0].publictime;
          this.content = res.data.jsonRes[0].content;
          this.newsSource = res.data.jsonRes[0].newsSource;
          this.viewcnt = res.data.jsonRes[0].viewcnt;
          this.thumbs = res.data.jsonRes[0].likecnt;
        }
      });

      // 新闻浏览次数
      api.newsViewcnt(this.newsId);

    }
  }
</script>
<style lang="less" scoped>
  .news_title{width:80%;height:1rem;margin:0 auto;overflow:hidden;line-height: 1rem;text-align: center;font-size: .45rem;color:#333;text-overflow:ellipsis;white-space: nowrap;}
  .new_info{
    width:100%;height:1rem;line-height: 1rem;text-indent: .2rem;font-size: .35rem;color:#888;overflow:hidden;display: flex;flex-wrap: wrap;
    span{display: block;flex: 1}
    em{color:#1f67d0;}
    span{text-align: center;
      img{width:.32rem;margin-right:.1rem;}
    }
    span:nth-of-type(2){
      img{margin-right:.25rem;}
    }
  }
  .news_cont{width:96%;line-height:.35rem;margin:0 auto;min-height:3rem;overflow:hidden;
    p{padding:.2rem 0;}
    img{margin:.3rem 0;}
  }
</style>
