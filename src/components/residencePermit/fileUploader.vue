<template>
    <div class="template_container">
      <!--身份证号-->
      <div class="file_cont" v-if="fileType == 1">
        <ul class="picture_list">
          <template v-for="(item,index) in photo">
            <li :key="index">
              <img v-if="$route.query.photo" :src="item">
              <img v-else :src="item.dataURL">
            </li>
          </template>
        </ul>
        <a v-if="isRenewal == 'true'" class="submit_btn" href="/cnLaiSui/mobile/zhimaCreditStart?bizCode=CERT_PHOTO">重拍</a>
      </div>

      <!--居住证相片回执-->
      <div class="file_cont" v-else>
        <ul class="picture_list">
          <template v-for="(item,index) in picList">
            <li :key="index">
              <img :src="item.dataURL">
              <icon v-if="isRenewal == 'true'" @click.native="deletePic(item.uuid, index)" type="cancel"></icon>
            </li>
          </template>
          <li v-if="isRenewal == 'true'" class="select_pic" @click="selectPic">+</li>
        </ul>
        <div v-if="isRenewal == 'true'" class="submit_btn" @click="fileUploader">确定上传</div>
      </div>

  </div>
</template>
<script>
  import api from '../../api/api'
  import {Icon} from 'vux'
  export default {
      components: {Icon},
      data() {
        return {
//          isRenewal: false, // 1 表示居住证有效期大于30天，0：小于30天，进入续签流程
          isRenewal: this.$route.query.isRenewal, // 1 表示居住证有效期大于30天，0：小于30天，进入续签流程
          fileType: this.$route.query.fileType,  // 文件类型
          idCard: this.$route.query.idCard,  // 身份证
          picList: [], // 其他图片列表
          photo: this.$route.query.photo ? this.$route.query.photo.split(',') : ''
        }
      },
      methods: {
        fileUploader () {  // 上传图片
          if (this.picList.length == 0) {
            this.$store.commit('SHOWTOAST', '请选择图片！');
          } else {
            this.$store.commit('UPDATE_LOADING', true);
            api.uploadPic({
              fileType: this.fileType,
              idCard: this.idCard,
              picList: this.picList
            }).then((res) => {
              if (res.data.success) this.$store.commit('SHOWTOAST', '上传成功！');
              this.$store.commit('UPDATE_LOADING', false);
            }).catch(() => {
              this.$store.commit('UPDATE_LOADING', false);
            })
          }
        },
        deletePic (uuid, index) {  // 删除图片
          if (uuid) {
            this.$store.commit('UPDATE_LOADING', true);
            api.deletePic(uuid).then((res)=>{
              if (res.data.success) this.$store.commit('SHOWTOAST', '删除成功！');
              this.$store.commit('UPDATE_LOADING', false);
            }).catch(() => {
              this.$store.commit('UPDATE_LOADING', false);
            })
          }
          this.picList.splice(index, 1)
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
		  this.$store.commit('UPDATE_LOADING', true);
          api.isHavePic(this.idCard).then((res)=>{
            const data = res.data.jsonRes[0]
			this.$store.commit('UPDATE_LOADING', false);
            if (res.data.success) {
              switch (this.fileType) {
                case '1':
                  this.picList = data.myPicIdCard;
                  if (!this.$route.query.photo) this.photo = data.myPicIdCard
                  break;
                case '2':
                  this.picList = data.myPicRedisdenceReceipt;
                  break;
                case '3':
                  this.picList = data.myPicRedisdenceBak;
                  break;
                case '4':
                  this.picList = data.myPicAddrReceipt;
              }

            }
          }).catch(()=>{
            this.$store.commit('UPDATE_LOADING', false);
          });
        }
      },
      mounted(){
        this.isHavePic();
        document.addEventListener('optionMenu', (e) => {this.$router.push({path: '/integralHome', query: {idNo: this.idCard}})}, false)
      }
  }
</script>
<style scoped lang="less">
  .picture_list{
    width:6.9rem;margin:0 auto;overflow: hidden;
    li{padding:.35rem 0;border-top:1px dashed #eee;position: relative;}
    li:first-of-type{/*border:none;*/}
    .select_pic{height:.8rem;margin-top:.5rem;border:1px dashed #eee;text-align: center;line-height: .7rem;padding:0;font-size: .8rem;color:#eee;}
    img{width:100%;height:auto;}
    .weui_icon_cancel{position: absolute;right:0;top:.4rem;}
  }

  .submit_btn{width: 5.8rem;height:.88rem;display:block;line-height:.88rem;margin:.6rem auto; border-radius: .1rem;text-align: center;color:#fff;font-size: .38rem;background: #1F67D0;}

  .go_next_btn{width:1rem;height:1rem;line-height:1rem;position: absolute;top:0;right:0;color:#fff;}
  .form_cont{position: fixed;bottom:0;}
</style>
