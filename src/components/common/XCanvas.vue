<template>
  <div >
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      initCanvas(){
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
        //填充颜色
//        ctx.fillStyle = "rgba(0,222,255, 0.2)";
//开始绘制路径
        ctx.beginPath();
//左上角
        ctx.moveTo(0, canvas.height/2);
//右上角
        ctx.lineTo(canvas.width, canvas.height/2);
//右下角
        ctx.lineTo(canvas.width, canvas.height);
//左下角
        ctx.lineTo(0, canvas.height/2);
//左上角
        ctx.lineTo(0, canvas.height/2);
//闭合路径
        ctx.closePath();
//填充路径
        ctx.fill();

        //如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
        window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
        })();
        var step = 0;
        //定义三条不同波浪的颜色
        var lines = ["rgba(255,255,255, 0.1)", "rgba(255,255,255, 0.1)"];
        function loop(){
          ctx.clearRect(0,0,canvas.width,canvas.height);
          step++;
          //画3个不同颜色的矩形
          for(var j = lines.length - 1; j >= 0; j--) {
            ctx.fillStyle = lines[j];
            //每个矩形的角度都不同，每个之间相差45度
            var angle = (step+j*180)*Math.PI/180;
            var deltaHeight   = Math.sin(angle) * 30;
            var deltaHeightRight   = Math.cos(angle) * 30;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height/2+deltaHeight);
            ctx.bezierCurveTo(canvas.width /2, canvas.height/2+deltaHeight, canvas.width / 2, canvas.height/2+deltaHeightRight, canvas.width, canvas.height/2+deltaHeightRight);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.lineTo(0, canvas.height/2+deltaHeight);
            ctx.closePath();
            ctx.fill();
          }
          requestAnimFrame(loop);
        }

        loop()

      }
    },
    mounted () {
      this.initCanvas();
    }
  }
</script>
<style lang="less" scoped>
  #canvas{position:absolute;top:0px;left:0px;z-index:1;}
</style>
