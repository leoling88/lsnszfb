<template>
  <div class="template_container">
    <ul class="list_box">
      <!--<li>-->
        <!--<img src="../../../static/images/icon_idcard.png" alt="" class="icon">-->
        <!--<div class="text">-->
          <!--<strong>学历证明</strong>-->
          <!--<router-link :to="fileUploader + '&fileType=5'" :class="{ xlimgshow: imgtt }"></router-link>-->
        <!--</div>-->
      <!--</li>-->
      <li>
        <div class="sbrecord" @click="sbshowxq">
          <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
          <div class="text">
            <strong>学历证明</strong>
            <a href="javascript:;"></a>
            <!--<router-link :to="fileUploader + '&fileType=4'"></router-link>-->
          </div>
        </div>
        <div class="sbsecord" v-if="secordshow">
          <checker v-model="demo1" class="sebjilu" default-item-class="demo2-item" selected-item-class="demo2-item-selected">
            <checker-item value="50">上传本科学历材料
              <router-link :to="fileUploader + '&fileType=5'" :class="{ xlimgshow: imgtt }"></router-link>
            </checker-item>
            <checker-item value="35">上传大专学历材料
              <router-link :to="fileUploader + '&fileType=6'" :class="{ xlimgshow: zhuanke }"></router-link>
            </checker-item>
            <checker-item value="20">上传高中学历材料
              <router-link :to="fileUploader + '&fileType=7'" :class="{ xlimgshow: gaozong }"></router-link>
            </checker-item>
          </checker>
        </div>
      </li>
      <li>
        <div class="sbrecord" @click="sbshowxq2">
          <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
          <div class="text">
            <strong>年龄</strong>
            <a href="javascript:;"></a>
            <!--<router-link :to="fileUploader + '&fileType=4'"></router-link>-->
          </div>
        </div>
        <div class="sbsecord" v-if="secordshow2">
          <group>
            <x-number title="年龄" :fillable="true" v-model="changeValue" :min="18" @on-change="changenl"></x-number>
          </group>
        </div>
      </li>
      <li>
        <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
        <div class="text">
          <strong>社保记录</strong>
          <a href="javascript:;"></a>
          <!--<router-link :to="fileUploader + '&fileType=4'"></router-link>-->
        </div>
      </li>
      <li>
        <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
        <div class="text">
          <strong>纳税证明</strong>
          <a href="javascript:;"></a>
          <!--<router-link :to="fileUploader + '&fileType=4'"></router-link>-->
        </div>
      </li>
      <li>
        <img src="../../../static/images/icon_idcard.png" alt="" class="icon">
        <div class="text">
          <strong>合法稳定居住</strong>
          <a href="javascript:;"></a>
          <!--<router-link :to="fileUploader + '&fileType=4'"></router-link>-->
        </div>
      </li>
    </ul>
    <!--<div>lyp {{nianlfen}}</div>-->
    <div class="upDatabtn">
      <router-link :to="`/integralzhxin?allfenshu=${allfenshu}&nianlfen=${nianlfen}&demo1=${demo1}`">积分申请</router-link>
    </div>
  </div>
</template>
<script>
  import api from '../../api/api'
  import { Checker, CheckerItem, Group, XNumber } from 'vux'
  export default {
    components: {Checker,CheckerItem,Group,XNumber},
    data() {
      return {
        demo1:0,
        changeValue:18,
        nianlfen:0,
        secordshow:false,
        secordshow2:false,
        hasSchool: false, // 是否上传学历
        hasSecurity: false, // 是否上传社保记录
        idCard: this.$route.query.idCard,
        imgtt:false,
        zhuanke:false,
        gaozong:false,
      }
    },
    computed: {
      allfenshu: function () {
        return Number(this.nianlfen) + Number(this.demo1)
      },
      fileUploader: function () {
        return `/fileUploader?idCard=${this.idCard}&isRenewal=true`
      }
    },
    methods: {
      sbshowxq (){
        this.secordshow = !this.secordshow;
      },
      sbshowxq2 (){
        this.secordshow2 = !this.secordshow2;
      },
      changenl (val) {
        this.changeValue = val;
        this.nianlfen = 0;

        if(val <= 30){
          this.nianlfen = 30;
          console.log('change', 111)
//        }else if(30 < val <= 40){
        }else if(val > 30 && val <= 40){
          this.nianlfen = 15;
          console.log('change', val)
//        }else if(40 < val <= 45){
        }else if(val > 40 && val <= 45){
          this.nianlfen = 10;
          console.log('change', 333)
        }else{
          this.nianlfen = 0;
        }
      },
      fenjia(){
//        let dem = Number(this.demo1);
//        let changeVal = Number(this.changeValue);
//        this.allfenshu = changeVal + dem;
      },
      selectPic () {  // 选择图片
        if (window.AlipayJSBridge) {
          AlipayJSBridge.call('photo', {
            dataType: 'dataURL',
            imageFormat: 'jpg',
            quality: 75,
            maxWidth: 500,
            maxHeight: 500,
            allowEdit: true,
            multimediaConfig: { // 可选，仅当该项被配置时，图片被传输至 APMultimedia
              compress: 2, // 可选，默认为4。 0-低质量，1-中质量，2-高质量，3-不压缩，4-根据网络情况自动选择
              business: "multiMedia" // 可选，默认为“NebulaBiz”
            }
          }, (result) => {
            const picItem = {
              file: result.fileURL,
              dataURL: "data:image/jpeg;base64," + result.dataURL,
              uuid:''
            }
            if (result != 11 || result != 10) this.picList.push(picItem)
          });
        }
      },
      isHavePic () { // 查询图片各个类型是否已经上传图片
        api.isHavePic(this.idCard).then((res) => {
          const data = res.data.jsonRes[0]
          if (res.data.success) {
            this.imgtt = data.educationArr.length > 0
            this.zhuanke = data.socialRecordsArr.length > 0
            this.gaozong = data.leaseContractArr.length > 0
//            if (data.comGuid) this.$store.commit('UPDATE_COMGUID',data.comGuid)
//            if (data.openid) this.$store.commit('UPDATE_ALIPAY_ACOUNT',data.openid)
          }
        })
      },
    },
    mounted(){
      this.isHavePic();
    }
  }
</script>
<style lang="less" scoped>
  .template_container{background:#fff;}
  .list_box{
    width:6.9rem;margin:0 auto;overflow:hidden;
    li{min-height:1.42rem;font-size: .25rem;color:#888;border-bottom: 1px solid #E9EBEE;position: relative;}
    .icon{display: block;width:.68rem;height:.68rem;float: left;margin-top:.39rem;}
    .text{
      float: left;width:5.9rem;height:100%;float: right;
      strong{width:3.8rem;line-height: 1.42rem;display: block;color:#2a333c;font-size: .33rem;overflow: hidden;float: left;}
      a{display: block;width:.4rem;height:.4rem;line-height:.8rem;color:#fff;font-size: .28rem;text-align: center;position: absolute;right: 0;top:.42rem;background: url(../../../static/images/icon_left_arrow2.png) no-repeat; background-size: contain;transform: rotate(-90deg)}
      a.xlimgshow{background: url(../../../static/images/xueli.jpg) no-repeat; background-size: 100%;}
    }
  }
  .upDatabtn{
    width:6.68rem;height:.93rem;margin:0 auto;background:#448aff;color:#fff;text-align:center;border:none;display:block;margin-top:3rem;font-weight:bold;font-size:.3rem;border-radius:.1rem;
    a{display: block;width:100%;height:.93rem;line-height:.93rem;color:#fff;}
  }
  .suoimg{position:absolute;left:5.5rem;top:.4rem;width:.6rem;}
  .sbrecord{overflow:hidden;}
  .sbsecord{padding:0 .3rem;}
  .sebjilu .vux-checker-item{height:1.00rem;line-height:1.00rem;width:100%;display: block;position:relative;}
  .sebjilu .vux-checker-item a{display: block;width:.6rem;height:.6rem;line-height:.8rem;color:#fff;font-size: .28rem;text-align: center;position: absolute;right: 0;top:.2rem;background: url(../../../static/images/choiceimg.png) no-repeat; background-size: 100%;}
  .sebjilu .vux-checker-item a.xlimgshow{background: url(../../../static/images/xueli.jpg) no-repeat; background-size: 100%;}

  .sebjilu .demo2-item-selected{color:#f40;}
  .template_container{padding-bottom:.3rem;}
</style>
