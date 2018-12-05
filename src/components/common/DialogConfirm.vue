<!--确认弹窗-->
<template>
    <div v-transfer-dom>
      <x-dialog v-model="showXDialog" hide-on-blur>
        <div class="dialog-demo">
          <div class="content" v-html="HtmlText"></div>
        </div>

        <div class="dialog-btn-box">
          <a @click="ColseDialog">取消</a>
          <a class="determine" @click="CallBack">{{BtnText}}</a>
        </div>

      </x-dialog>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { XDialog,TransferDomDirective as TransferDom} from 'vux'
  export default {
    directives: {TransferDom},
    components: {XDialog},
    props:['HtmlText','BtnText','DialogCallBack'],
    data () {
      return {
        showXDialog:false,
        CallBackFun:'',
      }
    },
    created() {
      this.$bus.$off('showDialogConfirm');
      this.$bus.$on('showDialogConfirm', (data) => {
          this.showXDialog=true;
      });
    },
    computed: {

    },
    watch: {

    },
    mounted(){

    },
    methods: {
      ColseDialog(){
          this.showXDialog=false;
      },
      CallBack(){
        this.showXDialog=false;
        this.$bus.$emit(this.DialogCallBack);
      }
    }
  }
</script>
<style lang="less" scoped>
  .dialog-demo{ padding:15px;}
  .content{font-size: 14px;}
  .dialog-btn-box{border-top:1px solid #e7e7e7;}
  .dialog-btn-box a{ display: block; float: left; width: 49%; text-align: center; height:50px; line-height: 50px; font-size: 16px}
  .determine{ color: #12b7f5;border-left: 1px solid #e7e7e7;}
</style>


