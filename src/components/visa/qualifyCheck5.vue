<template>
  <div class="template_container">
    <step class="noBorbt" step="2" stepText1="资格校验" stepText2="上传资料" stepText3="提交申请"></step>

    <div class="form_cont"  id="check">
      <!-- <div @click="goNext">下一步</div> -->
      <!--签注证明材料-->
      <group :title="submitData.title" class="group_cont borbte5" ref="titleText">
        <custom-selector v-model="submitData.place1" describe="申领条件" :options="wayList"  @change="clickTab"></custom-selector>
      </group>
      <!--签注证明材料-->
      
    <form enctype="multipart/form-data">
      <!--  合法稳定就业证明  -->
      <group title="" class="group_cont borbte5" v-if="submitData.place1 === 1" >
        <div class="iconimgup1 bg2b" >
          <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
          <div class="upload_img" v-for="(item,index) of submitData.img1"> 
            <img :src="item.src" > 
            <span class="del" @click="fileDel(1,index,item.id)"><b></b></span>
          </div>            
        </div>
      </group>
      <group title="还需提供以下至少一种合法稳定就业证明材料" class="group_cont borbte5" v-if="submitData.place1 === 1">
        <div class="imgup1">
          <h3>劳动合同</h3>
          <div class="upload_list" v-for="(item,index) of submitData.img2"> 
            <img :src="item.src" > 
            <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
          </div>
          <div class="upload_img2"><input @change="fileChange($event, 2)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
        </div>
        <div class="imgup1 borT3">
          <h3>用人单位出具的劳动关系证明</h3>
          <div class="upload_list" v-for="(item,index) of submitData.img3"> 
            <img :src="item.src" > 
            <span class="del" @click="fileDel(3,index,item.id)"><b></b></span>
          </div>
          <div class="upload_img2"><input @change="fileChange($event, 3)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
        </div>
        <div class="imgup1 borT3">
          <h3>其他能够证明有合法稳定就业的材料</h3>
          <div class="upload_list" v-for="(item,index) of submitData.img4"> 
            <img :src="item.src" > 
            <span class="del" @click="fileDel(4,index,item.id)"><b></b></span>
          </div>
          <div class="upload_img2"><input @change="fileChange($event, 4)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
        </div>    
      </group>
      <!--  合法稳定就业证明end  -->
      <!--  连续就读证明   -->
      <group title="" class="group_cont borbte5" v-if="submitData.place1 === 2">
        <div class="iconimgup1 bg2c">
          <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
          <div class="upload_img" v-for="(item,index) of submitData.img1"> 
            <img :src="item.src" > 
            <span class="del" @click="fileDel(1,index,item.id)"><b></b></span>
          </div>            
        </div>
        <div class="imgup1 borT3">
          <h3>就读学校出具的连续就读证明</h3>
          <div class="upload_list " v-for="(item,index) of submitData.img2"> 
            <img :src="item.src" > 
            <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
          </div>
          <div class="upload_img2 "><input @change="fileChange($event, 2)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
        </div>    
      </group>
      <!--  连续就读证明end   -->


      <group title="" class="group_cont borbte5"  v-if="submitData.place1 === 3" style="margin-top:-.05rem;">
        <custom-selector v-model="submitData.place2" describe="居住处所类型" :options="wayList2"  @change="clickTab"></custom-selector>
      </group>
      <!--出租屋证明 -->
      <div  v-if="submitData.place1 === 3">
        <group title="" class="group_cont borbte5" v-if="submitData.place2 === 1">
          <div class="imgup1 borT3">
            <h3>房屋租赁合同</h3>
            <div class="upload_list" v-for="(item,index) of submitData.img2"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
            </div>
            <div class="upload_img2 nextSubmit"><input @change="fileChange($event, 2)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
          </div>
          <div class="imgup1 borT3">
            <h3>房屋出租人出具的住宿证明</h3>
            <div class="upload_list" v-for="(item,index) of submitData.img3"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(3,index,item.id)"><b></b></span>
            </div>
            <div class="upload_img2"><input @change="fileChange($event, 3)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
          </div> 
        </group>
        <!--出租屋证明 end-->
        <!--  自有住宅证明  -->
        <group title="" class="group_cont borbte5" v-if="submitData.place2 === 2">
          <div class="iconimgup1 bg2a">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index,item.id)"><b></b></span>
            </div>            
          </div>
          <div class="imgup1 borT3">
            <h3>购房合同</h3>
            <div class="upload_list" v-for="(item,index) of submitData.img2"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
            </div>
            <div class="upload_img2"><input @change="fileChange($event, 2)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
          </div> 
        </group>
        <!--  自有住宅证明end  -->
        <!-- 公用住宅证明-->
        <group title="" class="group_cont borbte5" v-if="submitData.place2 === 3">
          <div class="iconimgup1 bg2a">
            <i v-show="submitData.img1.length < 1"><input @change="fileChange($event, 1)" type="file"  multiple /></i>
            <div class="upload_img" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index,item.id)"><b></b></span>
            </div>            
          </div>
          <div class="imgup1 borT3">
            <h3>房屋出租人出具的住宿证明</h3>
            <div class="upload_list" v-for="(item,index) of submitData.img2"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(2,index,item.id)"><b></b></span>
            </div>
            <div class="upload_img2"><input @change="fileChange($event, 2)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
          </div> 
        </group>
        <!--  公用住宅证明 end  -->
        <!--企业单位住宿证明-->
        <group title="" class="group_cont borbte5" v-if="submitData.place2 === 4">
          <div class="imgup1 borT3">
            <h3>用人单位出具的住宿证明</h3>
            <div class="upload_list" v-for="(item,index) of submitData.img1"> 
              <img :src="item.src" > 
              <span class="del" @click="fileDel(1,index,item.id)"><b></b></span>
            </div>
            <div class="upload_img2"><input @change="fileChange($event, 1)" type="file"  multiple /><i class="icon"></i><span class="plus icon"></span></div>
          </div>
        </group>
        <!--企业单位住宿证明end  -->
      </div>

    </form>
    </div>


    <div class="mb30">
      <p class="pad_10">仅支持jpg、png格式的图片，图片大小不得大于300K且图片数量最多为8张</p>
      <a href="javascript:;" class="check_detail_btn" @click="goNext">下一步</a>
    </div>
      <!--确认、取消弹窗-->
    <div v-transfer-dom>
      <confirm v-model="Alerts.isShow" title="操作提示" @on-confirm="submitDatas">
        <p style="text-align:center;">确认并核对系统登记信息内容无误？</p>
      </confirm>
    </div>
      <!--确认、取消弹窗 END-->
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
          place: 1,
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
          step: 2,
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
            key: 3,
            value: '合法稳定住所证明'
          },        
          { 
            key: 1,
            value: '合法稳定就业证明'
          },
          { 
            key: 2,
            value: '连续就读'
          },


        ],
        wayList2:[
          { 
            key: 1,
            value: '出租屋'
          },
          { 
            key: 2,
            value: '自有住宅'
          },
          { 
            key: 3,
            value: '公用住宅'
          },
          { 
            key: 4,
            value: '企事业单位'
          }  

        ],
 
        submitData:{
          img1:[],
          img2:[],
          img3:[],
          img4:[],
          place1:3,
          place2:1,
          title:'合法稳定住所证明'
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

      
    },

    methods: {
      titleText () {     //显示tab标题
        if (this.submitData.place1 === 3) this.submitData.title = '合法稳定住所证明材料'
        else if(this.submitData.place1 === 1) this.submitData.title = '合法稳定就业证明材料'
        else if(this.submitData.place1 === 2) this.submitData.title = '连续就读材料'
      },
      verifyVal () {    //检查参数
        let MESSAGES = ''
        if (this.submitData.place1 === 3) {
          if (this.submitData.place2 === 2 || this.submitData.place2 === 3){
            if (this.submitData.img1.length > 0  ) {
              if(this.submitData.img2.length < 1 && this.submitData.img3.length < 1 && this.submitData.img4.length < 1  ) {
                MESSAGES = '请上传至少一种合法稳定住所证明材料'
                this.$store.commit('SHOWTOAST', MESSAGES)
                return false

              }else{
                return true
              }
            }else {
                MESSAGES = '请上传房产证明材料'
                this.$store.commit('SHOWTOAST', MESSAGES)
                return false
            }
          }else if(this.submitData.img1.length < 1 && this.submitData.img2.length < 1 && this.submitData.img3.length < 1 && this.submitData.img4.length < 1  ) {
            MESSAGES = '请上传至少一种合法稳定住所证明材料'
            this.$store.commit('SHOWTOAST', MESSAGES)
            return false
          }else{
            return true
          }
        }else{
          if (this.submitData.img1.length > 0  ) {
            if(this.submitData.img2.length < 1 && this.submitData.img3.length < 1 && this.submitData.img4.length < 1  ) {
              if (this.submitData.place1 === 1) {
                MESSAGES = '请上传至少一种合法稳定就业证明材料'
              }else if (this.submitData.place1 === 2) {
                MESSAGES = '请上就读学校出具的连续就读证明材料'
              }            
              this.$store.commit('SHOWTOAST', MESSAGES)
              return false

            }else{
              return true
            }
            
          }else{
            if(this.submitData.img1.length < 1) {
              if (this.submitData.place1 === 1) {
                MESSAGES = '请上传工商营业执照图片'
              }else if (this.submitData.place1 === 2) {
                MESSAGES = '请上传学生证图片'
              }
            }
            this.$store.commit('SHOWTOAST', MESSAGES)
            return false 
          }          
        }
      },
      fileChange(el, index){ 
        this.$store.commit('UPDATE_LOADING', true);
        if (!el.target.files[0].size) return; 
        this.fileList(el.target.files, index); 
        el.target.value = '' 
      }, 
      fileList(files, index, el){ 
        for (let i = 0; i < files.length; i++) { 
          this.fileAdd(files[i], index); 
        } 
      }, 
      fileAdd(file, index, el){ 
        //this.submitData.size = this.submitData.size + file.size;//总大小 
        let reader = new FileReader();
        let _this = this
        reader.vue = this; 
        reader.readAsDataURL(file);
        let _place2  = this.submitData.place2
        let _imgLength = this.submitData.img1.length + this.submitData.img2.length + this.submitData.img3.length + this.submitData.img4.length
        //判断选择的证明类型
        if(_this.submitData.place1 == 1) {      //合法稳定就业证明
          _this.upDatas.conditionType =1  
          if (index == 1) _this.upDatas.realType = 16    //单位营业执照
          if (index == 2) _this.upDatas.realType = 11    //单位劳动合同
          if (index == 3) _this.upDatas.realType = 12    //单位劳动关系证明
          if (index == 4) _this.upDatas.realType = 13    //其它合法劳动关系证明
        }else if(_this.submitData.place1 == 2) {   //连续就读
          _this.upDatas.conditionType =2 
          if (index == 1) _this.upDatas.realType = 17    //学生证
          if (index == 2) _this.upDatas.realType = 14     // 学校连续就读证明 
        }else if(_this.submitData.place1 == 3) {   //合法稳定住所证明
          _this.upDatas.conditionType = 3
          if(_place2 == 2){
            if (index == 1) _this.upDatas.realType = 15    //房产证明
            if (index == 2) _this.upDatas.realType = 9    //购房合同
          }else if(_place2 == 1){
            if (index == 2) _this.upDatas.realType = 7    //房屋租住合同
            if (index == 3) _this.upDatas.realType = 8    //住宿证明
          }else if(_place2 == 3){
            if (index == 1) _this.upDatas.realType = 15    //房产证明
            if (index == 2) _this.upDatas.realType = 8    //住宿证明
          }else if(_place2 == 4){
            if (index == 1) _this.upDatas.realType = 12   //单位住宿证明
          }
        }        

       if(_imgLength <= 7) {     //判断上传张数

        lrz(file, { width: 700 }).then(function(rst) {  
          _this.upDatas.file = rst.base64
          if (rst.file.size < 307200) {
            //=======图片上传至服务器
            api.setUpPic(_this.upDatas).then(res => {
              const _odata = res.data.obj
              if(res.data.success) {
                _delImgId = _odata.fid
                if(index === 1) {
                  _this.submitData.img1.push({ 
                    'src':rst.base64,
                    'id':_delImgId,
                  });            
                }else if (index === 2) {
                  _this.submitData.img2.push({ 
                    'src':rst.base64,
                    'id':_delImgId,
                  });                    
                }else if (index === 3) {
                  _this.submitData.img3.push({ 
                    'src':rst.base64,
                    'id':_delImgId,
                  });                    
                }else if (index === 4) {
                  _this.submitData.img4.push({ 
                    'src':rst.base64,
                    'id':_delImgId,
                  });                    
                }
              _this.$store.commit('SHOWTOAST', '上传成功!')
              localStorage.setItem('_updata2',JSON.stringify(_this.submitData))
              localStorage.setItem('_upImgplace2a',_this.submitData.place1)
              localStorage.setItem('_upImgplace2b',_this.submitData.place2)
              localStorage.setItem('_conditionType',_this.upDatas.conditionType)
              localStorage.setItem('_realType',_this.upDatas.realType)

              }else{
                _this.$store.commit('SHOWTOAST', '缺少参数，或者系统异常!')
              }
              _this.$store.commit('UPDATE_LOADING', false);
            })    
         //=======图片上传至服务器 end            
          }else{
            _this.$store.commit('SHOWTOAST', '图片质量过大!')
          }
          _this.$store.commit('UPDATE_LOADING', false);
          return rst;
        }).always(function() {
          // 清空文件上传控件的值
          el.target.value = null;
        });         
        }else{
          this.$store.commit('UPDATE_LOADING', false);
          this.$store.commit('SHOWTOAST', '图片数据不能超过8张!')
        }


      }, 
      fileDel(indexo,index,imgId){ 
        //this.submitData.size = this.submitData.size - this.submitData.img[index].file.size;//总大小 
              //本地存储

        this.$store.commit('UPDATE_LOADING', true);
        api.delImgData(imgId).then(res => {       //删除已上传图片
          const _odata = res.data.obj
          if(res.data.success) {
            if(indexo === 1){
              this.submitData.img1.splice(index, 1); 
            } else if(indexo === 2){
              this.submitData.img2.splice(index, 1); 
            } else if(indexo === 3){
              this.submitData.img3.splice(index, 1); 
            } else if(indexo === 4){
              this.submitData.img4.splice(index, 1); 
            }
            this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('SHOWTOAST', '删除成功!')
            localStorage.setItem('_updata2',JSON.stringify(this.submitData))
            localStorage.setItem('_upImgplace2a',this.submitData.place1)
            localStorage.setItem('_upImgplace2b',this.submitData.place2)
            localStorage.setItem('_conditionType',this.upDatas.conditionType)
            localStorage.setItem('_realType',this.upDatas.realType)
          }
          this.$store.commit('UPDATE_LOADING', false);

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
        let _data = localStorage.getItem('_updata2')
        let _upPalce1 = localStorage.getItem('_upImgplace2a')
        let _upPalce2 = localStorage.getItem('_upImgplace2b')
        _data = JSON.parse(_data)
        _upPalce1 = JSON.parse(_upPalce1)
        _upPalce2 = JSON.parse(_upPalce2)
        console.log(_upPalce1 +'===' + _upPalce2)
        if (_data.img1.length || _data.img2.length || _data.img3.length || _data.img4.length) {
          this.submitData = _data
          this.submitData.place1 = _upPalce1
          this.submitData.place2 = _upPalce2
        }      
      },
      submitDatas () {          //刷新式提交数据
        const conditionType = localStorage.getItem('_conditionType')
        const realType = localStorage.getItem('_realType') 
        if(realType) this.upDatas.realType = realType
        if(conditionType) this.upDatas.conditionType = conditionType

        this.$store.commit('UPDATE_LOADING', true);
        api.submiUpPic({
          rid:this.upDatas.rid,
          step:this.upDatas.step,
          liveType:this.upDatas.liveType,
          conditionType:this.upDatas.conditionType,          
        }).then(res => {
          if(res.data.success) {
             this.$router.push({path:'/claimsFor/' + this.formData.idCard + '/' + this.formData.openid + '/' + this.formData.realName + '/' + this.formData.rid + '/' + this.formData.getway}); 
            
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
      noEffect () {   //默认无响应
      },
      clickTab () {   //切换tab初如化数据
        this.submitData.img1 = []
        this.submitData.img2 = []
        this.submitData.img3 = []
        this.submitData.img4 = []        
      },  

        
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
<style lang="less" scoped>
.iconimgup1.bg2d{background: url(../../../static/images/bg_zj1.png) no-repeat center center ;background-size:100% auto;}
.iconimgup1.bg2c{background: url(../../../static/images/bg_zj2.png) no-repeat center center ;background-size:100% auto;}
.marBot1{border:2px solid red;}
.iconimgup1.bg2a{background: url(../../../static/images/bg_fc1.png) no-repeat center center ;background-size:100% auto;}
.iconimgup1.bg2b{background: url(../../../static/images/bg_zj1.png) no-repeat center center ;background-size:100% auto;}
</style>

