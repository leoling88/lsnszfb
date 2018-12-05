<template>
  <div>
    <cell class="custom_cell" :title="describe" :value="itemName"  :is-link="isLink"  @click.native="showPopup" :disabled="disabled">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <div :class="['popup_cont',show && !disabled ? 'active' : '', showLoadMore ? 'loadMore' : '']" @scroll="scrollFn" ref="searchList">
      <!--关键字搜索-->
      <div class="search_box" v-show="show && !disabled && hasSearch">
        <x-input v-model="keyWord" title="搜索" :debounce="1500" :show-clear="true" @on-change="keyWordChange" placeholder="请输入要搜索的关键字" ref="searchInput">
          <icon type="search" slot="label" style="margin-right:.2rem;"></icon>
        </x-input>
      </div>

      <!--选择列表-->
      <template>
        <div class="no_data" v-if="options.length == 0" @click="show = !show"><icon type="info"></icon>暂无数据</div>
        <ul class="list_cont" ref="searchListCont">
          <template v-for="item in options">
            <!--checkItem方法内后三个参数不是必传，主要是针对企业信息准备的，他们分别是：单位地址，企业编号，企业电话-->
            <li @click="checkItem(item.key, item.value, item.dwdz, item.qybh, item.lxdh)">{{item.value}}</li>
          </template>
          <!--<li :class="['no_data',options.length == 0 ? 'show_no_data' : '']">-->
            <!--<load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载' : '暂无数据'"></load-more>-->
          <!--</li>-->
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
      isLink: { // 是否显示箭头
        type:Boolean,
        default: true
      }
    },
    components: {XInput,Cell,Icon,LoadMore },
    data() {
      return {
        title: '自定义',
        itemName: '',
        unitAdress: '', // 单位地址
        unitNumber: '', // 单位编号
        unitPhone: '', // 单位电话
        show:false,
        keyWord: '',
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
//        if (val != old) this.assignments();
//        this.$emit('change',val, this.itemName);
        if (val == '') {
          this.itemName = ''
        } else {
          this.assignments();
        }
        this.$emit('change',val, this.itemName, this.unitAdress, this.unitNumber, this.unitPhone);
      }
    },
    methods: {
      keyWordChange (value) {  // 搜索关键词转换
        this.currentPage = 1
        this.$emit('searchWord', this.currentPage, value, true)
        this.$store.commit('UPDATE_LOADING', true);
        this.isPullup = true
        this.$refs.searchList.scrollTop = 0
      },
      checkItem (key, val, dwdz, qybh, lxdh) {
        if (this.itemName != val) {
          this.itemName = val;
          this.unitAdress = dwdz
          this.unitNumber = qybh
          this.unitPhone = lxdh
          this.$emit('input',key, val, dwdz, qybh, lxdh);
        }
        this.show = !this.show;
        if (this.showLoadMore) {
          this.$store.commit('UPDATE_LOAD_MORE', false);
        }
      },
      assignments () {  // 回显
        const options = this.$props['options'];
        options.forEach((item) => {
          if (item.key == this.$props['value']) this.itemName = item.value;
        });
      },
      scrollFn () {  // 滚动事件
        const scrollTop = this.$refs.searchList.scrollTop;
        const wrapHeight = this.$refs.searchList.clientHeight
        const totalHeight = this.$refs.searchListCont.clientHeight
//        console.log(scrollTop + wrapHeight - 41, totalHeight)
        if (this.isPullup && !this.showLoadMore && (scrollTop + wrapHeight - 42 >= totalHeight)) { // 触底
          this.$emit('scrollBottom', ++this.currentPage, this.keyWord);
          this.$store.commit('UPDATE_LOAD_MORE', true);
        }
      },
      disablePullup () { // 禁止下拉刷新
        this.isPullup = false
      },
      showPopup () {
        this.show = !this.show;
        this.keyWord = ''
      }
    },
    mounted () {
      this.assignments();
    }
  }
</script>
<style lang="less" scoped>
  .search_box{width:100%;height:42px; overflow: hidden; }
  .vux-x-input{width:100%;background:#fff;border-bottom:1px solid #eee;position: fixed;left: 0;top:0;z-index:99999;}


  .popup_cont{width:100%;height:100%;overflow:hidden;position: fixed;top:900px;left:0;z-index:9999;overflow-y: scroll;background: #fff;transition: all .5s ease;}
  .popup_cont::-webkit-scrollbar{display: none;}
  .popup_cont.active{top:0;}
  .popup_cont.active.loadMore{height:100%;top:-1rem;}
  .custom_cell{position: relative;box-sizing: border-box;
    &:before{content: "";display: block;height:1px;width:100%;top:0;left:15px;}
  }
  .list_cont{
    width:100%;overflow: hidden;background: #fff;
    li{text-indent:.3rem;border-bottom:1px solid #eee;display: block;height: .8rem;line-height: .8rem;}
    li:last-of-type{border:none;}
    .no_data{display:none;line-height: 4.6rem;text-align: center;font-size: .34rem;background:none;color:#999;}
    .show_no_data{display: block;}
  }
  .weui_icon_warn{float: right;}
  .weui-icon-info{margin-right:.15rem;}
  .no_data{
    line-height: 1.5rem;height:100%;text-align: center;font-size: .38rem;
  }
  .loader_more{width:100%;height:0;line-height:.8rem;overflow:hidden;margin:0;position: fixed;left: 0;bottom:0;background: #fff;transition: all .5s ease;}
  .showHeight{height:1rem;}
</style>

