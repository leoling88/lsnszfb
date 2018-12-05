<template>
  <div class="template_container">
    <step class="noBorbt" step="2" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>

    <div class="form_cont" id="check">
      <!-- <div @click="goNext">下一步</div> -->
      <!--签注证明材料-->
      <group title="申请人身份证明" class="group_cont borbte5">
        <custom-selector v-model="submitData.place1" describe="身份证明类别" :options="wayList" @change="clickTab"></custom-selector>
      </group>
      <!--签注证明材料-->
 
      <form enctype="multipart/form-data">

        <group title="上传居民身份证图片资料" class="group_cont borbte5" v-if="submitData.place1 === 1" >
          <div class="iconimgup1 bg1">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index,item.id)"  ><b></b></span>
            </div>            
          </div>
          <div class="iconimgup1 bg2">
            <i v-show="submitData.img2.length < 1"><input @change="fileChange($event, 2)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img2"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
            </div>            
          </div>
        </group>

        <group title="上传户口本图片资料" class="group_cont borbte5" v-if="submitData.place1 === 2">
          <div class="iconimgup1 bg3">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index,item.id)"><b></b></span>
            </div>            
          </div>
          <div class="iconimgup1 bg4">
            <i v-show="submitData.img2.length < 1"><input @change="fileChange($event, 2)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img2"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
            </div>            
          </div>
        </group>

        <group title="上传护照图片资料" class="group_cont borbte5" v-if="submitData.place1 === 3">
          <div class="iconimgup1 bg5">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index),item.id"><b></b></span>
            </div>            
          </div>
        </group>

        <group title="上传驾驶证图片资料" class="group_cont borbte5" v-if="submitData.place1 === 4">
          <div class="iconimgup1 bg6">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index),item.id"><b></b></span>
            </div>            
          </div>
        </group>

        <group title="上传临时身份证图片资料" class="group_cont borbte5" v-if="submitData.place1 === 5">
          <div class="iconimgup1 bg7">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index),item.id" :alt="submitData.img1.id"><b></b></span>
            </div>            
          </div>
          <div class="iconimgup1 bg8">
            <i v-show="submitData.img2.length < 1"><input @change="fileChange($event, 2)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img2"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(2,index),item.id"><b></b></span>
            </div>            
          </div>
        </group> 

        <group title="上传公安机关提供的身份证明文件图片资料" class="group_cont borbte5" v-if="submitData.place1 === 6">
          <div class="iconimgup1 bg9">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index),item.id"><b></b></span>
            </div>            
          </div>
        </group>          
      </form>
    </div>


    <div class="mb30">
      <p class="pad_10">仅支持jpg、png格式的图片，图片大小不得大于300K且图片数量最多为8张</p>
      <a href="javascript:;" class="check_detail_btn" @click="goNext">下一步</a>
    </div>
      <!--确认、取消弹窗--
    <div v-transfer-dom>
      <confirm v-model="Alerts.isShow" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">确认并核对系统登记信息内容无误？</p>
      </confirm>
    </div>
      !--确认、取消弹窗 END-->
  </div>
</template>
<script>
  import {Confirm, Group, Cell, TransferDomDirective  as TransferDom} from 'vux'
  import customSelector from '../common/customSelector.vue'
  import SelectorSearch from '../common/SelectorSearch.vue'
  import Step from '../common/Step.vue'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  let _delImgId
  export default {
    name: 'claimsFor',
    components: {Group, Cell,Step, customSelector, Confirm},
    directives: {TransferDom},
    data() {
      return {
        formData:{
          realName: this.$route.params.name,
          idCard: this.$route.params.idCard,
          phone:'',
          place:'',
          address: '',
          cardTime: '',
          openid: this.$route.params.openid,
          orginType: 1,// 支付宝标记,
          opentype: 1,
          homeType: 'lspy_',  // 番禺区域标记,
          rid: this.$route.params.cid,   //签注流程id
          type: 1,  //1.居住证 2.居住登记3.EMS
          getway:  this.$route.params.getway,  //签注领取方式  0：全部可选   1：只能EMS
        },
        upDatas:{
          rid: this.$route.params.cid,   //签注流程id
          step: 1,
          realType:'',
          file:'',
          liveType:'',
          idCardType:'',
          conditionType:'',

        },
        alertMsg:{
          value:true,
          msg:''

        },
      
        showLoading:true,
        wayList:[
          { 
            key: 1,
            value: '居民身份证'
          },
          { 
            key: 2,
            value: '户口簿'
          },
          { 
            key: 3,
            value: '护照'
          },
          { 
            key: 4,
            value: '驾驶证'
          },
          { 
            key: 5,
            value: '临时身份证'
          }, 
          { 
            key: 6,
            value: '公安机关出具的身份证明'
          }               
        ],

        submitData:{
          img1:[],
          img2:[],
          place1: 1   //证明类型
        },

        Alerts:{
          isShow: false,
          text:''
        },    
        inputValid: {

          cellAdd: (val) => {
            if (val) {
              return true
            }
          },

        }

      }
    },
    computed: {
    // 　　newSubmitData(val, oldVal){
    //       return this.submitData.place1
    //   }
    },    
    methods: {

      verifyVal () {      //检查参数
        let MESSAGES = ''
        if(this.submitData.place1 === 1 || this.submitData.place1 === 2 || this.submitData.place1 === 5){
          if (this.submitData.img1.length > 0 && this.submitData.img2.length > 0 ) {
            return true
          }else{
            if(this.submitData.place1 === 1){
              if(this.submitData.img1.length < 1) MESSAGES = '请上传居民身份证件背面图片'
              else if(this.submitData.img2.length < 1) MESSAGES = '请上传居民身份证件正面图片'
            }else if(this.submitData.place1 === 2){
              if(this.submitData.img1.length < 1) MESSAGES = '请上传户口本户主页'
              else if(this.submitData.img2.length < 1) MESSAGES = '请上传户口本户个人页'
            }else if(this.submitData.place1 === 5){
              if(this.submitData.img1.length < 1) MESSAGES = '请上传临时身份证件背面图片'
              else if(this.submitData.img2.length < 1) MESSAGES = '请上传临时身份证件正面图片'
            }
            this.$store.commit('SHOWTOAST', MESSAGES)
            return false 
          }
        }else if(this.submitData.place1 === 3 || this.submitData.place1 === 4) {
          if (this.submitData.img1.length > 0) {
            return true
          }else{
            if(this.submitData.place1 === 3) MESSAGES = '请上传护照图片资料'
            else if(this.submitData.place1 === 4) MESSAGES = '请上传驾驶证图片资料'
            
            this.$store.commit('SHOWTOAST', MESSAGES)
            return false 
          }
        }else if(this.submitData.place1 === 6) {
          if (this.submitData.img1.length > 0) {
            return true
          }else {
            MESSAGES = '上传公安机关提供的身份证明文件图片'
            this.$store.commit('SHOWTOAST', MESSAGES)
            return false 
          }
        }else{
          MESSAGES = '参数出错！'
          this.$store.commit('SHOWTOAST', MESSAGES)
          return false           
        }

      },
      fileChange(el, index){ 
        this.$store.commit('UPDATE_LOADING', true);
        if (!el.target.files[0].size) return; 
        this.fileList(el.target.files, index); 
        el.target.value = '' 
      }, 
      fileList(files, index){ 
        for (let i = 0; i < files.length; i++) { 
          this.fileAdd(files[i], index); 
        } 
      }, 
      fileAdd(file, index){ 
        //this.submitData.size = this.submitData.size + file.size;//总大小 
        let reader = new FileReader();
        let _this = this
        reader.vue = this; 
        reader.readAsDataURL(file);
        let i = index
        this.$store.commit('UPDATE_LOADING', true);
        if(file.size < 300459){
            reader.onload = function () { 
              file = this.result; 
              _this.upDatas.file = file
              //判断选择的证明类型
              if(_this.submitData.place1 == 1) {      //居民身份证
                _this.upDatas.realType = 1
                _this.upDatas.idCardType =1  
              }else if(_this.submitData.place1 == 2) {   //户口簿
                _this.upDatas.realType = 2
                _this.upDatas.idCardType =2  
              }else if(_this.submitData.place1 == 3) {   //护照
                _this.upDatas.realType = 3
                _this.upDatas.idCardType =3  
              }else if(_this.submitData.place1 == 4) {   //驾驶证
                _this.upDatas.realType = 4
                _this.upDatas.idCardType =4  
              }else if(_this.submitData.place1 == 5) {   //临时身份证
                _this.upDatas.realType = 5
                _this.upDatas.idCardType =5  
              }else if(_this.submitData.place1 == 6) {   //公安机关出具的身份证明
                _this.upDatas.realType = 6
                _this.upDatas.idCardType = 6  
              }
                //=======提交上传
              api.setUpPic(_this.upDatas).then(res => {
                const _odata = res.data.obj
                if(res.data.success) {
                  _delImgId = _odata.fid
                  if(index === 1) {
                    this.vue.submitData.img1.push({ 
                      'src':file,
                      'id':_delImgId,
                    });
                  }else if (index === 2) {
                    this.vue.submitData.img2.push({ 
                      'src':file,
                      'id':_delImgId,
                    });                    
                  }
                  _this.$store.commit('SHOWTOAST', '上传成功!')
                  localStorage.setItem('_updata1',JSON.stringify(_this.submitData))
                  localStorage.setItem('_upImgplace1',_this.submitData.place1)
                  localStorage.setItem('_idCardType',_this.upDatas.idCardType)
                }else{
                  _this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
                }
                _this.$store.commit('UPDATE_LOADING', false);
              }).catch(() => {
                _this.$store.commit('SHOWTOAST', '网络异常!')
              })    
             //=======提交上传 end
            } 
         }else{
          this.$store.commit('SHOWTOAST', '图片不能大于300K!')
          this.$store.commit('UPDATE_LOADING', false);
         }

      }, 
      fileDel(indexo,index, imgId){ 
        //this.submitData.size = this.submitData.size - this.submitData.img[index].file.size;//总大小 
        this.$store.commit('UPDATE_LOADING', true);
        api.delImgData(imgId).then(res => {     //删除已上传图片
          this.$store.commit('UPDATE_LOADING', false);
          const _odata = res.data.obj
          if(res.data.success) {
            if(indexo === 1){
              this.submitData.img1.splice(index, 1); 
            } else if(indexo === 2){
              this.submitData.img2.splice(index, 1); 
            }
            this.$store.commit('SHOWTOAST', '删除成功!')

            localStorage.setItem('_upImgplace1',this.submitData.place1)
            localStorage.setItem('_updata1',JSON.stringify(this.submitData))
          }

        })       

      }, 
      bytesToSize(bytes){ 
        if (bytes === 0) return '0 B'; 
        let k = 1000, // or 1024 
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], 
          i = Math.floor(Math.log(bytes) / Math.log(k)); 
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]; 
      },
      requirePic () {
        let _data = localStorage.getItem('_updata1')
        let _upPalce = localStorage.getItem('_upImgplace1')
        _data = JSON.parse(_data)
        _upPalce = JSON.parse(_upPalce)
        if (_data.img1.length || _data.img2.length || _data.img3.length || _data.img4.length) {
          this.submitData = _data
          this.submitData.place1 = _upPalce
        }
      
      },

      submitDatas () {       //刷新式提交数据
        const idCardType = localStorage.getItem('_idCardType')
        if(idCardType) this.upDatas.idCardType = idCardType
        this.$store.commit('UPDATE_LOADING', true);
        api.submiUpPic({
          rid:this.upDatas.rid,
          step:this.upDatas.step,
          idCardType:this.upDatas.idCardType,
          conditionType:this.upDatas.conditionType,          
        }).then(res => {
          
          if(res.data.success) {
            this.$router.push({path:'/qualifyCheck5/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.getway });
            
          }else{
            this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
          }
          this.$store.commit('UPDATE_LOADING', false);
        }).catch(() => {
          // this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '网络异常!')
        })        
      },

      goNext () {
        if (this.verifyVal()){
          this.submitDatas () 
        }
      },
      clickTab () {   //切换tab初如化数据
        this.submitData.img1 = []
        this.submitData.img2 = []
        this.submitData.img3 = []
        this.submitData.img4 = []        
      },
      noEffect () {   //默认无响应
      }  
  
    },
    created() {
      this.requirePic()
    },
    mounted () {
      document.addEventListener('optionMenu', this.noEffect, false) // 绑定支付宝右上角点击事件

    },
    destroyed () {
      document.removeEventListener('optionMenu', this.noEffect, true) // 删除支付宝右上角点击事件
    },
    watch:{
    }    
  }
</script>
<style lang="less" >
.iconimgup1.bg1{background: url(../../../static/images/bg_sfz1.png) no-repeat center center ;background-size:100% auto;}
.iconimgup1.bg2{background: url(../../../static/images/bg_sfz2.png) no-repeat center center ;background-size:100% auto;}
.iconimgup1.bg3{background: url(../../../static/images/bg_pkb1.png) no-repeat center center ;background-size:101% auto;}
.iconimgup1.bg4{background: url(../../../static/images/bg_pkb2.png) no-repeat center center ;background-size:101% auto;}
.iconimgup1.bg5{background: url(../../../static/images/bg_hz1.png) no-repeat center center ;background-size:101% auto;}
.iconimgup1.bg6{background: url(../../../static/images/bg_jz1.png) no-repeat center center ;background-size:101% auto;}
.iconimgup1.bg7{background: url(../../../static/images/bg_lssfz2.png) no-repeat center center ;background-size:101% auto;}
.iconimgup1.bg8{background: url(../../../static/images/bg_lssfz1.png) no-repeat center center ;background-size:101% auto;}
.iconimgup1.bg9{background: url(../../../static/images/bg_gzsfzm1.png) no-repeat center center ;background-size:101% auto;}


</style>

