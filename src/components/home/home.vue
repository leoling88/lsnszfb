<template>
  <div class="template_container">
    <!--fixedbox-->
    <div :class="['fixed_Box', isCover ? 'isCover' : '']">
      <!--linkBar-->
      <div class="link_bar_cont" ref="linkBar">
        <a @click="certFace"><img src="../../assets/images/icon_base.jpg">居住登记</a>
        <a @click="certFacesheao"><img src="../../assets/images/icon_shebao.png">社保查询</a>
        <template>
          <!-- <a v-if="registerFlag == 0 || registerFlag == 2" @click="checkRegister"><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a>
          <a v-else href="/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=2&innerType=1&homeType=lsns_&type=1"><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a> -->
          <!-- <a><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a>
          <a><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a> -->
        </template>
        <a @click="clickAler1" ><img src="../../assets/images/icon_111.jpg">居住证</a>
        <a @click="clickAler1" ><img src="../../assets/images/icon_222.jpg">房屋租赁</a>
        <!--<router-link to="/integralSchool"><img src="../../assets/images/icon_integra_school.jpg">房屋租赁</router-link>-->
        <!-- <router-link to="/integralIn"><img src="../../assets/images/icon_integra_in.jpg">积分服务</router-link> -->
<!--         <a  @click="clickAler1" ><img src="../../assets/images/icon_shebao_off.png">社保查询</a>
 -->         

 
      </div>
    </div>

    <div style="width:100%;height:560px;position: absolute;top:0;left:0;z-index: 0;"></div>

    <scroller lock-x :lock-y="isLockY" height="-40px" @on-scroll="onScroll" :use-pullup="true"  @on-pullup-loading="infinite" :pullup-config="pullupConfig" ref="wrapper">
      <div class="box2">
        <!-- header -->
        <h1 class="home_header">南沙区来穗人员服务管理局</h1>

        <div ref="homeSwiper"><img src="../../../static/images/banner_item.jpg"></div>

        <div class="link_bar_cont" ref="linkBar">
          <a @click="certFace"><img src="../../assets/images/icon_base.jpg">居住登记</a>
          <a @click="certFacesheao"><img src="../../assets/images/icon_shebao.png">社保查询</a>
<!--           <router-link to="/social" ><img src="../../assets/images/icon_shebao.png">社保查询</router-link>          
 -->          <template>
            <!-- <a v-if="registerFlag == 0 || registerFlag == 2" @click="checkRegister"><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a>
            <a v-else href="/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=2&innerType=1&homeType=lsns_&type=1"><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a> -->
            <!-- <a><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a>
            <a><img src="../../assets/images/icon_integra_home_active.jpg">居住证</a> -->
          </template>
          <a @click="clickAler1" ><img src="../../assets/images/icon_111.jpg">居住证</a>
          <a @click="clickAler1" ><img src="../../assets/images/icon_222.jpg">房屋租赁</a>
          <!--<router-link to="/integralSchool"><img src="../../assets/images/icon_integra_school.jpg">房屋租赁</router-link>-->
          <!-- <router-link to="/integralIn"><img src="../../assets/images/icon_integra_in.jpg">积分服务</router-link> -->
<!--           <a  @click="clickAler1" ><img src="../../assets/images/icon_shebao_off.png">社保查询</a>
 -->          
        </div>
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
                  <div class="rg_cont"><img :src="`${baseUrl}${item.shorttitleimg}`"/></div>
                </router-link>
              </div>
              <!--大图-->
              <div class="item_box longtitleimg" v-else-if="item.shorttitleimg">
                <router-link :to="`/newsDetail/${item.comGUID}`">
                  <div class="item_title">{{item.newstitle}}</div>
                  <div class="item_img"><img :src="`${baseUrl}${item.longtitleimg}`"/></div>
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
                  <div class="rg_cont"><img :src="item.shorttitleimg ? item.shorttitleimg : defaultImg"/></div>
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
      <li>南沙区来穗人员服务管理局</li>
      <li>服务电话：<a href="tel:020-39053053">020-39053053</a></li>
    </ul>
    <div v-if="showloading" class="layout"></div>


    <div v-transfer-dom>
      <confirm v-model="isShowConfirm" title="操作提示" @on-confirm="certFace">
        <icon class="icons" type="warn" is-msg></icon>
        <p style="text-align:center;">您还没有登记，立即登记？</p>
      </confirm>
    </div>


    <div class="alert-notopen" v-if="alertNotOpen">暂未开通，敬请期待</div>

  </div>
</template>
<script>
  import baseUrl from '../../api/config';
  import api from '../../api/api'
  import {Icon, Confirm, XInput,Tab,TabItem, Scroller,Swiper,SwiperItem, LoadMore, Loading, TransferDomDirective as TransferDom} from 'vux'
  import { mapState } from 'vuex'
  export default {
    name: 'home',
    directives: {TransferDom},
    components: {Icon, Confirm, XInput,Tab,TabItem,Scroller,Swiper,SwiperItem,LoadMore, Loading},
    data() {
      return {
        registerFlag: this.$route.query.registerFlag || 0, //来穗系统是否有登记信息:1-是 0-否 2-接口报错
        showloading: false,
        isShowConfirm: false,
        isLockY: false,
        baseUrl:baseUrl.replace(/\/cnLaiSui/,''),
        comGuid: this.$route.query.comGuid,
        defaultImg: '../../../static/images/moren.png',
        isMax: false,  // 分页最大页数
        scrollTop:'',
        isCover:false,
        isTouch:false,
        slides:[],
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
        pageIndex: 1, // 页码
        newsList:[],
        alertNotOpen: false
      }
    },
    computed: {
      ...mapState([
        'loadingShow','idNo'
      ])
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
        this.getNewSList(this.pageIndex, this.newsType);
      },
      homePage() { // banner图
        api.homePage().then((res) => {
          this.slides = res.data.jsonRes
        })
      },
      getNewSList(pageIndex, type) {  // 获取新闻列表
        api.getNewsList(pageIndex, type).then(res => {
          if (res.data.success && res.data.jsonRes.length > 0) {
            res.data.jsonRes.map((item) => {this.newsList.push(item)})
            this.$refs.wrapper.donePullup();
            this.$refs.wrapper.reset();
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
        this.$store.commit('UPDATE_LOADING', true);
        this.showloading = true
        location.href = "/cnLaiSui/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&innerType=1&homeType=lsns_&type=1"
      },
      certFacesheao () {
        this.$store.commit('UPDATE_LOADING', true);
        this.showloading = true
        location.href = "/cnLaiSui/mobile/zhimaStart?bizCode=FACE&businesType=1&innerType=1&homeType=lsns_&type=5"
      },
      checkRegister () {
        if (this.registerFlag == 2) {
          this.$router.push({path:'/error'});
        } else {
          this.isShowConfirm = !this.isShowConfirm
        }
      },
      beforRouterEnter (to, from, next) {
        console.log('asdfsd')
      }
    },
    mounted(){
      //       api.peopleDetails('b5bd18379a924eddbd2b10879dbec53b').then((res)=>{
      //   console.log(res)
      // })
      //       api.peopleDetails('f83636576aa04c5c96f8a75204d581a4').then((res)=>{
      //   console.log(res)
      // })
      this.getNewSList(this.pageIndex,this.newsType);
    },
    destroyed () {
      this.showloading = false
    }
  }
</script>

<style lang="less" scoped>

  /*HEADER*/
  .home_header{width:100%;position: absolute;top:0;z-index: 1001;font-size:.4rem;font-weight: normal;color:#fff;text-align: center;line-height:1rem;}
  .icon_home_menu{width:.38rem;height:.15rem;position: absolute;top:.35rem;left:.2rem;z-index: 1001;}
  img{width:100%;height:100%;}

  /*banner*/
  .swiper-container{width:100%;height:4.52rem;overflow:hidden;position: relative;
    .over_layout{width:100%;height:100%;overflow: hidden;background: #000;opacity: 0;transition:all .3s ease;}
    .over_layout.isTouch{position:absolute;left:0;top:0;z-index: 1004;opacity: 0.2;}
  }


  .wraper_box{width:100%;height:1.87rem;overflow: hidden;}
  .fixed_Box{width:100%;height:1.87rem;overflow: hidden;border-bottom:1px solid #eee;position: fixed;top:-1.87rem;left:0;z-index: 99999;opacity: 0;transition: all .3s ease-in-out;}
  .fixed_Box.isCover{opacity: 1;transform: translateY(1.86rem);}
  /*linkBar*/
  .link_bar_cont{
    width:100%;height:1.87rem;overflow: hidden;background: #fff;/*border-top:1px solid #eee;border-bottom:1px solid #eee;*/
    a{display: inline-block;float:left;width:24.8%;height:100%;line-height: 2.95rem;text-align: center;font-size: .25rem;color:#000;position: relative;font-weight: bold;
      img{width:.88rem;height:.88rem;position: absolute;left:50%; top:.22rem;margin-left:-.44rem;}
    }
  }
  /*tabBar*/
  .tab_bar{width:100%;height:1.05rem;overflow: hidden;}

  // 小图新闻
  .item_box{
    width:100%;overflow:hidden;padding:.25rem .2rem;margin:0 auto;box-sizing: border-box;background: #fff;border-top:.1rem solid #eee;
    .lf_cont{width:4.2rem;float:left;overflow: hidden;
      .item_title{height:1.4rem;overflow:hidden;font-size: .28rem;line-height: .46rem;text-overflow:ellipsis;}
    }
    .item_info_box{height:.4rem;line-height: .4rem;color:#a1acb5;font-size: .22rem;
      span{display: inline-block;height:100%;}
      span:first-of-type{width:70%;float:left;}
      span:last-of-type{width:auto;float:right;background: url(../../../static/images/icon_viewcnt.png) no-repeat left center;background-size:.37rem .16rem; text-indent: .37rem;}
    }
    .rg_cont{width:2.65rem;height:1.8rem;overflow:hidden;float:right;overflow: hidden;
      img{width:100%;height:100%;}
    }
    .item_title{color:#212c35;}
  }
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

  .icons{display: block;width:2rem;height:2rem;margin:-.6rem auto 0 auto;padding-bottom: .5rem;}
  .icons:before{font-size: 1.5rem;}

 .alert-notopen{width:3.2rem;border-radius:.1rem;margin-left:-1.6rem;padding:.1rem;color:#fff;text-align:center;background:#888;opacity:.6; position: fixed;top:56%;left:50%;}


</style>
