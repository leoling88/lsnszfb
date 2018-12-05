<template>
  <div class="template_container">
    
  <!-- 民生登录-->
    <div v-show="isShowConfirm2.boxShow">
      <div class="box-1">
        <icon class="icons" type="warn" is-msg></icon>
        <div class=" title_style1"><b>温馨提示</b></div>
        <div style="font-size:.26rem;" v-show="!isShowConfirm2.Yes2"><p>您于<font class="color-1">{{isShowConfirm2.Time}}</font>已进行居住登记，<br/>
登记地址为：<font class="color-1">{{isShowConfirm2.Add}}</font>。

        </p></div>
        <div style="font-size:.26rem;" v-show="isShowConfirm2.Yes2"><p>{{isShowConfirm2.Text}}</p></div>

        <div>
          <span v-show="isShowConfirm2.Yes" class="check_detail_btn1" @click='onClickNot'>确认信息</span>
          <span v-show="isShowConfirm2.Not" class="check_detail_btn2"  @click='getStep_1'>变更居住地址</span>
          <span v-show="isShowConfirm2.Yes2"  class="check_detail_btn3"  @click='getStep_3'>确定(<span>{{isShowConfirm2.total}}</span>)</span>

        </div>
        
      </div>
    </div>
  <!-- 民生登录 end-->



  </div>
</template>
<script>
  import api from '../../api/api'
  import {Icon ,TransferDomDirective as TransferDom} from 'vux'
  import { mapState } from 'vuex'

  export default {
    name: 'alipayhome',
    directives: {
      TransferDom
    },
    components: {Icon},
    data() {
      return {
        idCard: this.$route.params.idCard,
        isShowConfirm2:{    //民生弹窗
          regMsg : '',
          boxShow: true,
          Yes: true,
          Not: true,
          Yes2: false,
          Text:'如果居住地址发生变更 ，请及时申报新的居住地址.',
          total: '5',
          Add:'',
          Time:''
        },

        homeType: this.$route.params.orginTypes,     //地区
        idCard: this.$route.params.idCard,
        userName: this.$route.params.userName,

      }
    },
    computed: {
      ...mapState([
        'loadingShow',
      ]),

    },
    methods: {

      certFace () {
        this.$store.commit('UPDATE_LOADING', true);
          api.getUserDetailsZFB({idCard:this.idCard}).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            const data = res.data
            if(data.success){
              this.isShowConfirm2.regMsg = localStorage.getItem("regMsg")
              this.isShowConfirm2.Add = data.attributes.address
              this.isShowConfirm2.Time = data.attributes.markTime
            }

          })
      },
      getStep_1(){    //更新登记信息
        this.$router.push({path:'/step1/' + this.idCard + '/1'});
      },
      getStep_3(){    //查看登记资料
        this.$router.push({path:'/step3/' + this.idCard});
      },
      onClickNot () {     //弹框提示
        this.isShowConfirm2.Yes = false
        this.isShowConfirm2.Not = false
        this.isShowConfirm2.Yes2 = true
        this.isShowConfirm2.Text = '如果居住地址发生变更，请及时申报新的居住地址。'
        let time = window.setInterval(() => {
          if(this.isShowConfirm2.total > 0) {
            this.isShowConfirm2.total --
          }else{
            window.clearInterval(time)
            this.getStep_3()
          }
        },1000)


      },


//20180810 增加 民生入口 end


      checkRegister () {
        if (this.registerFlag == 2) {
          this.$router.push({path:'/error'});
        } else {
          this.isShowConfirm = !this.isShowConfirm
        }
      },
    },
    mounted(){
      this.certFace ()
    },
    destroyed () {
    }
  }
</script>

<style lang="less" scoped>
.color-1{color:#0091FF;}
.box-1{padding:1rem .25rem; text-align:center; }
.title_style1{padding:.3rem 0;}
.check_detail_btn1,.check_detail_btn2,.check_detail_btn3{display:block;width:100%;height:.88rem;margin:.4rem 0;line-height:.88rem;border-radius: .1rem;text-align: center; font-size: .28rem;}
.check_detail_btn1{color:#fff;background:#0091FF;}
.check_detail_btn2{display:block;color:#0091FF;border:1px solid  #0091FF;}
.check_detail_btn3{display:block;color:#08d639;border:1px solid #08d639;}
</style>
