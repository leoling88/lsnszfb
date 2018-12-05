<template>
  <div class="template_container" style="min-height:740px;background:#fff;">

      <div class="cont_box">
        <!--居住证资格校验-->
        <div class="step3_cont">
          <div class="sucess_cont cont2">

            <div v-if="formData.status == 'success'">
              <img class="icon_success" src="../../../static/images/icon_success.png" />
                <h3>提交成功<span v-if="formData.types == 'S1'">您已提交成功，请携带本人居民身份证、居住证和居住地住址、就业、就读等证明材料之一，到街道办理。</span><span v-if="formData.types == 'S2'">您已于<font class="color-blue">2018年3月23日</font>提交成功，请携带本人居民身份证、居住证和居住地住址、就业、就读等证明材料之一，到街道办理。</span>
                <span v-if="formData.types == 'S3'">您已成功提交签注居住证申请，请留意审核结果</span></h3>

            </div>
            <div v-else-if="formData.status == 'failure'">
              <img class="icon_success" src="../../../static/images/icon_fail.png" />
              <h3 >校验不通过
                <span v-if="formData.types == 'F1'">您有正在办理的居住证业务，不能重复办理</span>
                <span v-else-if="formData.types == 'F2'">您不满足居住证签注条件，请<font>{{formData._time}}</font>后再提交申请</span>
                <span v-else-if="formData.types == 'F3'">您的居住证地址与居住登记地址不一致，如需延期，请到受理点办理居住证地址擦写</span>
                <span v-else-if="formData.types == 'F4'">您暂无居住证，请申请居住证</span>
                <span v-else-if="formData.types == 'F5'">您的居住证信息与居住登记信息不一致，如需延期，请到受理点办理变更更正</span>
                <span v-else-if="formData.types == 'F6'">您的居住登记已注销，请先申报居住登记</span>
                <span v-else-if="formData.types == 'F7'">您的居住证已注销，请重新申领居住证</span>
                <span v-else-if="formData.types == 'F8'">您的居住证已注销，请到所在街道服务中心重新申领居住证</span>
                <span v-else-if="formData.types == 'F9'">您暂无居住证，请先申领居住证</span>
               <span v-else-if="formData.types == 'F10'">您不满足居住证续签条件，且您的居住地址不在本区下登记，如需签注，请先变更居住登记信息</span>                

              </h3>



            </div>

            <div v-else-if="formData.status == 'error'">
              <img class="icon_success" src="../../../static/images/icon_fail.png" />

              <h3 >提交失败
                <span v-if="formData.types == 'E1'">服务器维护中，请稍后重新尝试提交申请</span>
                <span v-if="formData.types == 'E2'">业务系统接口错误，请稍后重新尝试提交申请</span>
              </h3>

            </div>
            <div v-else-if="formData.status == 'important'">
              <img class="icon_success" src="../../../static/images/icon_tanhao.png"  style="height:auto;" />
              <h3>温馨提示<span v-if="formData.types == 'I1'">您的居住登记信息需进一步核实，请到居住地址所属街道服务中心进行核实后再进行签注；</span></h3>

            </div>


          </div>
          
          <div class="check_detail_btn" v-if="formData.status == 'error'">重新提交</div>
          <div class="check_detail_btn" v-else @click="goHome">返回首页</div>
          <div class="check_detail_btn2"  @click="clickProgress" v-show="formData.isEms">查看办理进度</div>
          <div class="check_detail_btn2" v-if="formData.status == 'error'" @click="goHome">返回首页</div>
<!--           <div class="check_detail_btn2" v-if="formData.status == 'failure' && formData.types == 'F3' || formData.status == 'failure' && formData.types == 'F6' || formData.status == 'failure' && formData.types == 'F7'">申领居住证</div>
 -->
        </div>
      </div>

      <!--居住地址信息--  得点人员才会出现-->  

      <div class="box marTB1" v-if=" formData.status == 'important' && formData.types == 'I1'">
        <group title="居住地址信息" class="group_cont borbte5 changeCell">
          <cell title="地区" :value="formData2.area"></cell>
          <cell title="街镇" :value="formData2.street"></cell>
          <cell title="街道巷" :value="formData2.town"></cell>
          <cell title="门牌" :value="formData2.add"></cell>
          <cell title="房号" :value="formData2.number"></cell>
          <cell title="派出所" :value="formData2.polices"></cell>
<!--           <cell title="居住事由" :value="formData2.reason"></cell>
          <cell title="联系方式" :value="formData2.phone"></cell>      -->   
        </group>
        <div class="link" @click="gotoSeverList">查看服务站信息>></div>       
      </div>




  </div>
</template>
<script>
  import {Icon,Group,Cell,TransferDomDirective as TransferDom} from 'vux'
  import dataTimeSelector from '../common/DataTimeSelector.vue'
  import moment from 'moment'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'zgCheck',
    components: { Icon,Group,Cell},
    directives: {TransferDom},
    data() {
      return {
        
        formData: {
          idCard: this.$route.params.idCard,
          rid: this.$route.params.cid,
          status: this.$route.params.Return,
          types: this.$route.params.typesNum,
          isEms:false,
          _type: this.$route.query._type,   //判断来自哪里的校验
          _state: this.$route.query._state,   //来自校验 状态类型
          _typeId: this.$route.query._num, //来自校验    状态码
          _time: this.$route.query._time, //来自资格校验    日期
        },
        formData2:{
          area:'',
          street:'',
          town:'',
          add:'',
          number:'',
          polices:'',
          reason:'',
          phone:'',
          streetName:'',
          streetTel:'',
          streetAdd:'',

        },
        returnPre: 0

      }
    },
    computed: {
      ...mapState([
        'wxsqn','comGuid'
      ])
    },
    methods: {

      clickProgress () {
          this.returnPre = 1
          this.$router.push({path:'/progressBar/' + this.formData.idCard + '/' + this.formData.rid});
      },
      gotoSeverList () {
          this.returnPre = 2
          this.$router.push({path:'/serverlists/' + this.formData.idCard});
      },
      requireJZZ () {    //获取居住证信息
        // if (this.formData.status == 'failure' && this.formData.types == 'F9' || this.formData.status == 'important' && this.formData.types == 'I1') {
          api.requireJZZ(this.formData.idCard).then(res => {   
            this.$store.commit('UPDATE_LOADING', false);
            const _data = res.data.attributes
            if(res.data.success) {
              this.formData.isEms = _data.isEms
              this.formData2.area = _data.xzq_dict
              this.formData2.street = _data.jz_dict
              this.formData2.town = _data.jddm_dict
              this.formData2.add = _data.mpmc
              this.formData2.number = _data.dy
              this.formData2.polices = _data.pcs_dict
            }else{
              this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
            }
          }).catch(() => {
            this.$store.commit('SHOWTOAST', '网络异常!')
          })
        // }

      },
      requireDatas () { 
        this.$store.commit('UPDATE_LOADING', true);
        if (this.formData._type == 'JZZjy'){     //判断如果来自居住证校验
          this.formData.status = this.formData._state 
          this.formData.types = this.formData._typeId
          this.$store.commit('UPDATE_LOADING', false);  
        }else if(this.formData._type == 'ZGjy'){    //判断如果来自资格校验
          this.formData.status = this.formData._state 
          this.formData.types = this.formData._typeId
          this.$store.commit('UPDATE_LOADING', false);  
        }else{        //判断如果通过签注则进行查询
          api.setQZDatas({rid:this.formData.rid}).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            const _data = res.data.obj
            if(res.data.success) {
              if(_data.type == 1) {
                this.formData.status = 'success'
                this.formData.types = 'S1'
              }else if (_data.type == 2) {
                this.formData.status  = 'error'
                this.formData.types = 'E1'
              }else if (_data.type == 3) {
                this.formData.status  = 'error'
                this.formData.types = 'E2'
              }
            }else{
              this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
            }
          }).catch(() => {
            // this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('SHOWTOAST', '网络异常!')
          });
          api.JDprogress(this.formData.rid).then(res => {         //检查是否EMS
            const _data = res.data.obj
            if(res.data.success) {
              if(_data.isEms){
               this.formData.types = 'S3' 
               this.formData.isEms = true
              }
            }else{
              this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
            }
          })

        }

      },
      goHome() {   //返回首页
        this.$router.push({path:'/jzz'});
      },
      judgejump() {     //判断返回、跳转
        if (this.returnPre == 0) {    //返回到首页
          this.goHome()
        }else if(this.returnPre == 1){    //跳转到查看进度
          this.$router.push({path:'/progressBar/' + this.formData.idCard + '/' + this.formData.rid});

        }else if(this.returnPre == 2){    //跳转到查看服务站列表
          this.$router.push({path:'/serverlists/' + this.formData.idCard});

        }
      },


    },
    created () {
      this.requireJZZ ()    //请求
      this.requireDatas()   //请求数据
      localStorage.setItem('backType','ban')   //用于禁止返回上一步

    },
    mounted () {
      document.addEventListener('optionMenu', this.goHome, false); // 
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.goHome, false); //
    }



}



</script>
<style lang="less" scoped>
  .step3_cont{
    width:100%;overflow:hidden;line-height: .5rem;position: relative;background: #fff;
    .sucess_cont{
      width:100%;background:#fff;padding:.8rem 0 .4rem 0;
      .icon_success{display: block;width:2.4rem;height:2.14rem;margin:0 auto;}
      h3{width:92%;margin:0 auto;overflow:hidden;line-height: 1rem;font-size: .35rem;text-align: center;color:#000;}
      h3 span{width:92%;margin:0 auto;overflow:hidden;display: block;color:#2a333c;font-size: .28rem;line-height: .4rem;font-weight:normal;}
    }
  }
  .link{padding:.5rem .3rem; color:#0091FF;}

</style>
