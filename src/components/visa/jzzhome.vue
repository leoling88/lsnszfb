<template>
  <div>
    <div class="jzzhome">
      <div class="card">
        <p class="s1"><font class="fl">居住证</font><!--<i class="eye"></i>--></p>
        <p class="s2"><label for="">持卡人员：</label>{{formData.name}}</p>
        <p class="s2"><label for="">持证状态：</label>{{formData.state}}</p>
        <p class="s2"><label for="">证有效期：</label>{{formData.date}}</p>
        <p class="s2"><label for="">居住地址：</label>{{formData.add}}</p>
      </div>
    </div>
    <div class="jzzhome marT10 p0">
<!--       <p  href="" class="p1">居住证申领 <i class="iconarrow"></i></p >
      <p  class="p1">居住证补/换领 <i class="iconarrow"></i></p > -->
      <p  href="" class="p1" @click="goQianZhu">居住证签注 <i class="iconarrow"></i></p >
<!--       <p  href="" class="p1">进度查询 <i class="iconarrow"></i></p >
 -->   </div>

  </div>

</template>
<script>
  import { Alert,TransferDomDirective as TransferDom} from 'vux'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'notes',
    components: {Alert},
    directives: {TransferDom},
    data() {
      return {
        alipayId:  this.$route.query.alipayId,
        formData:{
          name:'',   // this.$route.params.name,
          idCard:'',   //  this.$route.params.idCard,
          openid:'',   //  this.$route.params.openid,
          opentype: 1,
          homeType: 1,
          state:'',
          add:'',
          date:'',
          rid:''
        }
      }  

    },
    methods: {
      goQianZhu() {
        api.checkURL({
          idCard: this.formData.idCard,
          openId: this.formData.openid,
          openType: this.formData.opentype           
        }).then(res => {
          const _data = res.data.obj
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            if(_data.step == 0){
              this.$router.push({path:'/notes/' + this.formData.idCard + '/' + this.formData.openid + '/' +  this.formData.name} )
            }else if(_data.step == 1){
              this.formData.rid = _data.rid
              this.formData.idCard = _data.idCard
              this.$router.push({path:'/returnStatus/' + this.formData.idCard + '/'+this.formData.rid});
            }

          }else{
            this.$store.commit('SHOWTOAST', '数据查询不成功!')
          }
        }).catch(() => {
          this.$store.commit('SHOWTOAST', '网络异常!')
        }) 



      },
      saolianData() {     //根据扫脸后获得数据
        if(this.alipayId.length > 0){
          localStorage.setItem("alipay_id", this.alipayId);    //记录opengid
          api.saolianJZZData(this.alipayId).then(res => {
            const _data = res.data.obj
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
              if(_data.aFlag){
                this.formData.name = _data.realName
                this.formData.idCard = _data.idCard
                this.formData.openid = _data.openId
                this.requireJZ()   //查询数据   
              }else{
                this.$store.commit('SHOWTOAST', '无法获取身份信息!')
              }

            }else{
              this.$store.commit('SHOWTOAST', '数据查询不成功!')
            }
          }).catch(() => {
            this.$store.commit('SHOWTOAST', '网络异常!')
          })           
        }else{
          this.$router.push({path:'/'});
        }

      },
      requireJZ () {
        api.requireJZZData({      //检查是否有签注资格
          idCard: this.formData.idCard,
          realName: this.formData.name,
          homeType: this.formData.homeType, 
          openid: this.formData.openid,
          openType: this.formData.opentype
        }).then(res => {
          const _data = res.data.obj
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            if (_data.flag) this.formData.state = '有效'
            else  this.formData.state = '无效'
            this.formData.add = _data.address
            this.formData.date = _data.limitDate

          }else{
            this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
          }
        }).catch(() => {
          // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        })        
      },

    },
    created() {
      if (this.alipayId){    //如果alipayId正确返回参数
        this.saolianData()
      }else{                   //否则掉用本地存储
        const _alipay_id = localStorage.getItem('alipay_id')  
        if(_alipay_id.length > 20){     //如果读取本地存储存在
          this.alipayId = _alipay_id
          this.saolianData()          
        }else{            //如果读取本地存储不存在返回首页
          this.$router.push({path:'/'});

        }
      }
      
      
    },     
  }
</script>
<style  scoped>

 .fl{float:left;}
 .marT10{margin-top:.2rem;}
 .jzzhome{padding:.2rem;background:#fff;}
 .jzzhome .card{height:3rem;padding:.3rem;color:#fff;font-size:.36rem;background:url(../../../static/images/jzz_bg1.png) no-repeat  0 0;background-size:100% 100%;}
 .jzzhome .p1{background:#fff;display:block;color:#000;padding:.2rem;}
.jzzhome .card p{min-height:.5rem;}
 .jzzhome .card .s1{padding-left:.65rem;background:url(../../../static/images/icon_card.png) no-repeat  0 .1rem;background-size:.5rem auto;overflow:hidden;}
 .jzzhome .card .s2{padding-left:2.2rem;font-size:.28rem; position: relative;}
 .jzzhome .card .s2 label{display: inline-table;width:1.5rem;color:#97dbdc;position: absolute;top:0;left:.65rem;}
 .jzzhome .card .eye{float:left;display: inline-table;width:1rem;height:.55rem;background:url(../../../static/images/icon-eyes.png) no-repeat  center center;background-size:.5rem auto;}
 .jzzhome.p0 p{margin:0 .2rem;border-bottom:.01rem solid #ccc; position: relative;}
  .jzzhome.p0 p:last-child{border:none;}
 .iconarrow{color:#b2b2b2;position:absolute;top:50%;right:0;margin-top:-.1rem;width:.2rem;height:.2rem;border-bottom:solid 1px currentColor;border-left:solid 1px currentColor;-webkit-transform:rotate(-135deg);transform:rotate(-135deg)}
 </style>
