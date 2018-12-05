<template>
    <div class="template_container">
      <div class="longin_cont">

        <dl class="logo_box">
          <dt><img src="../../../static/images/laisui_logo.png" alt=""></dt>
          <dd>番禺区来穗人员服务管理局</dd>
        </dl>
        <!--登录-->
        <x-input v-model="loginData.uerAcount" title="账 号：" placeholder="请输入您的身份证号" :show-clear="true" placeholder-align="right" text-align="right" :required="true" :is-type="inputValid.idNo" ref="uerAcount"></x-input>
        <x-input v-model="loginData.passWord" title="密 码：" placeholder="请输入密码" :show-clear="true" placeholder-align="right" text-align="right" class="last_input" :required="true" ref="loginPassWord"></x-input>
        <x-button class="submit_btn long_btn" type="default" :show-loading="submitBtn.disabled" @click.native="loginFn" :disabled="submitBtn.disabled">{{submitBtn.text}}</x-button>
        <div class="under_line"><router-link to="/findPassWord">忘记密码</router-link><router-link to="/register">注 册</router-link></div>

      </div>

    </div>
</template>
<script>
  import { Group,XInput,XButton} from 'vux'
  import api from '../../api/api'
  export default {
    components: { Group,XInput,XButton},
    data() {
      return {
        openid: '',
        wxsqn: '',
        idNo: this.$route.query.idNo,
        isShowTips: false,
        submitBtn: {
          disabled: false,
          text: '登　录',
        },
        identify: {
          disabled: false,
          text: '发送验证码',
          downTime: 60
        },
        loginData: {
          uerAcount:'',  // 登录账号
          passWord: ''   // 登录密码
        },
        isFirst: true, // 是否是第一次选择或输入
        inputValid: {
          name: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.name.test(val),
              msg: '姓名不合法！'
            }
          },
          idNo: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.cardID.test(val),
              msg: '身份证号不合法！'
            }
          },
          phone: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.phone.test(val),
              msg: '手号码不合法！'
            }
          },
          passWord: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.password.test(val),
              msg: '密码为8-16字母或数字！'
            }
          }
        }
      }
    },
    methods: {
      loginFn () { // 登录
        this.isFirst = false
        const validate = this.validate()
        this.checkAllInput()
        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          this.login()
        }
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';
        if (!this.loginData.uerAcount) {
          errorMsg = '请输入身份证号！'
        } else if (!this.$regExp.cardID.test(this.loginData.uerAcount)) {
          errorMsg = '身份证号不合法！'
        } else if (!this.loginData.passWord) {
          errorMsg = '请输入密码！'
        } else {
          valid = true
          errorMsg = ''
        }
        return {valid, errorMsg}
      },
      checkAllInput () {  // input验证
        this.isFirst = false
        this.$refs.uerAcount.validate()
        this.$refs.loginPassWord.validate()
      },
      login () {  // 登录接口
        api.login({
          openid: this.openid,
          wxsqn: this.wxsqn,
          account: this.loginData.uerAcount,
          password: this.loginData.passWord
        }).then((res) => {
          const data = JSON.parse(res.data.jsonRes[0]);
          if (Number(data.ackCode) == 1) {
            this.$router.push({path:'/integralHome',query: {idNo: this.idNo}});
          } else {
            this.$store.commit('SHOWTOAST', data.errorMessage);
          }
        })
      }
    },
    mounted(){
    }
  }
</script>
<style scoped lang="less">
  .longin_cont{width:100%;overflow: hidden;margin: 0 auto;}
  .logo_box{
    width:6rem;margin:0 auto;overflow: hidden;
    dt{text-align: center;padding-top:1rem;
      img{width:2.2rem;height:2.2rem;}
    }
    dd{text-align: center;font-size: .35rem;height: 1.5rem;line-height: 1rem;}
  }
  .submit_btn{width:6.9rem;height:.96rem;margin:.3rem auto 0 auto;text-align: center;line-height: .96rem;color:#fff;font-size: .32rem;background: #1F67D0;border-radius: .1rem;border:none;}
  .long_btn{margin-top: .6rem;}
  .last_input:after{content: " ";position: absolute;bottom: 0;width:100%;height: 1px;border-top: 1px solid #D9D9D9;  color: #D9D9D9;transform: scaleY(0.5);left: 15px;display: inline-block;}
  .under_line{width:6.9rem;margin:0 auto;height:1rem;line-height: 1rem;font-size: .3rem;
    a:first-of-type{float: left;color:#228AE6;}
    a:last-of-type{float: right;color:#228AE6;}
  }
  .tips{width:6.9rem;margin:0 auto;height: .6rem;line-height: .8rem;font-size: .28rem;
    span{color:red;}
  }
  .identify_btn{display: inline-block;height:100%;width:1.8rem;text-align: right;color:#228AE6;border: none;border-left:1px solid #eee;background: none;}
</style>
