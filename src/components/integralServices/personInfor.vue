<template>
  <div class="template_container">
    <div class="form_com">
      <x-input v-model="formData.name" title="姓名" placeholder="请填写姓名" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.sex" title="性别" placeholder="请填写性别" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.nianl" title="年龄" placeholder="请填写年龄" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.marry" title="婚姻状况" placeholder="请填写婚姻" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.address" title="籍贯" placeholder="请填写籍贯" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <!--<custom-selector v-model="formData.marry" describe="婚姻状况" :options="marryList" ></custom-selector>-->
      <!--<custom-selector v-model="formData.address" describe="籍贯" :options="addressList" ></custom-selector>-->
      <x-input v-model="formData.sfz" title="身份证" placeholder="请填写身份证" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.zy" title="专业" placeholder="请填写专业" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <!--<custom-selector v-model="formData.culture" describe="学历" :options="cultureList" ></custom-selector>-->
      <x-input v-model="formData.culture" title="学历" placeholder="请填写学历" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.byyx" title="毕业院校" placeholder="请填写毕业院校" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      <x-input v-model="formData.jzdz" title="居住地址" placeholder="请填写居住地址" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
    </div>
    <div class="upDatabtn">
      <router-link :to="`/uploadData?idCard=${idCard}`">下一步</router-link>
    </div>
  </div>
</template>
<script>
  import api from '../../api/api'
  import {XInput } from 'vux'
  import customSelector from '../common/customSelector.vue'
  export default {
    components: {XInput,customSelector},
    data() {
      return {
        idCard: this.$route.query.idCard,
//        personInfo: this.$route.query.personInfo,
        formData: {
          name:this.$route.query.xm,
          sex:this.$route.query.xb_dict,
          nianl:'',
          sfz:this.$route.query.zjhm,
          zy:'',
          byyx:'',
          jzdz:'',
          marry: this.$route.query.hyzk_dict,// 婚姻状况
          address: this.$route.query.hjxz,//籍贯
          culture: this.$route.query.whcd_dict,//学历
        },
        marryList:[],//婚姻
        addressList:[],//户籍
        cultureList:[],//学历
      }
    },
    methods: {
    },
    mounted(){
        console.log(decodeURI(this.$route.fullPath))
//        console.log('this.$route.query.whcd_dict:', decodeURI(this.$route.path))
//      let datainfo = JSON.parse(this.personInfo)
//      console.log('666',datainfo);
//      this.formData.name = datainfo.xm;//姓名
//      this.formData.sex = datainfo.xb_dict;//性别
//      this.formData.marry = datainfo.hyzk_dict;//婚姻
//      this.formData.address = datainfo.hjxz;//户籍
//      this.formData.sfz = datainfo.zjhm;//证件号码
//      this.formData.culture = datainfo.whcd_dict;//学历
    }
  }
</script>
<style lang="less" scoped>
  .template_container{background:#fff;}
  .form_com{
  width:100%;overflow:hidden;
}
  body{background-color:#f5f5f5;}
  .upDatabtn{
    width:6.68rem;height:.93rem;margin:0 auto;background:#448aff;color:#fff;text-align:center;border:none;display:block;margin-top:.6rem;font-weight:bold;font-size:.3rem;border-radius:.1rem;
    a{display: block;width:100%;height:.93rem;line-height:.93rem;color:#fff;}
  }
</style>
<style>
  .form_com .weui-cell:before{left:0;}
  .form_com .selector_box .custom_cell:before{left:0 !important;}
</style>
