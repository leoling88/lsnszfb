<template>
    <div>
      <ul class="fileUploader">
        <template v-for="(item,index) in thumbs">
          <li><img :src="item.src"><span class="del_btn" @click="removeFile(item.file, index)">×</span></li>
        </template>
        <li class="picker"><img src="../../../static/images/issue_uploader.jpg"></li>
      </ul>

    </div>
</template>
<script>
  import Webuploader from 'webuploader'
  export default {
    data () {
      return {
        uploader: '',
        thumbs: [] // 缩略图
      }
    },
    watch: {
      thumbs: (val, old) => {
//        console.log(val)
      }
    },
    methods: {
      createWebUploader () {
        this.uploader = Webuploader.create({
          auto: true, // 自动上传
          swf: '../../../static/Uploader.swf',
          server: `/cnRent/mobile/upPic`,
          pick: {
            id: '.picker',
            multiple: true
          },
          duplicate: false, // 去重
          fileSizeLimit: 1024 * 1024 * 5,  // 单个文件大小不超过5M
          accept: {
            title: '*',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
          }
        })
//        this.uploader.on('uploadBeforeSend', this.uploadBeforeSend)
//        this.uploader.on('uploadProgress', this.uploadProgress)
        this.uploader.on('uploadSuccess', this.uploadSuccess)
//        this.uploader.on('uploadError', this.uploadError)
        this.uploader.on('error', this.uploadValidata)
      },
      uploadSuccess (file, res) {
        this.$emit('uploaded', res.jsonRes[0])
        this.uploader.makeThumb(file, (errors, src) => { // 创建缩略图
          this.thumbs.push({file, src})
        })
      },
      uploadError (file, reason) {
        if (reason === 'http') {
          this.$message('上传出错！请更新浏览器到最新版本或使用谷歌浏览器上传！')
        }
        this.uploader.removeFile(file, true)
      },
      uploadValidata (type) { // 校验
        switch (type) {
          case 'F_DUPLICATE': // 是否重复
            this.$message('该文件您已经上传过了，请不要重复上传！')
            break
          case 'Q_TYPE_DENIED': // 文件类型是否满足
            this.$message('请上传后缀为.jpg，.gif，.bmp，.gif等图片文件')
            break
          case 'Q_EXCEED_SIZE_LIMIT': // 文件大小是否超出
            this.$message('请上传大小不超过5M的文件')
            break
        }
      },
      removeFile (file, index) {
        this.uploader.removeFile(file, true)
        this.thumbs.splice(index, 1)
        this.$emit('deleteFile', index)
      }
    },
    mounted () {
      this.createWebUploader()
    }
  }
</script>
<style lang="less">
  .fileUploader{
    width:92%;float:left;overflow: hidden;
    li{
      width:178px;height:118px;overflow:hidden;float: left;margin:0 23px 23px 0;position: relative;border: 1px solid #e0e0e0;
      .del_btn{display: none;width:24px;height:24px;line-height: 22px;position: absolute;right:0;top:0;border:1px solid #999;border-radius: 100px;font-size: 20px;text-align: center;cursor: pointer;color:#999;}
      .del_btn:hover{background: #999;color:#fff;}
      img{width:100%;height:auto;}
      .webuploader-element-invisible{opacity: 0;filter:alpha(opacity=0);cursor: pointer;}
    }
    .picker{cursor: pointer;border: none;width:180px;height:120px;}
    li:hover .del_btn{display: block;}
  }
</style>
