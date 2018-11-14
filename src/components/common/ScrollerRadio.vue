<template>
  <div class="selector_search_box"><!--value && showLoading && -->
    <cell class="custom_cell" :title="describe" :value="itemName" @click.native="showPopup" :disabled="disabled" :is-loading="isSameArea && showLoading && !!value" :is-link="true">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <!--关键字搜索-->
    <div :class="['search_box', 'page_silder', show ? 'show' : '']">
      <div class="cont">
        <icon type="search"></icon>
        <input v-model.trim="keyWord" type="text" placeholder="请输入要搜索的关键字" class="key_word" @focus="inputFocus">
        <template>
          <div v-if="keyWord" class="btn suer_btn" @click="getSearch(keyWord)">搜索</div>
          <div v-else class="btn cancel_btn" @click="showPopup">取消</div>
        </template>
        <icon v-show="keyWord" type="clear" @click.native="keyWord = ''"></icon>
      </div>
    </div>

    <div :class="['scroller_wraper', 'page_silder', show ? 'show' : '']" @touchmove="inputBlur">
      <scroller lock-x :use-pullup="true" @on-pullup-loading="infinite" :pullup-config="pullupConfig" @on-scroll="scrollHander" ref="scroller">
        <div class="scroller_container" style="padding-top:1.0rem;">
          <ul class="list_cont" ref="searchListCont">
            <template v-for="(item,index) in dataList">
              <!--checkItem方法内后三个参数不是必传，主要是针对企业信息准备的，他们分别是：单位地址，企业编号，企业电话-->
              <li @click.self="checkItem(item)" :key="index" :class="[item.code == value ? 'active' : '']">
                {{item.name}}<icon type="success-no-circle"></icon>
              </li>
            </template>

            <!--无数据显示-->
            <li v-if="showLoading || dataList.length == 0" class="no_data" @click="closePopup">
              <load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载…' : '暂无数据'"></load-more>
              <!--<span v-show="!showLoading">暂无数据，可点击空白处返回</span>-->
            </li>
          </ul>

        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {XInput,Cell, Icon,LoadMore, Scroller, PopupRadio} from 'vux'
  import { mapState } from 'vuex'
  import api from '../../api/api'
  export default {
    components: {XInput,Cell,Icon,LoadMore, Scroller,PopupRadio },
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      value: [String, Number],  // 通过v-model指令传递给子组件的属性
      name: [String, Number],  // 接口非必传的参数，用于模糊查询
      code: [String, Number],  // 接口必传的参数
      apiMethod: [String], // axios中定义接口的方法名
      isFirst: { // 是否第一次选择
        type: Boolean,
        default: true
      },
      disabled: { // 是否可用
        type:Boolean,
        default: false
      },
      hasEntry: { // 是否显示输入框手动输入
        type:Boolean,
        default: false
      },
      isSameArea: { // 记录登记数据是否在同一个地区的
        type:Boolean,
        default: true
      },
      dataType: [String] // 数据类型，更加类型选择用那种过滤器
    },
    data() {
      return {
        title: '自定义',
        itemName: '',  // 选项文本
        unitAdress: '', // 单位地址
        unitNumber: '', // 单位编号
        unitPhone: '', // 单位电话
        show: false,
        keyWord: '', // 输入框关键字
        showSearch: true, // 输入框开关
        isSearch: false, // 记录是否点击搜索按钮
        isFiexd: false,
        currentPage: 1,
        isPullup: true,
        dataList: [],
        showLoading: '',  // 是否在加载中
        scrollTop: 0, // 组件滚动的高度
        pullupConfig:{
          content: '',
          pullUpHeight: 40,
          height: 40,
          autoRefresh: false,
          downContent: '',
          upContent: '',
          loadingContent: '',
          clsPrefix: 'xs-plugin-pullup-'
        },
        scrollBottomOffset: 10
      }
    },
    computed: {
      ...mapState([
        'openid','idNo','scrollerRadioStatue'
      ])
    },
    watch: {
      code: function(value, old) {
        this.itemName = ''
        if (!value) return
        if (this.name) {
          this.getData(this.code.length == 6 ? '' : this.name, this.currentPage = 1)
        } else {
          this.getData()
        }
      },
      keyWord: function (value) {  // 在输入框的值为空时，自动搜索一次
        if (!value) {
          if (this.name) {
            this.getData(this.code.length == 6 ? '' : this.name.substring(0,1), this.currentPage = 1)
          } else {
            this.getData(value, this.currentPage = 1)
          }
        }
      },
      scrollerRadioStatue: function (value) {
        this.show = false;
      }
    },
    methods: {
      getSearch (value) {  // 搜索关键词
        this.isSearch = true
        this.keyWord = value
        this.getData(value, this.currentPage = 1)
      },
      checkItem (item) {
        if (this.itemName != item.name) {
          this.itemName = item.name;
          this.unitAdress = item.dwdz
          this.unitNumber = item.qybh
          this.unitPhone = item.lxdh
          this.$emit('input',item.code, item.name, item.dwdz, item.qybh, item.lxdh);
          this.$emit('change', item.code, item.name);
        }
        this.show = !this.show;
        const lis = this.$refs.searchListCont.children
        for(let i=0; i < lis.length; i++) {lis[i].className = ''}
        event.target.className = 'active'
      },
      infinite () {  // 上拉加载
        this.getData(this.keyWord, ++this.currentPage)
      },
      getData (keyWord, currentPage) { // keyWord：搜索关键字， currentPage: 分页
        this.showLoading = true
        if (this.currentPage == 1) {
          this.dataList = []
          this.$refs.scroller.reset({top: 0});
          console.log(111)
        }
        api[this.apiMethod]({
          openid: this.openid,
          account: this.idNo,
          code: this.code,
          keyWord: keyWord ? keyWord : '',
          currentPage: currentPage ? currentPage : 1
        }).then((res) => {
          const data = JSON.parse(res.data.jsonRes[0]);
          const totalPage = Math.ceil(data.page.count/data.page.pageSize);  // 目前接口没有统计分页总页数的参数
          if (res.data.success && data.ackCode == 1) {
            switch (this.dataType) {
              case 'door':
                this.doorFilerData(data.dataList, this.dataList);
                break;
              case 'room':
                this.roorFilerData(data.dataList, this.dataList);
                break;
              default:
                this.laisuiFilerData(data.dataList, this.dataList);
                break;
            }
            if (this.currentPage >= totalPage) {
              this.$refs.scroller.disablePullup();
              if (this.dataList.length == 0) this.$refs.scroller.reset({top: 0});
            } else {
              this.$refs.scroller.enablePullup();
              this.$refs.scroller.donePullup();
              this.$refs.scroller.reset();
            }
          }
          this.showLoading = false
        }).catch((res) => {
//          this.$refs.scroller.donePullup();
          this.$refs.scroller.disablePullup();
          this.showLoading = false
        });
      },
      showPopup () {
        if (!this.disabled) {
          this.show = !this.show
        } else {
          this.$store.commit('SHOWTOAST', '请先选择上一级！');
        }
      },
      closePopup () { // 在没有数据的情况下有效
        this.show = false;
        this.$el.querySelector('.key_word').blur()
      },
      scrollHander (pos) {
        this.scrollTop = pos.top
      },
      inputBlur () {   // 在拉动列表时，输入框失去焦点，防止手机键盘弹出来
        this.$el.querySelector('.key_word').blur()
      },
      inputFocus (event) {
        event.target.scrollIntoView(true)
      },
      laisuiFilerData(srcData, toData){ // 来穗接口筛选数据字典
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach((item,index) => {
            toData.push({
              name: item.itemName ? item.itemName : item.mph,
              code: item.itemCode ? item.itemCode : item.zhid
            })
            if (this.value == item.itemCode) this.itemName = item.itemName
          });
        }
      },
      doorFilerData(srcData, toData){ // 门牌号过滤器
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              name: item.mph,
              code: item.zhid
            })
            if (this.value == item.zhid) this.itemName = item.mph
          });
        }
      },
      roorFilerData(srcData, toData){ // 房号过滤器
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              name: item.dy,
              code: item.fhid
            })
            if (this.value == item.fhid) this.itemName = item.dy
          });
        }
      },
      unitFilterData (srcData, toData) {  // 企业单位过滤器
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              name: item.dwmc,  // 单位名称
              code: `${item.dwmc},${item.dwdz},${item.qybh},${item.lxdh}`,  // 因为单位名称会有相同的情况,所以为了保证key的唯一性，把单位的名称，地址，编号，企业电话都写在一起，用逗号分隔
            })
            if (this.value == `${item.dwmc},${item.dwdz},${item.qybh},${item.lxdh}`) this.itemName = item.dwmc
          });
        }
      }
    },
    mounted () {
      // 1,模糊查询有问题，有时候用一个字查不出来
    }
  }
</script>
<style lang="less" scoped>
  .search_box{
    width:100%;height:1.05rem;overflow: hidden;position: fixed;left:0;top:0;z-index: 999999999999999;background: #fff;
    .cont{width:98%;height:.85rem;margin:.1rem auto;overflow: hidden;position: relative;background: rgb(238, 238, 238);border-radius:.1rem;}
    .weui-icon-clear{position: absolute;right:1.65rem;top:50%;margin-top:-7px;}
    .weui-icon-search{width:.7rem;height:100%;line-height: .85rem;text-indent: .12rem;float:left;}
    .key_word{width:4.65rem;display:block;height:100%;border:none;float:left;box-sizing: border-box;background: rgb(238, 238, 238);font-size: .3rem;}
    .key_word:focus{outline:none;}
    .btn{width:1.3rem;height:100%;float:right;line-height:.85rem; text-align: center;}
    .suer_btn{background:#1F67D0;color:#fff;}
    .cancel_btn{background: rgb(238, 238, 238); color: #1F67D0;border-left:1px solid rgb(227, 227, 227);}
  }

  .search_box.show{transform: translateX(0);}
  .vux-x-input{
    width: 100%;background:#FAFAFA;padding:0;margin: 0 0px;border-bottom:1px solid #eee;
    .suer_btn{background: #1F67D0;line-height:27px;color:#fff;border-radius: .08rem;width:1rem;position: absolute;right:10px;top:6px;}
    .weui-icon-search{height:41px;line-height: 41px;position: relative;padding-right:10px;
      &:after{content: '';display: block;width: 1px; height:27px;background: #eee;position: absolute;right:0;top:7px;}
    }
  }

  .scroller_wraper{width:100%;height:100%;overflow:hidden;background: #eee;position: fixed;top:0;z-index: 1;}
  .scroller_wraper.show{transform: translateX(0);}

  .selector_search_box .custom_cell{position: relative;box-sizing: border-box;
    &:before{content: "";display: block;height:1px;width:100%;top:0;left:15px;}
  }
  .list_cont{
    width:100%;min-height:100%;overflow: hidden;background: #fff;box-sizing: border-box;
    li{text-indent:.3rem;border-bottom:1px solid #eee;display: block;height: .9rem;line-height: .9rem;}
    li:last-of-type{border:none;}
    .no_data{text-indent: 0;overflow: hidden;height:13rem;}
    .go_back_btn{display: inline-block;width: 80%;line-height: 1rem;text-indent: 0;text-align: center;color:#333;background:#eee;}
    .weui-icon-success-no-circle{color: red;float: right;margin-right: .3rem;display: none;}
    li.active{color:#1F67D0;}
    li.active .weui-icon-success-no-circle{display: inline-block;margin-top:.1rem;}
    li.no_have{color:#FF0000;}
  }
  .weui_icon_warn{float: right;}
  .weui-icon-info{margin-right:.15rem;}
  .loader_more{width:100%;height:0;line-height:.8rem;overflow:hidden;margin:0;position: fixed;left: 0;bottom:0;z-index:9999;background: #fff;transition: all .5s ease;}
  .showHeight{height:1rem;}

</style>

