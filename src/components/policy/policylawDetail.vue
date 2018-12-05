<template>
  <div class="template_container">
    <div class="news_title">{{newstitle}}</div>
    <div class="new_info">
      <span>来源：广州市来穗人员服务管理局</span>
    </div>
    <div class="news_cont" v-html="content"></div>
  </div>
</template>
<script>
  import api from '../../api/api'
  export default {
    components: {},
    data() {
      return {
        newName: decodeURI(this.$route.query.newName),
        newsId: this.$route.params.newsId,
        newstitle: '',
        content: ''
      }
    },
    methods: {
      newsDetail (detailId) {  // 兑换记录列表详情
        api.newsDetail(detailId).then((res) => {
          if(res.data.success){
            this.newstitle = res.data.jsonRes[0].newstitle;
            this.content = res.data.jsonRes[0].content;
          }
        })
      },
    },
    created () {
      if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: this.newName});
    },
    mounted(){
      this.newsDetail(this.newsId);
    }
  }
</script>
<style lang="less" scoped>
  .news_title{width:94%;margin:0 auto;margin-top:.2rem;text-align: center;font-size: .45rem;color:#3988d7;}
  .new_info{
    width:100%;height:1rem;line-height: 1rem;text-indent: .2rem;font-size: .28rem;color:#999;overflow:hidden;display: flex;flex-wrap: wrap;
    span{display: block;flex: 1;text-align: center;}
  }
  .news_cont{width:94%;line-height:.35rem;margin:0 auto;min-height:3rem;overflow:hidden;
    p{padding:.2rem 0;line-height:.8rem;text-align: justify;}
  }
</style>
