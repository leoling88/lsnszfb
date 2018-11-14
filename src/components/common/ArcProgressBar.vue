<template>
    <div style="position: relative;">
      <!--线性渐变-->
      <defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#FF9600"/>
          <stop offset="100%" stop-color="#FF6600"/>
        </linearGradient>
      </defs>

      <!--圆弧进度条-->
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="svg_cont_box" ref="svg">
        <path class="bgPath" :d="`M${start.x} ${start.y} A${oR} ${oR} 0 ${bgFlag} 1 ${bgEnd.x} ${bgEnd.y}`" :stroke-width="strokeWidth"/>
        <path class="path" :d="`M${start.x} ${start.y} A${oR} ${oR} 0 ${flag} 1 ${end.x} ${end.y}`" :stroke-width="strokeWidth"/>
      </svg>
      <div class="text_cont">
        <span>{{currentProgress}}</span>天<br/>
        <span v-if="state == 1">可进行居住证办理</span>
        <span v-if="state == 2 && currentProgress >= 30">后可进行续签</span>
        <span v-if="state == 2 && currentProgress < 30 && currentProgress > 0">后居住证过期</span>
        <span v-if="state == 2 && currentProgress <= 0">居住证已过期</span>
      </div>
    </div>
</template>
<script>
  export default {
    props: {
      currentProgress: { // 当前进度
        type: [String,Number],
        default: 110
      },
      width: {  // 容器宽度
        type: [String, Number],
        default: '4.2rem'
      },
      strokeWidth: {  // 边宽
        type: [String,Number],
        default: 9
      },
      state: { // 领取居住证状态，1：表示没有领取,即用户刚登记信息，2：表示已经领取
        type: [String,Number],
        default: 2
      }
    },
    data() {
      return {
        oX: '',  // 圆心X坐标
        oY: '', // 圆心Y坐标
        oR: 0,  // 圆心半径
        startAngle: 130, // 圆弧开始角度
        endAngle: 130, // 圆弧结束角度，默认和开始角度一致
        maxEndAngle: 410,  // 圆弧最大角度
        max: '' // 最大值
      }
    },
    watch: {
      currentProgress: function (val, old) {
        this.drwaSVG(this.currentProgress)
      },
      state: function (val, old) {
        this.max = val == 1 ? 180 : 365
      }
    },
    computed: {
      start: function () { // 圆弧开始坐标（x,y）
        return this.coordMap(this.startAngle)
      },
      end: function () { // 圆弧结束坐标（x,y）
        return this.coordMap(this.endAngle)
      },
      bgEnd: function () {
        return this.coordMap(this.maxEndAngle)
      },
      flag: function () {
        if (this.endAngle - this.startAngle > 180) {
            return 1
        } else {
            return 0
        }
      },
      bgFlag: function () {
        if (this.maxEndAngle - this.startAngle > 180) {
          return 1
        } else {
          return 0
        }
      }
    },
    methods: {
      coordMap(angle) {  // 相应角度转换成圆弧上相应的坐标
        var ta = (360 - angle) * Math.PI / 180, tx, ty;
        tx = this.oR * Math.cos(ta); // 角度邻边
        ty = this.oR * Math.sin(ta); // 角度的对边
        return {
          x: this.oX + tx,
          y: this.oY - ty // 注意此处是“-”号，因为我们要得到的Y是相对于圆点坐标y（0,0）而言的。
        }
      },
      drwaSVG (size) { // 画圆弧
        this.endAngle = 130
        const percent = (this.maxEndAngle - this.startAngle) *  (this.max - size)/this.max + this.startAngle
        const _this = this
        const timer = setInterval(() => {
          if (_this.endAngle > percent) {
              clearInterval(timer)
          } else {
            _this.endAngle += 1
          }
        }, 10)
      }
    },
    mounted(){
      const svg = this.$refs.svg;
      svg.style.width = this.width
      svg.style.height = svg.clientWidth
      this.oX = svg.clientWidth/2
      this.oY = svg.clientHeight/2
      this.oR = svg.clientHeight/2 - this.strokeWidth
      this.max = this.state == 1 ? 180 : 365
//      this.drwaSVG(this.currentProgress)
    }
  }
</script>
<style scoped lang="less">
  .svg_cont_box{display:block;}
  .path{stroke:#fac901; fill:none;stroke-linecap: round;}
  .bgPath{stroke:#008CFF; fill:none;stroke-linecap: round;}
  .text_cont{width:4.2rem;position: absolute;left:0;top:1.6rem;text-align: center;color:#2a333c;font-size: .32rem;line-height:.56rem;
  span:first-of-type{font-size: .89rem;font-weight: bold;}
  }
</style>
