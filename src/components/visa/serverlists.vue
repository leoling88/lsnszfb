<template>
<div class="server">
  <div class="title">番禺区</div>
  <div class="server-ul-1">
    <ul>
      <li v-for="item in serverData">
        <h3>{{item.fullName}}</h3>
        <p><label for="">联系电话：</label>{{item.phone}}</p>
        <p><label for="">联系地址：</label>{{item.address}}</p>
      </li>
    </ul>
  </div>
</div>

</template>
<script>
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'serverlists',
    components: {},
    directives: {},
    data() {
      return {

        formData:{
          name: this.$route.params.name,
          idCard: this.$route.params.idCard,
          phone:'13111111111',
          openid: this.$route.params.openid,
        },
        serverData:{
          fullName:'', //服务站名称
          address:'', //服务站地址
          phone:'', //服务站电话

        }
      }  

    },
    methods: {
      requireData() {   //获取居住信息
        api.requireServiceInfo({
           idCard: this.formData.idCard,
        }).then((res) => {
          if (res.data.success) {
            console.log(res.data.obj)
            this.serverData = res.data.obj
          } else {
            this.$store.commit('SHOWTOAST', data.errorMessage);
          }
        }).catch((res) => {
        })

      },

    },
    created() {
      this.requireData()
    },
    mounted () {
    },
    destroyed () {
    }
  }
</script>
<style lang="less" scoped>

 .server{padding-bottom:.5rem;}
.server .title{border-bottom:.01rem solid #ccc;padding:.2rem;font-size:.28rem;color:#000;background:#fff;}
.server-ul-1{padding:.2rem;}
.server-ul-1 li{margin-bottom:.2rem;border-radius:.05rem;padding:.2rem;font-size:.24rem;color:#333;background:#fff; box-shadow:0 0 .01rem .01rem #ccc;}
.server-ul-1 li label{color:#888;}
.server-ul-1 h3{padding-bottom:.05rem;font-size:.24rem;color:#1994ff;}
 </style>




