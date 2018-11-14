<template>
  <div style="background: #f1f1f1">
    <div class="box">
      <div class="card">
        <div v-if="hasData">
          <p class="p1">{{userData.name}}</p>
          <p class="p2"><label>参保地区:</label>广州市</p>
          <p class="p2"><label>社保卡号:</label>{{userData.num}}</p>
        </div>
        <div class="warning-1" v-else>暂未查询到相关记录<br/>本功能仅可查询广州市社保记录！</div>

      </div>

      <div class="warning-2">说明：现仅支持在广州市税务机关缴纳的社保费查询
。</div>

    </div>
    <div class="box">
      <ul>
          <li class="detail" @click="gotoJFMX" >缴费明细<span class="icon_right"></span></li>
          <li class="detail" @click="gotoSBZT">缴费状态<span class="icon_right"></span></li>

      </ul>

    </div>



  </div>

</template>
<script>
import baseUrl from "../../api/config";
import api from "../../api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      idCard: this.$route.params.idCard,
      hasData: true,
      userData: {
        name:'',
        num:'',
        city:''

      },
    };
  },
  created: function () {
    this.getDate()
  },
  methods: {
    getDate() {
      //基础查询
      this.$store.commit('UPDATE_LOADING', true);
      api.findPersonalBasicInfo({idCard:this.idCard}).then(res => {    
        if (res.data.success) {
          var data = res.data.jsonRes.output[0].data;
          this.userData.name = data.aac003.replace(/(.{1}).*(.{1})/,"$1*$2")
          this.userData.num = data.aac147.replace(/(.{2}).*(.{2})/,"$1*** ***** ***$2")
          localStorage.setItem("selectVal", data.aac001);
          this.$store.commit('UPDATE_LOADING', false)
        }
      }).catch(() => {
        this.hasData = false
        this.$store.commit('UPDATE_LOADING', false);
      })
    },
    gotoJFMX() {
      if(this.hasData){
        this.$router.push({path:'/paymentdetails/' + this.idCard});

      }
    },
    gotoSBZT() {
      if(this.hasData){
        this.$router.push({path:'/paymentstatus/' + this.idCard});
      }
    },    


  },
  mounted() {

  }
};
</script>
<style lang="less" scoped>
.card{width:100%;height:3rem;margin:0 auto;border-radius:.2rem;color:#fff;background:#3199ff url(../../assets/images/bg_1.png) no-repeat right bottom ;background-size:100% 100%;}
.card .p1{padding:.4rem 0 .2rem .4rem;font-size:.4rem;}
.card .p2{padding:.1rem 0 0 .4rem;font-size:.3rem;}
.card .p2 label{padding-right:.1rem;color:#a0c9ff;}
.warning-1{padding:.5rem;color:#ffff00; text-align:center;}
.warning-2{padding:.25rem 0 0;color:#888;font-size:.25rem;}
.box {
  width: 100%;
  background: #fff;
  margin-bottom:.1rem;
  padding: 0 .3rem .3rem .3rem;
  box-sizing: border-box;
  li {
    height: 0.4rem;
    font-size: 0.3rem;
    color: #666;
    padding: 0.2rem 0;
    &.detail {
      border-bottom: .01rem solid #ccc;
    }
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
    .icon_right {
      float: right;
      display: inline-block;
      width: 0.3rem;
      height: 0.4rem;
      background: url("../../assets/images/arrowright.png") center center
        no-repeat;
      background-size: 100%;
    }
  }
}
</style>

