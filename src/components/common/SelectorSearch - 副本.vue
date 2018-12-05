<template>
  <div class="selector_search_box">
    <cell class="custom_cell" :title="describe" :value="itemName"  :is-link="isLink"  @click.native="showPopup" :disabled="disabled">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <div :class="['popup_cont',show && !disabled ? 'active' : '', showLoadMore ? 'loadMore' : '']" @scroll="scrollFn" ref="searchList">
      <!--选择列表-->
      <template>
        <!--关键字搜索-->
        <div :class="['search_box',isFiexd ? 'isFiexd' : '']">
          <x-input v-model="keyWord" title="搜索" :debounce="1300" :show-clear="true" @on-change="keyWordChange" placeholder="请输入要搜索的关键字" ref="searchInput" class="search_input">
            <icon type="search" slot="label" style="margin-right:.2rem;"></icon>
            <div class="suer_btn" slot="right" @click="showPopup">取消</div>
          </x-input>
        </div>

        <ul class="list_cont" ref="searchListCont" @click="closePopup">
          <li v-if="hasEntry" @click.self="checkItem(-1, '没有我想要的，手动输入')" key="-1" class="no_have">没有我想要的，手动输入<icon type="success-no-circle"></icon></li>

          <template v-for="(item,index) in options">
            <!--checkItem方法内后三个参数不是必传，主要是针对企业信息准备的，他们分别是：单位地址，企业编号，企业电话-->
            <li @click.self="checkItem(item.key, item.value, item.dwdz, item.qybh, item.lxdh)" :key="index" :class="[item.key == value ? 'active' : '']">
              {{item.value}}<icon type="success-no-circle"></icon>
            </li>
          </template>

          <li v-if="options.length == 0" class="no_data">
            <load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载…' : '暂无数据'"></load-more>
            <!--<span class="go_back_btn" @click="show = !show">返回</span>-->
          </li>
        </ul>
      </template>
    </div>

    <!--加载更多-->
    <load-more tip="正在加载" v-show="showLoadMore" :class="['loader_more', showLoadMore ? 'showHeight' : '']"></load-more>
  </div>
</template>
<script>
  import {XInput,Cell, Icon,LoadMore  } from 'vux'
  import { mapState } from 'vuex'
  export default {
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
    components: {XInput,Cell,Icon,LoadMore },
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
        dataList: []
      }
    },
    computed: {
      ...mapState(['showLoadMore'])
    },
    watch: {
      value: function(val, old) {
        if (val == '') {
          this.itemName = ''
        } else if(this.options.length > 0) {
          this.assignments();
        }
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
      scrollFn () {  // 滚动事件
        const scrollTop = this.$refs.searchList.scrollTop
        const wrapHeight = this.$refs.searchList.clientHeight
        const totalHeight = this.$refs.searchListCont.clientHeight

        if (this.isPullup && !this.showLoadMore && (scrollTop + wrapHeight >= totalHeight)) { // 触底
          console.log('this.isPullup', this.isPullup)
          console.log('scrollTop + wrapHeight >= totalHeight', scrollTop + wrapHeight >= totalHeight)
          this.$emit('scrollBottom', this.keyWord, ++this.currentPage);
          this.$store.commit('UPDATE_LOAD_MORE', true);
        }
      },
      disablePullup () { // 禁止下拉刷新
        this.isPullup = false
      },
      showPopup () {
        if (!this.disabled) {
          this.show = !this.show
        }
//        this.keyWord = ''  // 每次打开组件都清空搜索框
//        this.$refs.searchList.scrollTop = 0 // 每次打开组件都滚动到顶部
      },
      closePopup () { // 在没有数据的情况下有效
        if (this.options.length == 0) this.show = !this.show;
      },
      entyChange () {}
    },
    mounted () {
      this.assignments();
    }
  }
</script>
<style lang="less" scoped>
  .search_box{width:100%;height:42px; overflow: hidden;}
  .vux-x-input{width: 100%;background:#FAFAFA;padding:10px 0;margin: 0 0px;border-bottom:1px solid #eee;}
  .search_box.isFiexd{position: fixed;left: 0;top:0;z-index:99999;}

  .popup_cont{width:100%;height:100%;overflow:hidden;position: fixed;top:900px;left:0;z-index:9999;overflow-y: scroll;background: #fff;transition: all .3s ease-in-out;}
  .popup_cont::-webkit-scrollbar{display: none;}
  .popup_cont.active{top:0;}
  .popup_cont.active.loadMore{height:100%;/*top:-1rem;*/}
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

