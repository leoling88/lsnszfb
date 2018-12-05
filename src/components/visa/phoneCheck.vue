<template>
  <div class="template_container">
    <step class="noBorbt" step="3" stepText1="填写信息" stepText2="上传资料" stepText3="提交申请"></step>
    <div class="form_cont">
      <!-- <div @click="goNext">下一步</div> -->
      <!--手机验证-->
      <group title="手机验证" class="group_cont borbte5">
        <cell title="手机号码" :value="formData.phone">13829776372</cell>
        <x-input v-model="formData.phoneCheck" title="验证码" placeholder="请输入验证码" :show-clear="true" :required="true" placeholder-align="right" text-align="right"></x-input>
      </group>
    </div>
    <div>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn">确认</a>
      </div>
    </div>
  </div>
</template>
<script>
  import {XInput, Group, Cell, Datetime,XAddress, ChinaAddressV4Data, Confirm,TransferDomDirective as TransferDom, Value2nameFilter as value2name,Search, Icon, Alert } from 'vux'
  import customSelector from '../common/customSelector.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  import Scroller from "../../../node_modules/vux/src/components/scroller/index";
  export default {
    name: 'notes',
    components: {Scroller, Group, Cell, XInput, Datetime, XAddress, ChinaAddressV4Data,customSelector, Confirm, Step, SelectorSearch, Search, Icon, Alert},
    directives: {TransferDom},
    data() {
      return {
        formData:{
          phone:'',
          phoneCheck:''
        }
      }
    },
    methods: {
    },
    created() {

    },
    mounted () {
    },
    destroyed () {
    }
  }
</script>
<style lang="less">
</style>
