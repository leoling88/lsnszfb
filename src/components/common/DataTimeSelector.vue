<template>
  <div style="background: #fff;">
    <cell class="custom_cell" :title="describe" :value="itemName" is-link @click.native="showPopup" :disabled="disabled">
      <icon v-if="!isFirst && itemName == ''" type="warn"></icon>
    </cell>

    <div :class="['popup_cont',show && !disabled ? 'active' : '']" class="popup_cont" ref="popup">
      <div class="title">选择日期时间<span @click="show = !show">取消</span></div>

      <ul class="lf_box">
          <li v-for="(item,index) in lastSevenDates" @click="selectDate(item, index)">{{item}}</li>
      </ul>

      <ul class="list_cont">
        <template v-for="(item, index) in options">
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
  import api from '../../api/api'
  import moment from 'moment'
  import {Popup,Cell, Icon, LoadMore } from 'vux'
  export default {
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      streetTownCode: { // 街镇代码
        type: String,
        default: ''
      },
      value: [String, Number],  // 通过v-model指令传递给子组件的属性
      isFirst: { // 是否第一次选择
        type: Boolean,
        default: true
      },
      disabled: { // 是否可用
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
        appointmentDate:'', // 预约日期
        scrollTop: '',
        showLoading: false,  // 是否在加载中
        options: [] // 时间数据
      }
    },
    computed: {
      lastSevenDates: function () { // 获取最近7天日期
        let arr = []
        let date = new Date()
        for(let i = 0; i< 9; i++) {
          let weekDay = date.getDay(date.getDate() + 1)
          let day = moment(date.setDate(date.getDate() + 1)).format("YYYY-MM-DD")
          if (arr.length < 7) arr.push(day)
        }
        return arr
      }
    },
    watch: {
      value: function(val, old) {
        if (val != old) this.assignments();
//        this.$emit('timeChange',val, this.itemName);
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
      selectDate (item, index) {  // 选择左边选项
        if (this.appointmentDate == item) return
        const dateList = document.querySelectorAll('.lf_box li')
        this.appointmentDate = item
        this.queryYyszList(this.appointmentDate)
        for(let i=0;i<dateList.length;i++) {
          if (index == i) {
            dateList[i].className = 'on'
          } else {
            dateList[i].className = ''
          }
        }
      },
      checkItem(key, val, remainder){
        if (remainder == 0) return   // 新旧值一样，剩余数位0，禁止触发
        this.itemName = val;
        this.$emit('input',key);
        this.$emit('timeChange',val, this.appointmentDate);
        this.show = !this.show;
      },
      assignments(){  // 回显
        this.options.forEach((item)=>{
          if (item.key == this.$props['value']) this.itemName = item.value;
        });
      },
      showPopup () { // 打开组件
        if (!this.disabled) {
          this.show = !this.show
          this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          document.documentElement.style.top = -this.scrollTop + 'px'
          window.scrollTo(0, this.scrollTop)
        }
      },
      filerData(srcData, toData){ // 筛选数据字典
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              value: `${item.szrq} ${item.kjsj}~${item.jssj}`,
              key: item.szid,
              remainder: item.yyzdz - item.dqyyz  // 剩余预约量
            })
          });
        }
      },
      queryYyszList (date) {  // 最近七天预约登记
        this.showLoading = true
        api.laisuiQuerySmhsszList({
          openid: this.$route.query.openid,
          wxsqn: this.$route.query.openid,
          account: this.$route.params.idNo,
          jz: this.streetTownCode,
          yyrq: date
        }).then((res) => {
          if (res.data.success) {
            const data = JSON.parse(res.data.jsonRes[0]);
            if (data.ackCode == 1) {
              this.options = []
              this.filerData(data.dataList, this.options);
            } else {
              this.$store.commit('SHOWTOAST', data.errorMessage.replace(/\[\S+\]/g, ''));
            }
          }
          this.showLoading = false
        }).catch((res) => {
          this.showLoading = false
        })
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
    width:100%;height:6.6rem;overflow:hidden;position: fixed;bottom:-6.6rem;left:0;z-index:9999;background: #fff;transition: all .5s ease;opacity: 0;
    .title{line-height: 1rem;background: #eee;font-size: .32rem;text-indent: .2rem;
      span{display: inline-block;float: right;width:1.5rem;color:#1F67D0;text-align: center;text-indent: 0;}
    }
  }
  .popup_cont.active{opacity: 1;bottom:0;}
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

