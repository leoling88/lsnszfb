<template>
    <div class="template_container">
      <div class="longin_cont">
        <dl class="logo_box">
          <dt><img src="../../../static/images/laisui_logo.png" alt=""></dt>
          <dd>番禺区来穗人员服务管理局</dd>
        </dl>

        <x-input v-model="formData.phone" title="手机号：" placeholder="请输入手机" :show-clear="true" placeholder-align="right" text-align="right" :required="true" :is-type="inputValid.phone" ref="phone"></x-input>

        <x-input v-model="formData.password" title="新密码：" placeholder="请输入密码" :show-clear="true" placeholder-align="right" text-align="right" :required="true" :is-type="inputValid.passWord" ref="password"></x-input>
        <x-input v-model="formData.rePassword" title="重复密码：" placeholder="请输入重复密码" :show-clear="true" placeholder-align="right" text-align="right" :required="true" :is-type="inputValid.rePassword" ref="rePassword"></x-input>
        <x-input v-model="formData.identifyingCode" title="短信验证码：" placeholder="请输入短信验证码" :show-clear="true" :required="true" class="last_input" ref="identifyingCode">
          <input type="button" slot="right" class="identify_btn" @click="getIdentifyCode" :value="identify.text" :disabled="identify.disabled">
        </x-input>
        <p class="tips" v-show="isShowTips">温馨提示：<span>验证码十分钟内有效！</span></p>
        <x-button class="submit_btn" type="default" :show-loading="submitBtn.disabled" :disabled="submitBtn.disabled" @click.native="submitFn">{{submitBtn.text}}</x-button>
        <div class="under_line"><router-link to="/login">已找回密码，返回登录</router-link></div>

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
        openid: '11',
        wxsqn: '11',
        idNo: this.$route.query.idNo,
        isShowTips: false,
        openid: '44444',
        wxsqn: '11',
        submitBtn: {
          disabled: false,
          text: '找回密码',
        },
        identify: {
          disabled: false,
          text: '发送验证码',
          downTime: 60
        },
        formData: {
          phone: '15218310537',
          identifyingCode: '375121',
          password: '12345678',
          rePassword: '12345678'
        },
        isFirst: true, // 是否是第一次选择或输入
        inputValid: {
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
          },
          rePassword: () => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.formData.password == this.formData.rePassword,
              msg: '两次密码不一致！'
            }
          }
        }
      }
    },
    methods: {
      submitFn () { // 提交
        this.isFirst = false
        const validate = this.validate()
        this.checkAllInput()
        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else {
          api.findPassword({
            openid: this.openid,
            wxsqn: this.wxsqn,
            mobile: this.formData.phone,
            checkCode: this.formData.identifyingCode,
            newPassword: this.formData.rePassword
          }).then((res) => {

          })
        }
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';

        if (!this.formData.phone) {
          errorMsg = '请输入手机号！'
        } else if (!this.$regExp.phone.test(this.formData.phone)) {
          errorMsg = '手机号不合法！'
        } else if (!this.formData.password) {
          errorMsg = '请输入新密码！'
        } else if (!this.$regExp.password.test(this.formData.password)) {
          errorMsg = '密码为8-16位字母或数字！'
        }  else if (!this.formData.rePassword) {
          errorMsg = '请输入重复密码！'
        }  else if (this.formData.password != this.formData.rePassword) {
          errorMsg = '两次密码不一致！'
        } else if (!this.formData.identifyingCode) {
          errorMsg = '请输入验证码！'
        } else {
          valid = true
          errorMsg = ''
        }
        return {valid, errorMsg}
      },
      checkAllInput () {  // input验证
        this.isFirst = false
        this.$refs.phone.validate()
        this.$refs.identifyingCode.validate()
        this.$refs.password.validate()
        this.$refs.rePassword.validate()
      },
      countDown () {
        let countDownTime = 60
        let timer = setInterval(() => {
          countDownTime --
          if (countDownTime !== 0) {
            this.identify.text = `${countDownTime}秒后获取`
          } else {
            this.identify = {
              disabled: false,
              text: '获取验证码'
            }
            clearInterval(timer)
          }
        }, 1000);
      },
      getIdentifyCode () { // 获取短信验证码
        this.identify.disabled = true
        api.sendMessage({
          openid: this.openid,
          wxsqn: this.wxsqn,
          mobile: this.formData.phone
        }).then((res) => {
          let countDownTime = 60
          let timer = setInterval(() => {
            countDownTime --
            if (countDownTime !== 0) {
              this.identify.text = `${countDownTime}秒后获取`
            } else {
              this.identify = {
                disabled: false,
                text: '获取验证码'
              }
              clearInterval(timer)
            }
          }, 1000);
          this.isShowTips = true
        }).catch((res) => {
          this.identify = {
            disabled: false,
            text: '获取验证码'
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
  .submit_btn{width:6.9rem;height:.96rem;margin:.4rem auto 0 auto;text-align: center;line-height: .96rem;color:#fff;font-size: .32rem;background: #1F67D0;border-radius: .1rem;border:none;}
  .long_btn{margin-top: .6rem;}
  .last_input:after{content: " ";position: absolute;bottom: 0;width:100%;height: 1px;border-top: 1px solid #D9D9D9;  color: #D9D9D9;transform: scaleY(0.5);left: 15px;display: inline-block;}
  .under_line{width:6.9rem;margin:0 auto;height:1rem;line-height: 1rem;font-size: .3rem;
    a:first-of-type{float: left;}
    a:last-of-type{float: right;color:#228AE6;}
  }
  .tips{width:6.9rem;margin:0 auto;height: .6rem;line-height: .8rem;font-size: .28rem;
    span{color:red;}
  }
  .identify_btn{display: inline-block;height:100%;width:1.8rem;text-align: right;color:#228AE6;border: none;border-left:1px solid #eee;background: none;}
</style>
