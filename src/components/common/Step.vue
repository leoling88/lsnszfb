<template>
  <div>
    <dl class="step_cont">
      <dt><img :src="`./static/images/step${step}.png`"></dt>
      <!--<dd><span>基础信息</span><span>详情信息</span><span>信息确认</span></dd>-->
      <dd><span>{{stepText1}}</span><span>{{stepText2}}</span><span>{{stepText3}}</span></dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: {
      step: {
        type: [Number,String],
        default: 1
      },
      stepText1: {
        type: String,
        default: ''
      },
      stepText2: {
        type: String,
        default: ''
      },
      stepText3: {
        type: String,
        default: ''
      },
    },
    data() {
        return {}
    }
  }
</script>
<style scoped lang="less">

  .step_cont{width:100%;height:1.5rem;padding-top:.4rem;overflow:hidden;background: #1f67d0;border-bottom:.2rem #eee solid;}
    dl{
      width:100%;height:1.5rem;padding-top:.4rem;overflow:hidden;background: #1f67d0;border-bottom:.2rem #eee solid;
      dt{
        width:5.3rem;overflow: hidden;margin:0 auto;text-align: center;
        img{width:5.3rem;height:.48rem;}
      }
      dd{
        width:6.5rem;overflow: hidden;margin:0 auto;
        span{width:33%;display: inline-block;color:#b5d7ff;}
        span:first-of-type{text-indent: .25rem;}
        span:nth-of-type(2){text-align: center;}
        span:last-of-type{text-align: right;}
      }
    }


</style>
