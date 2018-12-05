<template>
  <div class="template_container">
    <div class="querenTop">您的入户积分为{{allfenshu}}分，已远远高于标准分</div>
    <ul class="queren">
      <li>
        <div class="fl">学历证明</div>
        <div class="fr">{{demo1}}</div>
      </li>
      <li>
        <div class="fl">年龄</div>
        <div class="fr">{{nianlfen}}</div>
      </li>
      <li>
        <div class="fl">社保记录</div>
        <div class="fr">0</div>
      </li>
      <li>
        <div class="fl">纳税证明</div>
        <div class="fr">0</div>
      </li>
      <li>
        <div class="fl">合法稳定居住</div>
        <div class="fr">0</div>
      </li>
      <!--<li>-->
        <!--<div class="fl">创新创业</div>-->
        <!--<div class="fr">4</div>-->
      <!--</li>-->
      <!--<li>-->
        <!--<div class="fl">职业工种、职业资格、服务行业</div>-->
        <!--<div class="fr">0</div>-->
      <!--</li>-->
      <!--<li>-->
        <!--<div class="fl">社会服务和公益</div>-->
        <!--<div class="fr">0</div>-->
      <!--</li>-->
      <!--<li>-->
        <!--<div class="fl">纳税情况</div>-->
        <!--<div class="fr">4</div>-->
      <!--</li>-->
      <!--<li>-->
        <!--<div class="fl">表彰奖项</div>-->
        <!--<div class="fr">0</div>-->
      <!--</li>-->
      <!--<li>-->
        <!--<div class="fl">信用情况</div>-->
        <!--<div class="fr">0</div>-->
      <!--</li>-->
      <!--<li>-->
        <!--<div class="fl">违规与刑事犯罪</div>-->
        <!--<div class="fr">0</div>-->
      <!--</li>-->
    </ul>
    <div v-transfer-dom>
      <alert v-model="showalert" title="提示">
        <div>申请成功</div>
      </alert>
    </div>
    <button class="upDatabtn" @click="succsq">确认申请</button>
  </div>
</template>
<script>
  import api from '../../api/api'
  import {TransferDomDirective as TransferDom, Confirm, Alert, XButton, Icon } from 'vux'
  export default {
    components: {Confirm, Alert, XButton, Icon },
    directives: {
      TransferDom
    },
    data() {
      return {
        allfenshu:this.$route.query.allfenshu,
        nianlfen:this.$route.query.nianlfen,
        demo1:this.$route.query.demo1,
        showalert:false
      }
    },
    methods: {
      succsq () {
        this.showalert = true;
      }
    },
    mounted(){
    }
  }
</script>
<style lang="less" scoped>
.template_container{padding-bottom:.5rem;}
.querenTop{background:#f5f5f5;color:#448aff;text-align:center;padding:.6rem .5rem;font-size:.48rem;}
.queren li{
  border-bottom:1px solid #e5e5e5;padding:.3rem .3rem;overflow:hidden;
  div{font-size:.30rem;}
  div:first-child{text-align:left;width:80%;}
  div:last-child{text-align:right;width:20%;}
}
.upDatabtn{width:6.68rem;height:.93rem;margin:0 auto;background:#448aff;color:#fff;text-align:center;border:none;display:block;margin-top:3rem;font-weight:bold;font-size:.3rem;border-radius:.1rem;}.upDatabtn{width:6.68rem;height:.93rem;margin:0 auto;background:#448aff;color:#fff;text-align:center;border:none;display:block;margin-top:.6rem;font-weight:bold;font-size:.3rem;border-radius:.1rem;}
</style>
