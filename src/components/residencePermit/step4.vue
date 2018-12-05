<template>
  <div>
    <div class="cont">
      <icon type="success" is-msg></icon>
      <h3>1. 居住登记成功</h3>
      <timeline class="timeline_box">
        <timeline-item v-for="item in 2" :key="item"></timeline-item>
      </timeline>
      <h3>2. 预约上面核实时间</h3>

      <custom-selector v-model="street" describe="选择办理街道地址" :options="streetOptions" isFirst="false" class="street_box"></custom-selector>
      <datetime :required="false" format="YYYY-MM-DD HH:mm" v-model="time" title="选择办理街道时间" :max-year="maxYear" :min-year="1900"></datetime>

    </div>
    <div @click="goHome" class="goHome"></div>

  </div>
</template>
<script>
  import {XInput, Cell, Icon, CellBox,Selector,Datetime,Timeline, TimelineItem} from 'vux'
  import customSelector from '../common/customSelector.vue'
  import api from '../../api/api'
  export default {
    components: {XInput,Cell, Icon, CellBox,Selector,Datetime,Timeline, TimelineItem,customSelector},
    data() {
      return {
        street: '',
        time: '',
        streetOptions: [
          {
            key: '1',
            value: '棠下街'
          }
        ],
        maxYear: new Date().getFullYear(),
      }
    },
    mounted(){

    },
    methods: {
      goHome() {
        this.$router.push({path:'/'});
      }
    }
  }
</script>
<style lang="less" scoped>
   .cont{text-align: center;line-height: .5rem;padding-top:.5rem;
    h3{line-height: 1rem;font-size: .4rem;}
   }
    .goHome{width:1.2rem;height:1.4rem;position: absolute;left:0;top:0;}
  .timeline_box{ padding:0;width:.2rem;margin:0 auto;
    li:last-of-type .vux-timeline-item-content{background: red;}
  }
  .street_box{margin-top: .5rem;
    p{background: red;}
  }
</style>
<style>
  .weui-icon-success,.weui-icon-success-no-circle{color:#1F67D0;}
  .timeline_box .vux-timeline-item-color,.timeline_box .vux-timeline-item-tail{background-color:#1F67D0;}
  .timeline_box li:last-of-type .vux-timeline-item-content{padding-bottom:.4rem;}
</style>
