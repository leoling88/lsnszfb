<template>
  <div class="template_container">
    <!--linkBar-->
    <div ref="linkBar" :class="['link_bar_cont', 'fixed_Box', isCover ? 'isCover' : '']">
      <a @click="certFace"><img src="../../assets/images/py_jzdj.png">居住登记</a>
      <a><img src="../../assets/images/py_jzz.png">居住证</a>
      <!--<a><img src="../../assets/images/py_jffw.png">积分服务</a>-->
      <!--<a @click="certFace"><img src="../../assets/images/py_jzz.png">居住证</a>-->
      <a><img src="../../../static/images/icon_integra_home.jpg" style="width:.95rem;height:.95rem;top:.2rem;
    margin-left: -0.425rem;">积分服务</a>
      <router-link :to="`/policyLaw?newsType=15&newName=${encodeURI('办事指南')}`"><img src="../../assets/images/py_bszn.png">办事指南</router-link>
    </div>


    <div style="width:100%;height:560px;position: absolute;top:0;left:0;z-index: 0;"></div>

    <scroller lock-x :lock-y="isLockY" height="-40px" @on-scroll="onScroll" :use-pullup="true"  @on-pullup-loading="infinite" :pullup-config="pullupConfig" ref="wrapper">
      <div class="box2">
        <div ref="homeSwiper">
          <img src="../../assets/images/banner_py.png">
        </div>

        <div class="link_bar_cont2" ref="linkBar">
          <a @click="certFace">
            <img src="../../assets/images/py_jzdj.png">
            <span>居住登记</span>
            <span>来穗人员信息登记</span>
          </a>
          <template>
<!--             <a v-if="registerFlag == 0 || registerFlag == 2" @click="checkRegister">
              <img src="../../assets/images/py_jzz.png">
              <span>居住证</span>
              <span>居住证申领/续签</span>
            </a> -->
<!--             <a href="/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=2&innerType=1&homeType=lspy_&type=3">
              <img src="../../assets/images/py_jzz.png">
              <span>居住证</span>
              <span>居住证申领/签注</span>
            </a> -->
             <a href="javascript:;" @click="clickAler1">
              <img src="../../assets/images/py_jzz_disabled.png">
              <span>居住证</span>
              <span>居住证申领/续签</span> 
            </a>
          </template>

          <template>
<!--             <a href="/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=2&innerType=1&homeType=lspy_&type=2">
              <img src="../../assets/images/py_jffw.png">
              <span>积分服务</span>
              <span>积分入学/入户</span>
            </a> -->
            
            <a @click="clickAler1"> 
              <img src="../../assets/images/icon_integra_homeoff.jpg" style="width:.9rem;height:.9rem;margin:.2rem 0 0 .15rem;" >
              <span>积分服务</span>
              <span>积分入学/入户</span>
            </a>
          
          </template>

          <router-link :to="`/policyLaw?newsType=15&newName=${encodeURI('办事指南')}`">
            <img src="../../assets/images/py_bszn.png">
            <span>办事指南</span>
            <span>政策服务指引</span>
          </router-link>
        </div>
        <div class="title_cont">番禺动态</div>
        <!--新闻列表 start-->
        <div class="news_box">
          <div class="nav_content_box">
            <template v-for="item in newsList">
              <!--小图-->
              <div class="item_box" v-if="item.shorttitleimg">
                <router-link :to="`/newsDetail/${item.comGUID}`">
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
                <router-link :to="`/newsDetail/${item.comGUID}`">
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
                <router-link :to="`/newsDetail/${item.comGUID}`">
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
            <load-more v-if="isMax" class="load_more" :show-loading="false" :tip="newsList.length <= 0 ? '暂无数据' : '我是有底线的'"></load-more>
          </div>
        </div>
        <!--新闻列表 end-->

      </div>
    </scroller>


    <ul class="btom_cont">
      <li>番禺区来穗人员服务管理局</li>
      <li>服务电话：<a href="tel:020-84691533">020-84691533</a></li>
    </ul>

    <div v-if="showloading" class="layout"></div>
    <!--确认、取消弹窗-->
    <div v-transfer-dom>
      <confirm v-model="isShowConfirm" title="操作提示" @on-confirm="certFace">
        <icon class="icons" type="warn" is-msg></icon>
        <p style="text-align:center;">您还没有登记，立即登记？</p>
      </confirm>
    </div>
    <!--确认、取消弹窗 END-->




    <div class="alert-notopen" v-if="alertNotOpen">暂未开通，敬请期待</div>

  </div>
</template>
<script>
  import api from '../../api/api'
  import {Confirm,Icon,XHeader,XInput,Tab,TabItem, Scroller,Swiper,SwiperItem, LoadMore, Loading, XDialog,TransferDomDirective as TransferDom} from 'vux'
  import { mapState } from 'vuex'

  export default {
    name: 'home',
    directives: {
      TransferDom
    },
    components: {XDialog,Confirm,Icon,XHeader,XInput,Tab,TabItem,Scroller,Swiper,SwiperItem,LoadMore, Loading},
    data() {
      return {
        orginType: this.$route.query.orginType,   //平台判断入口类型
        registerFlag: this.$route.query.registerFlag || 0, //来穗系统是否有登记信息:1-是 0-否 2-接口报错
        showloading: false,
        isShowConfirm: false,
        isLockY: false,
        comGuid: this.$route.query.comGuid,
        defaultImg: '../../../static/images/moren.png',
        isMax: false,  // 分页最大页数
        scrollTop:'',
        isCover:false,
        isTouch:false,
        slides:[],
        homeType: this.$route.query.orginTypes,     //地区
        idCard: this.$route.query.idCard,
        userName: this.$route.query.userName,
        newSet: false,    //是否新增
        pullupConfig:{
          content: '正在努力加载...',
          pullUpHeight: 30,
          height: 40,
          autoRefresh: false,
          downContent: '松手加载更多',
          upContent: '加载更多',
          loadingContent: '正在努力加载...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        newsType: 10, // 新闻类型
        newsArea:440113,
        pageIndex: 1, // 页码
        newsList:[],
        alertNotOpen: false,
        formData:{
          idNo:'',
          idName:''

        }
      }
    },
    computed: {
      ...mapState([
        'loadingShow','idNo'
      ])
    },
    created() {

    },    
    methods: {
      clickAler1 (){
        this.alertNotOpen = true
        setTimeout(() => {
        this.alertNotOpen = false
        }, 800);

      },      
      onScroll (pos) {  // 滚动事件回调
        this.scrollTop = pos.top
        if(this.scrollTop >= this.$refs.homeSwiper.clientHeight + this.$refs.linkBar.clientHeight){
          this.isCover = true;
        } else {
          this.isCover = false;
        }
      },
      infinite() { // 上拉加载
        this.pageIndex ++;
        this.getNewSList();
      },
      getNewSList() {  // 获取新闻列表
        api.newsList({
          index: this.pageIndex,
          newsType: this.newsType,
          newsArea: this.newsArea
        }).then(res => {
          const data = res.data
          if (data.success && data.jsonRes.length > 0) {
            res.data.jsonRes.map((item) => {this.newsList.push(item)})
            this.$refs.wrapper.donePullup();
            this.$refs.wrapper.reset();
            if (this.pageIndex >= data.total) {
              this.$refs.wrapper.disablePullup();
              if (this.newsList.length == 0) this.$refs.wrapper.reset({top: 0});
              this.isMax = true;
            } else {
              this.$refs.wrapper.donePullup();
              this.$refs.wrapper.reset();
            }
          } else {
            this.$refs.wrapper.disablePullup();
            this.isMax = true
          }
        }).catch((res) => {
          this.$refs.wrapper.donePullup();
          this.$refs.wrapper.disablePullup();
          this.isMax = true
        });
      },
      certFace () {
        localStorage.setItem("orgin_type",this.$route.query.orginType)     //存储平台

          this.$store.commit('UPDATE_LOADING', true);
          this.showloading = true
          location.href = "/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&innerType=1&homeType=lspy_&type=1"  
      },


      checkRegister () {
        if (this.registerFlag == 2) {
          this.$router.push({path:'/error'});
        } else {
          this.isShowConfirm = !this.isShowConfirm
        }
      },
    },
    mounted(){
      localStorage.removeItem('backType')    //清除上一次签注禁返回上一页
      this.getNewSList();
    },
    destroyed () {
      this.showloading = false
    }
  }
</script>

<style lang="less" scoped>

  /*HEADER*/
  .vux-header{width:100%;position: absolute;top:0;z-index: 1001;background-size: .38rem .15rem;}
  .icon_home_menu{width:.38rem;height:.15rem;position: absolute;top:.35rem;left:.2rem;z-index: 1001;}
  img{width:100%;height:100%;display:block;}

  /*banner*/
  .swiper-container{width:100%;height:4.52rem;overflow:hidden;position: relative;
    .over_layout{width:100%;height:100%;overflow: hidden;background: #000;opacity: 0;transition:all .3s ease;}
    .over_layout.isTouch{position:absolute;left:0;top:0;z-index: 1004;opacity: 0.2;}
  }


  .wraper_box{width:100%;height:1.87rem;overflow: hidden;}
  .fixed_Box{width:100%;/*height:1.87rem;*/overflow: hidden;border-bottom:1px solid #eee;position: fixed;top:-1.87rem;left:0;z-index: 99999;opacity: 0;transition: all .3s ease-in-out;background: #fff;}
  .fixed_Box.isCover{opacity: 1;transform: translateY(1.86rem);}
  /*linkBar*/
  .link_bar_cont{
    width:100%;height:1.87rem;overflow: hidden;background: #fff;/*border-top:1px solid #eee;border-bottom:1px solid #eee;*/
    a{display: inline-block;float:left;width:24.8%;height:100%;line-height: 2.95rem;text-align: center;font-size: .25rem;color:#000;position: relative;font-weight: bold;
      img{width:1.22rem;height:1.22rem;position: absolute;left:50%; top:.07rem;margin-left:-.61rem;}
    }
  }
  .link_bar_cont2{
    width:7.06rem;height:auto;margin:0 auto;padding:.12rem 0 .18rem;overflow:hidden;background: #ffffff;
    a{
      display: block;float:left;width:3.53rem;margin:.16rem 0;font-size: .25rem;color:#4a5560;position: relative;
      img{width:1.2rem;height:1.2rem;float: left;}
      span{width:2.33rem;display: block;text-indent: .08rem;position:relative;top:.15rem;}
      span:first-of-type{font-size: .33rem;float:right;color: #222222;}
      span:last-of-type{font-size: .22rem;float:right;color: #888888;}
    }
  }
  .title_cont{width: 100%;height: .68rem;line-height:.68rem;background-color: #f5f5f5;text-indent:.3rem;font-size: .3rem;color: #666;}
  /*tabBar*/
  .tab_bar{width:100%;height:1.05rem;overflow: hidden;}

 
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
  .item_box.other{
    .lf_cont{width:100%;
      .item_info_box span:first-of-type{width:80%;}
      .item_info_box span:last-of-type{width:auto;}
    }
    .rg_cont{display: none;}
  }
  .item_box.longtitleimg{
    padding:0 .2rem;
    .item_title{height:.85rem;line-height:.85rem;width:100%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;}
    .item_info_box{height:.67rem;line-height:.67rem;}
    .item_info_box span:first-of-type{width:80%;}
    .item_info_box span:last-of-type{width:auto;}
  }

  .item_coins{ padding: 0.1rem 0 0.1rem 0.3rem; height: 0.8rem;}
  .ico_coins{ width: 0.3rem; margin: 0.25rem 0 0 0.1rem;}
  .ico_time,.ico_personl{ width: 0.3rem;height: 0.3rem; margin-top: 0.09rem; margin-right: 0.05rem;}
  .ico_time:last-of-type{margin-left:4rem;}
  .ico_complete{ width: 1.2rem; height:1.2rem;top:0.33rem; right:0.2rem;}


  .btom_cont{
    width:100%;height:40px;overflow:hidden;text-align: center;background: #FAFAFA;position: fixed;bottom: 0;left:0;
    li{font-size: 12px;line-height:16px;color:#A1ACB5;}
    li:first-of-type{margin-top:4px;}
    a{color:#0B8FF4;}
  }
  .load_more{width:80%;margin:.7rem auto 0 auto;}

  .layout{width:100%;height:100%;overflow: hidden;position: fixed;left:0;top:0; z-index: 99999999999999;}
  .title_style1{color:#000;}
  .alert-notopen{width:3.2rem;border-radius:.1rem;margin-left:-1.6rem;padding:.1rem;color:#fff;text-align:center;background:#888;opacity:.6; position: fixed;top:56%;left:50%;}
  .png_bg{width:100%;height:100%;position: fixed;top:0;left:0;background:#333;opacity:.6;}
  .pad-20{padding:.2rem;}
  .font-12{font-size:.6rem;}
  .color-1{color:#0091FF;}

</style>
