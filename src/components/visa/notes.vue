<template>
  <div class="template_container">
    <div class="text_notes">
      <div class="notes_title">签注居住证办事指南</div>
      <div class="content">
        <div class="content_item">
          <div>一、签注对象</div>
          <p>1.居住证每年签注1次，持证人在居住地连续居住的，在居住证满1年之日前1个月后可办理签注手续。</p>
          <p class="color-red">2.此业务现只支持番禺区，其他区域业务暂无法办理。</p>
        </div>
        <div class="content_item">
          <div>二、所需材料</div>
          <p>1.申请人有效身份证明材料居民身份证、临时居民身份证、户口簿、护照、驾驶证或公安机关出具的身份证明文件等。</p>
        </div>
        <div class="content_item">
          <div>2.根据申请事由分别提供以下证明材料</div>
          <p>（1）合法稳定住所证明<br />
            房屋租赁合同、房屋产权证明文件、购房合同或者房屋出租人、用人单位、就读学校、宾馆旅店出具的住宿证明，或者屋主与借住人签订的借住手续证明等。</p>
        </div>
        <div class="content_item">
          <p>（2）合法稳定就业证明<br />
            工商营业执照、劳动合同、用人单位出具的劳动关系证明或
            者其他能够证明有合法稳定就业的材料等。</p>
        </div>
        <div class="content_item">
          <p>（3）连续就读证明<br />
            学生证、就读学校出具的其他能够证明连续就读的材料等。</p>
        </div>
        <div class="content_item">
          <div>三、受理机构</div>
          <p>居住地公安派出所或者受公安机关委托的乡镇、街道承担流动人口服务管理工作的机构。</p>
        </div>
      </div>
    </div>
    <div class="flow">
      <div class="notes_title">签注居住证申办流程</div>
      <div class="flow_list">
        <div class="list_item">
          <div class="list_item_number">1</div>
          <div class="list_item_content">
            <div class="title fs34">签注资格校验</div>
            <div class="description">校验申请人是否符合签注居住证的基本条件。</div>
          </div>
        </div>
        <div class="list_item">
          <div class="list_item_number">2</div>
          <div class="list_item_content">
            <div class="title fs34">上传电子材料</div>
            <div class="description">根据签注居住证要求，上传所需的电子材料。</div>
          </div>
        </div>
        <div class="list_item">
          <div class="list_item_number">3</div>
          <div class="list_item_content">
            <div class="title fs34">提交申请信息</div>
            <div class="description">核对录入的申请信息，确认后提交办理。</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="formCheck"  v-bind:class="{ 'active': isActive }" @click="clickActive()">
        <label><span><i class="check"></i></span>我已认真阅读上述内容</label>
      </div>
      <div class="mb30">
        <a href="javascript:;" class="check_detail_btn" @click="goNext">开始办理</a>
      </div>
    </div>
    <!--确认、取消弹窗-->
    <div v-transfer-dom>
      <Alert v-model="isShowConfirm" title="操作提示" :hide-on-blur="true">
        <p style="text-align:center;">您必须同意签证条款，才能开始办理流程</p>
      </Alert>
    </div>
    <!--确认、取消弹窗 END-->




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
        isShowConfirm: false,
        isActive: false,
        formData:{
          name: this.$route.params.name,
          idCard: this.$route.params.idCard,
          phone:'13111111111',
          openid: this.$route.params.openid,
        }
      }  

    },
    methods: {
      clickActive () {     //检查参数
        if(this.isActive) this.isActive = false
        else  this.isActive = true
      },
      goNext () {         //进入下一步开台签注
        if(this.isActive) {
          this.$router.push({path:'/qualifyCheck1/' + this.formData.idCard + '/' + this.formData.openid + '/' +  this.formData.name} )
        }else{
          this.isShowConfirm = true
        }
      },
      noEffect () {   //默认无响应
      }

    },
    created() {
    },
    mounted () {
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件
    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, true) // 删除支付宝右上角点击事件
    }
  }
</script>
<style lang="less" scoped>

   .flow_list{padding:0 .3rem .35rem;border-bottom:1px solid #ccc;
    .list_item{display: flex;margin-top:.3rem;
      .list_item_number{display:block;width:.36rem;height:.36rem;line-height:.36rem;border-radius:50%;background:#0091FF;color:#fff;margin-right:.25rem;text-align:center;margin-top:.1rem;font-size:.26rem;
      }
      .list_item_content{flex:1;
        .description{font-size:.28rem;color:#888888;}
      }
    }
  }
  .color-blue{color:#0091FF;}
  .color-red{color:red;}
 </style>
