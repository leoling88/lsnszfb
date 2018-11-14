<template>
  <div class="selector_box">

    <x-button class="add_adress_btn" @click.native="showPopup">{{addAdressBtn.text}}</x-button>

    <div :class="['popup_cont',show && !disabled ? 'active' : '']" class="popup_cont" ref="popup">
      <div class="title">新增地址<span @click="cancelBtn">取消</span></div>

      <x-input v-model="newAddress" title="详细地址" placeholder="请输入您所在的街道巷、门牌号、房号" :show-clear="true" placeholder-align="right" text-align="right" class="newAddress_input" @on-change="newAddressChange"></x-input>

      <x-button class="add_adress_btn save_btn" @click.native="showPopup">保存</x-button>

    </div>

    <!--遮罩层-->
    <div :class="['mask_box', show ? 'show' : '']" @click="show = !show"></div>

  </div>
</template>
<script>
  import {XInput, XButton, Popup,Group, Cell, Icon, LoadMore} from 'vux'
  export default {
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      value: [String, Number],  // 通过v-model指令传递给子组件的属性
      options: Array, // 数据
      disabled: { // 是否可用
        type:Boolean,
        default: false
      },
      showLoading: { // 是否在加载中
        type:Boolean,
        default: false
      }
    },
    components: {XInput, XButton, Popup, Group, Cell,Icon, LoadMore},
    data() {
      return {
        title: '自定义',
        itemName: '',  // key对应的文本
        show:false,
        newAddress: '',
        addAdressBtn: {
          text: '+ 新增地址',
          isOpen: false
        }
      }
    },
    watch: {
      value: function(val, old) {
        if (val) {
          this.addAdressBtn.text = '编辑地址'
        } else {
          this.addAdressBtn.text = '+ 新增地址'
        }
        this.newAddress = val
      }
    },
    methods: {
      newAddressChange (val) {
        this.$emit('input',val);
        this.$emit('change',val);
      },
      showPopup () { // 打开组件
        if (!this.disabled) {
          this.show = !this.show
        } else {
          this.$store.commit('SHOWTOAST', '请先选择街道！');
        }
      },
      cancelBtn () {
        this.newAddress = ''
        this.show = !this.show
      }
    },
    mounted () {
      this.newAddress = this.value
      if (this.value) {
        this.addAdressBtn.text = '编辑地址'
      } else {
        this.addAdressBtn.text = '+ 新增地址'
      }
    }
  }
</script>
<style lang="less" scoped>
  .add_adress_btn{width: 6.8rem;height:.88rem;margin:.5rem auto;line-height:.88rem;border-radius: .1rem;text-align: center;color:#fff;font-size: .32rem;background: #448AFF;border:none;}
  .save_btn{position: absolute;bottom:.2rem;left:50%;margin-left:-3.4rem;}
  .newAddress_input{
    margin-top:.2rem;
    &:before{display: none;}
  }


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

