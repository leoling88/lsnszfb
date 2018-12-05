<template>
  <div class="selector_box">

    <cell class="custom_cell" :title="describe" :value="itemName" :is-link="isLink" @click.native="showPopup" :disabled="disabled">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <div :class="['popup_cont',show && !disabled ? 'active' : '']" class="popup_cont" ref="popup">
      <div class="title">选择{{describe}}<span @click="show = !show">取消</span></div>
      <div class="poput_wraper">
        <ul class="list_cont" ref="searchListCont">
          <template v-for="(item,index) in options">
            <li @click="checkItem(item.key, item.value, index)" :key="index" :class="[item.key == value ? 'active' : '']">
              {{item.value}}
              <icon type="success-no-circle" style="margin-top:.1rem;"></icon>
            </li>
          </template>
          <li :class="['no_data',options.length == 0 ? 'show_no_data' : '']">
            <load-more class="load_more" :show-loading="options.length == 0" :tip="options.length == 0 ? '正在加载' : '暂无数据'"></load-more>
            <!--<load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载' : '暂无数据'"></load-more>-->
          </li>
        </ul>
      </div>
    </div>

    <!--遮罩层-->
    <div :class="['mask_box', show ? 'show' : '']" @click="show = !show"></div>

  </div>
</template>
<script>
  import {Popup,Group, Cell, Icon, LoadMore} from 'vux'
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
      readOnly: { // 此状态控制可展示列表，但不可选择
        type:Boolean,
        default: false
      },
      showLoading: { // 是否在加载中
        type:Boolean,
        default: false
      },
      isLink: { // 是否显示箭头
        type:Boolean,
        default: true
      }
    },
    components: {Popup, Group, Cell,Icon, LoadMore},
    data() {
      return {
        title: '自定义',
        itemName: '',  // key对应的文本
        show:false,
        scrollTop: ''
      }
    },
    watch: {
      value: function(val, old) {
        this.$emit('change',val, this.itemName);
        if (val != old) this.assignments();
      },
      show: function (val, old) {
        if (val) {
          document.documentElement.style.position = 'fixed'
        } else {
          document.documentElement.style.position = 'static'
        }
        window.scrollTo(0, this.scrollTop)
      }
    },
    updated(){
      this.assignments();
    },
    methods: {
      checkItem(key, val, index){
        if (this.readOnly) {
          this.$emit('on-click',key, val);
        } else {
          const lis = this.$refs.searchListCont.children
          if (this.itemName != val) {  // 如果值不一致，触发
            this.itemName = val;
            this.$emit('input',key, val);
          }
          for(let i=0; i < lis.length; i++) {
            if (i == index) {
              lis[i].className = 'active'
            } else if (i != lis.length - 1) {
              lis[i].className = ''
            }
          }
        }
        this.show = !this.show;
      },
      assignments(){  // 回显
        const options = this.$props['options'];
        options.forEach((item)=>{
          if (item.key == this.$props['value']) this.itemName = item.value;
        });
      },
      showPopup () { // 打开组件
        if (!this.disabled || this.readOnly) {
          this.show = !this.show
          this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          document.documentElement.style.top = -this.scrollTop + 'px'
          window.scrollTo(0, this.scrollTop)
        }
      }
    },
    mounted () {
      this.assignments();
    }
  }
</script>
<style lang="less" scoped>
  .popup_cont{
    width:100%;height:7.56rem;overflow:hidden;position: fixed;bottom:-7.56rem;left:0;z-index:9999;background: #fff;transition: all .5s ease;
    .title{line-height: 1rem;background: #eee;font-size: .32rem;text-indent: .2rem;
      span{display: inline-block;float: right;width:1.5rem;color:#1F67D0;text-align: center;text-indent: 0;}
    }
    .poput_wraper{height:6.56rem;overflow-y: scroll;}
    .poput_wraper::-webkit-scrollbar{display: none;}
  }
  .popup_cont.active{bottom:0;}
  .mask_box{width:100%;height:100%;display: none;overflow: hidden;position: fixed;left:0;top:0;z-index: 9998;background: rgba(0,0,0,.6);}
  .mask_box.show{display: block;}
  .selector_box .custom_cell{position: relative;box-sizing: border-box;
    &:before{content: "";display: block;height:1px;width:100%;top:0;left:15px;}
  }

  .list_cont{
    width:100%;overflow: hidden;background: #fff;
    li{text-indent:.3rem;border-bottom:1px solid #eee;display: block;height: .8rem;line-height: .8rem;
      .load_more{width:80%;margin-top:1rem;}
    }
    li:last-of-type{border:none;}
    .no_data{display:none;line-height: 4.6rem;text-align: center;font-size: .34rem;background:none;color:#999;}
    .show_no_data{display: block;}
    .weui-icon-success-no-circle{color: red;float: right;margin-right: .3rem;display: none;}
    li.active .weui-icon-success-no-circle{display: inline-block;}
  }
  .weui_icon_warn{/*float: right;*/display: inline-block;}
  .weui-icon-info{margin-right:.15rem;}
</style>
<style>
  .custom_cell .vux-label{width:2rem;}
</style>
