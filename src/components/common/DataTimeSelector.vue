<template>
  <div style="background: #fff;">
    <cell class="custom_cell" :title="describe" :value="itemName" is-link @click.native="show = !show && !disabled" :disabled="disabled">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <div :class="['popup_cont',show && !disabled ? 'active' : '']" class="popup_cont" ref="popup">
      <div class="title">选择日期时间<span @click="show = !show">取消</span></div>

      <ul class="lf_box">
          <li v-for="(item,index) in leftOptions" @click="selectDate(item, index)">{{item}}</li>
      </ul>

      <ul class="list_cont">
        <template v-for="(item, index) in options" >
          <li :key="index" @click="checkItem(item.key, item.value, item.remainder)">
            {{item.value.split(' ')[1]}}<span v-if="item.remainder">剩<em>{{item.remainder}}</em></span>
          </li>
        </template>
        <li :class="['no_data',options.length == 0 ? 'show_no_data' : '']">
          <load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载' : '当前无预约时间'"></load-more>
        </li>
      </ul>
    </div>

    <!--遮罩层-->
    <div :class="['mask_box', show ? 'show' : '']" @click="show = !show"></div>

  </div>
</template>
<script>
  import {Popup,Cell, Icon, LoadMore } from 'vux'
  export default {
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      value: [String, Number],  // 通过v-model指令传递给子组件的属性
      leftOptions: Array, // 数据
      options: Array, // 数据
      isFirst: { // 是否第一次选择
        type: Boolean,
        default: true
      },
      disabled: { // 是否可用
        type:Boolean,
        default: false
      },
      showLoading: { // 是否在加载中
        type:Boolean,
        default: false
      }
    },
    components: {Popup, Cell,Icon, LoadMore },
    data() {
      return {
        title: '自定义',
        itemName: '',  // key对应的文本
        show: false,
        appointmentDate:'' // 预约日期
      }
    },
    watch: {
      value: function(val, old) {
        if (val != old) this.assignments();
//        this.$emit('timeChange',val, this.itemName);
      }
    },
    updated(){
      this.assignments();
    },
    methods: {
      selectDate (item, index) {  // 选择左边选项
        if (this.appointmentDate == item) return
        const dateList = document.querySelectorAll('.lf_box li')
        this.$emit('dateChange',item);
        this.appointmentDate = item
        for(let i=0;i<dateList.length;i++) {
          if (index == i) {
            dateList[i].className = 'on'
          } else {
            dateList[i].className = ''
          }
        }
      },
      checkItem(key, val, remainder){
//        if (!this.appointmentDate || this.itemName == val || remainder == 0) return   // 新旧值一样，剩余数位0，禁止触发
        if (remainder == 0) return   // 新旧值一样，剩余数位0，禁止触发
        this.itemName = val;
        this.$emit('input',key);
        this.$emit('timeChange',val, this.appointmentDate);
        this.show = !this.show;
      },
      assignments(){  // 回显
        const options = this.$props['options'];
        options.forEach((item)=>{
          if (item.key == this.$props['value']) this.itemName = item.value;
        });
      }
    },
    mounted () {
      this.assignments();
    }
  }
</script>
<style lang="less" scoped>
  .custom_cell{position: relative;box-sizing: border-box;
    &:before{content: "";display: block;height:1px;width:100%;top:0;left:15px;}
  }
  .popup_cont{
    width:100%;height:6.6rem;overflow:hidden;position: fixed;bottom:-6.6rem;left:0;z-index:9999;background: #fff;transition: all .5s ease;
    .title{line-height: 1rem;background: #eee;font-size: .32rem;text-indent: .2rem;
      span{display: inline-block;float: right;width:1.5rem;color:#1F67D0;text-align: center;text-indent: 0;}
    }
  }
  .popup_cont.active{bottom:0;}
  .lf_box{
    width:35%;height:5.6rem;background: #eee;float: left;overflow-y: scroll;
    li{line-height: 1.1rem;text-align: center;}
    .on{background: #fff;}
  }
  .lf_box::-webkit-scrollbar{display: none;}
  .list_cont{
    width:65%;height:5.6rem;overflow-y: scroll;background: #fff;float: right;
    li{
      width:80%;margin:.2rem auto;line-height: .9rem;border-radius: .1rem;background: #eee;text-indent:.2rem;
      span{float: right;margin-right:.2rem;}
      em{color:#1F67D0;font-size: .4rem;margin-left:.05rem;}
      .load_more{width:100%;margin-top:2rem;}
    }
    .no_data{display:none;line-height: 4.6rem;text-align: center;font-size: .34rem;background:none;color:#999;}
    .show_no_data{display: block;}
  }
  .list_cont::-webkit-scrollbar{display: none;}
  .weui_icon_warn{/*float: right;*/display: inline-block;}
  .weui-icon-info{margin-right:.15rem;}

  .mask_box{width:100%;height:100%;display: none;overflow: hidden;position: fixed;left:0;top:0;z-index: 9998;background: rgba(0,0,0,.6);}
  .mask_box.show{display: block;}

</style>

