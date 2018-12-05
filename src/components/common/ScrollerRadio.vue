<template>
  <div class="selector_search_box">
    <cell class="custom_cell" :title="describe" :value="itemName"  :is-link="isLink"  @click.native="showPopup" :disabled="disabled">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <div :class="['scroller_wraper', show ? 'show' : '']">
      <scroller lock-x :use-pullup="true"  @on-pullup-loading="infinite" :pullup-config="pullupConfig" ref="scroller">
        <div class="scroller_container">
          <div v-for="item in dataList">{{item.itemName}}</div>

        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {XInput,Cell, Icon,LoadMore, Scroller} from 'vux'
  import { mapState } from 'vuex'
  import api from '../../api/api'
  export default {
    components: {XInput,Cell,Icon,LoadMore, Scroller },
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      value: [String, Number],  // 通过v-model指令传递给子组件的属性
      options: Array, // 数据
      isFirst: { // 是否第一次选择
        type: Boolean,
        default: true
      },
      disabled: { // 是否可用
        type:Boolean,
        default: false
      },
      hasSearch: { // 是否显示关键字搜素
        type:Boolean,
        default: true
      },
      showLoading: { // 是否在加载中
        type:Boolean,
        default: false
      },
      isLink: { // 是否显示箭头
        type:Boolean,
        default: true
      },
      hasEntry: { // 是否显示输入框手动输入
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '自定义',
        itemName: '',  // 选项文本
        unitAdress: '', // 单位地址
        unitNumber: '', // 单位编号
        unitPhone: '', // 单位电话
        show:false,
        keyWord: '', // 输入框关键字
        showSearch: true, // 输入框开关
        isFiexd: false,
        currentPage: 1,
        isPullup: true,
        dataList: [],
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
      }
    },
    computed: {
      ...mapState(['showLoadMore'])
    },
    watch: {
      value: function(val, old) {
//        if (val == '') {
//          this.itemName = ''
//        } else if(this.options.length > 0) {
//          this.assignments();
//        }
      },
      // 为了解决value和options的值都是依赖接口返回，接口返回数据很大可能出现不同步的情况，回显会为空，所以监控数组的变化再触发回显，
      // 因为options是数组对象，此监控只触发一次
      options: function (val) {
        this.assignments();
      },
      show: function (val) {
        if (val) {
          const _this = this
          setTimeout(() => {
            _this.isFiexd = true
          }, 300)
        } else {
          this.isFiexd = false
        }
      }
    },
    methods: {
      keyWordChange (value) {  // 搜索关键词转换
        this.currentPage = 1
        this.$emit('searchWord', value, this.currentPage, true)
        this.isPullup = true
//        this.$refs.searchList.scrollTop = 0
      },
      checkItem (key, val, dwdz, qybh, lxdh) {
        if (this.itemName != val) {
          this.itemName = val;
          this.unitAdress = dwdz
          this.unitNumber = qybh
          this.unitPhone = lxdh
          this.$emit('input',key, val, dwdz, qybh, lxdh);
        }
        if (key == -1) this.$emit('change',key, this.itemName);
        this.show = !this.show;
        if (this.showLoadMore) this.$store.commit('UPDATE_LOAD_MORE', false);

        const lis = this.$refs.searchListCont.children
        for(let i=0; i < lis.length; i++) {lis[i].className = ''}
        event.target.className = 'active'
      },
      assignments () {  // 回显和触发change事件
        const options = this.options;
        options.forEach((item) => {
          if (item.key == this.value || item.qybh == item.key[2]) { // qybh 为企业编号，因为企业名称不是唯一，无法触发chang事件
            this.itemName = item.value;
            this.$emit('change',item.key, this.itemName, this.unitAdress, this.unitNumber, this.unitPhone);
          }
        });
      },
      infinite () {  // 上拉刷新

      },
      queryJzdmPage (keyWord, currentPage, isClear) {  // 街镇查询, currentPage: 分页，keyWord：搜索关键字，isClear：搜索框文本变动，是否清空数组
        if (isClear) this.dataList = [] // 关键字变更，清空数组
        api.queryDictionaryListPage({
          typeCode: 440118102,
          itemName: keyWord ? keyWord : '',
          currentPage: currentPage ? currentPage : 1
        }).then((res) => {
          const data = res.data.obj.rows;
          if (!res.data.success && data.length > 0) {
            data.map((item) => {
              this.dataList.push(item)
            })
            this.$refs.scroller.donePullup();
            this.$refs.scroller.reset();
          } else {
            this.$refs.scroller.disablePullup();
          }
        }).catch((res) => {
          this.$refs.scroller.donePullup();
          this.$refs.scroller.disablePullup();
        });
      },
      showPopup () {
        if (!this.disabled) {
          this.show = !this.show
        }
      },
      closePopup () { // 在没有数据的情况下有效
        if (this.options.length == 0) this.show = !this.show;
      },
    },
    mounted () {
      this.queryJzdmPage();
    }
  }
</script>
<style lang="less" scoped>
  .search_box{width:100%;height:42px; overflow: hidden;}
  .vux-x-input{width: 100%;background:#FAFAFA;padding:10px 0;margin: 0 0px;border-bottom:1px solid #eee;}
  .search_box.isFiexd{position: fixed;left: 0;top:0;z-index:99999;}

  .scroller_wraper{width:100%;height:100%;overflow:hidden;background: #eee;position: fixed;top:0;z-index: 999999999999999;transform: translateX(100%);will-change: transform;transition: all 250ms;backface-visibility: hidden;perspective: 1000;}
  .scroller_wraper.show{transform: translateX(0);}



  .selector_search_box .custom_cell{position: relative;box-sizing: border-box;
    &:before{content: "";display: block;height:1px;width:100%;top:0;left:15px;}
  }
  .list_cont{
    width:100%;min-height:100%;overflow: hidden;background: #fff;padding-top:1rem;box-sizing: border-box;
    li{text-indent:.3rem;border-bottom:1px solid #eee;display: block;height: .8rem;line-height: .8rem;}
    li:last-of-type{border:none;}
    .load_more{width:80%;margin-top:1rem;}
    .no_data{height:100%;line-height: 1.5rem;overflow:hidden;text-align: center;font-size: .34rem;color:#999;}
    .go_back_btn{display: inline-block;width: 80%;line-height: 1rem;text-indent: 0;text-align: center;color:#333;background:#eee;}
    .weui-icon-success-no-circle{color: red;float: right;margin-right: .3rem;display: none;}
    li.active{color:#1F67D0;}
    li.active .weui-icon-success-no-circle{display: inline-block;}
    li.no_have{color:#FF0000;}
  }
  .weui_icon_warn{float: right;}
  .weui-icon-info{margin-right:.15rem;}
  .loader_more{width:100%;height:0;line-height:.8rem;overflow:hidden;margin:0;position: fixed;left: 0;bottom:0;z-index:9999;background: #fff;transition: all .5s ease;}
  .showHeight{height:1rem;}
</style>

