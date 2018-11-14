<template>
    <div class="solical">
      <div class="topbar">
        <div class="tab_item">
            <span class="tit pad-1" style="float:left;padding-left:.2rem" >社保编号：</span>
            <div class="detail-2" @click="clickSelce">{{selectSbNo.selectVal}}
              <i class="arrow"></i>
            </div>
            <div class="select-show" v-show="selectSbNo.selctShow" :class="{'show': selectSbNo.selctShow}">
              <span v-for="(item ,index) in selectSbNo.list" @click="selcetSbNo(index)">{{item.data.aac001}}</span>
            </div>
            <div class="png_bg" v-show="selectSbNo.selctShow"></div>
        </div>
      </div>

      <div class="topbar">
        <span class="t1">筛选 </span>
        <datetime :required="!isFirst" class="address_cont" v-model="starDate" title="" :max-year="new Date().getFullYear()" :min-year="1900" ref="dateTime"></datetime> - 
        <datetime :required="!isFirst" class="address_cont" v-model="endDate" title="" :max-year="new Date().getFullYear()" :min-year="1900" ref="dateTime"></datetime>

      </div>
      <ul class="tabs">
        <li v-for="(item,index) in tabs" class="tab_list " :class="{active:index == num}" @click="tab(index)" >{{item.name}}</li>
      </ul>
      <div class="tabCon"  v-if="hasDate == 1">
          <div v-for='(itemCon,index) in securityIn'> 

          <div class="count_box">
            汇缴年月 : <span>{{itemCon.data.aae003}} 共 {{itemCon.data.aae202}} 个月</span>
          </div>

          <div class="box-1" >

              <div class="tab_item status">
                <div class="tit">缴费状态</div>
                <!-- 0:未参保,1:正常参保,2:暂停参保,3:终止参保 -->
                <div class="detail" >{{itemCon.data.aae150}}</div>
              </div>
              <div class="tab_item">
                  <div class="tit">缴费单位</div>
                  <div class="detail">{{itemCon.data.aab069}}</div>
              </div>
              <div class="tab_item">
                  <div class="tit">缴费基数</div>
                  <div class="detail red_color"  v-if="type === 1">￥{{itemCon.data.aae180Yl}}</div>
                  <div class="detail red_color"  v-else-if="type === 3">￥{{itemCon.data.aae180Unemply}}</div>
                  <div class="detail red_color"  v-else-if="type === 4">￥{{itemCon.data.aae180Gs}}</div>
                  <div class="detail red_color"  v-else-if="type === 5">￥{{itemCon.data.aae180Sy}}</div>

              </div>
              <div class="tab_item" v-if="type === 1">
                  <div class="tit">单位缴费比例</div>
                  <div class="detail red_color">{{itemCon.data.dwbl}}</div>
              </div>
              <div class="tab_item">
                  <div class="tit">单位缴费金额</div>
                  <div class="detail red_color" v-if="type === 1">￥{{itemCon.data.aae140YlDw}}</div>
                  <div class="detail red_color"  v-else-if="type === 3">￥{{itemCon.data.aae140YlDw}}</div>
                  <div class="detail red_color"  v-else-if="type === 4">￥{{itemCon.data.aae140Gs}}</div>
                  <div class="detail red_color"  v-else-if="type === 5">￥{{itemCon.data.aae140Sy}}</div>

              </div>
              <div class="tab_item" v-if="type === 1">
                  <div class="tit">个人缴费比例</div>
                  <div class="detail red_color">{{itemCon.data.grbl}}</div>
              </div>
              <div class="tab_item" v-if="type === 1 || type === 3  ">
                  <div class="tit">个人缴费金额</div>
                  <div class="detail red_color" v-if="type === 1">￥{{itemCon.data.aae140YlGr}}</div>
                  <div class="detail red_color"  v-else-if="type === 3">￥{{itemCon.data.aae140UnemplyGr}}</div>

              </div>
          </div>

          </div>
      </div>
      <div class="tabCon0" v-if="hasDate == 0">{{noData}}</div>


    </div>
</template>
<script>
  import { Datetime, Confirm, TransferDomDirective as TransferDom } from 'vux'
import moment from 'moment'
import baseUrl from "../../api/config";
import api from "../../api/api";
export default {
    components: {  Datetime, Confirm },
  directives: {
    TransferDom
  },
  data() {
    return {
      idCard: this.$route.params.idCard,
      tabs: [
        { name: "养老", value: 1 },
        { name: "失业", value: 3 },
        { name: "工伤", value: 4 },
        { name: "生育", value: 5 },
        { name: "医疗", value: null },
      ],
      personalNo:'',
      securityIn:[],
      type:1,
      tabContents: [ "养老","失业", "工商", "生育", "医疗"],
      num: 0,
      starDate: 0,
      endDate: 0,
      isFirst: true,
      hasDate: '',
      noData: '',          //数据状态
      isDate: false,      //日期刷
      selectSbNo:{
        selectVal :localStorage.getItem("selectVal"),
        list:"",
        index:0,
        selctShow:false 
      },

    };
  },
  created: function () {
    this.getNewDate()
  },

  methods: {
    tab(index) {
      console.log()
      // aae140: 险种类型 1.养老 2.农转居  3.失业保险 4.工伤保险 5.生育保险；险种参数为空，返回的是全部险种
      this.num = index
      this.type = this.tabs[index].value
      this.getPayDeail(this.type);
    },
    dateIpnut(e) {
      console.log(e.target.value);
    },
    clickSelce () {
      if (this.selectSbNo.selctShow) {
        this.selectSbNo.selctShow = false
      }else{
        this.selectSbNo.selctShow = true
      }
      
    },
    selcetSbNo (index) {
      this.selectSbNo.selctShow = false
      this.selectSbNo.index = index
      this.num = 0;    
      this.getDate()
    },    
    getNewDate() {

      let date = new Date;
      let year = date.getFullYear(); 
      let month=date.getMonth()+1;
      month = ( month<10 ? "0"+month:month ); 
      let enddate = year.toString() + '-' + month.toString() + '-01';
      let stardate = year.toString() + '-01-01';
      this.endDate = enddate;
      this.starDate = stardate


    },
    getDate() {
      //基础查询
      let _index = this.selectSbNo.index
      this.$store.commit('UPDATE_LOADING', true);
      api.findPersonalBasicInfo({idCard:this.idCard}).then(res => {    
        if (res.data.success) {
          var data = res.data.jsonRes.output[_index].data;
          this.selectSbNo.list = res.data.jsonRes.output
          this.selectSbNo.selectVal = data.aac001          
          this.personalNo = data.aac001
          this.getPayDeail(1);

        }
      }).catch(() => {
        this.hasDate = 0
        this.noData =' 未查询到相关数据'
        this.$store.commit('UPDATE_LOADING', false);
      });;
    },
    getPayDeail(type) {
      this.type = type
      this.$store.commit('UPDATE_LOADING', true);
      //缴费明细
      var params = {
        aac001: this.personalNo,
        aae140: type,
        aae003s: this.starDate.replace(/-/, "").substr(0, 6),//.replace(/-/, ""),
        aae003d: this.endDate.replace(/-/, "").substr(0, 6)//.replace(/-/, ""),

      };
      api.personalContribution(params).then(res => {
        if(res.data.jsonRes.code=='1'){
            var data=res.data.jsonRes.output||[];
           //1.养老 2.农转居  3.失业保险 4.工伤保险 5.生育保险；险种参数为空，返回的是全部险种
           //
            if(this.type != null){
              
              let _this = this
              this.securityIn = data 
              this.hasDate = 1           
              if(data.length < 1 )  this.hasDate = 0
              if(_this.type == 1) {
                this.hasDate = 1
                for(var i = 0; i < this.securityIn.length; i++){
                  let _dwbl = (this.securityIn[i].data.aae140YlDw/this.securityIn[i].data.aae180Yl/this.securityIn[i].data.aae202)*100
                    _dwbl = Math.round(_dwbl) 
                  if(isNaN(_dwbl)){
                    _dwbl = "0"
                  }                    
                  let _grbl = (this.securityIn[i].data.aae140YlGr/this.securityIn[i].data.aae180Yl/this.securityIn[i].data.aae202)*100
                    _grbl = Math.round(_grbl)
                  if(isNaN(_grbl)){
                    _grbl = "0"
                  }   

                  this.$set(this.securityIn[i].data,'dwbl', _dwbl + "%")
                  this.$set(this.securityIn[i].data,'grbl',_grbl + "%" )
                }
              }

            }else{
              this.hasDate = 0 
              this.noData =' 未查询到相关数据'

            }
        }else{
              this.hasDate = 0 
              this.noData =' 未查询到相关数据'
        }
          this.$store.commit('UPDATE_LOADING', false)

      }).catch(() => {
        this.hasDate = 0
        this.noData =' 未查询到相关数据'
        this.$store.commit('UPDATE_LOADING', false)
      });
      this.isDate = true
    }
  },
  mounted() {
    this.getDate()    
  },
  watch:{
    starDate: {
      handler (cval, oval) {
        if(this.isDate){
          if(cval != oval ){
            let type = this.type
            let _starDate = this.starDate.replace(/-/, "").substr(0, 6)
            let _endDate = this.endDate.replace(/-/, "").substr(0, 6)
            if(_starDate >= _endDate){
              alert('结果日期必须大于开始日期一个月以上')
            }else{
              this.getPayDeail(type)
            }
            
          }  
        }


 
      },
      deep: true
    },
    endDate: {
      handler (cval, oval) {
        if(this.isDate){
          if(cval != oval){
            let type = this.type
            let _starDate = this.starDate.replace(/-/, "").substr(0, 6)
            let _endDate = this.endDate.replace(/-/, "").substr(0, 6)
            if(_starDate >= _endDate){
              alert('结果日期必须大于开始日期一个月以上')
            }else{
              this.getPayDeail(type)
            }
          }
        }
 
      },
      deep: true
    }
  }

}
</script>
<style lang="less" scoped>
.address_cont{margin:.1rem;border:.01rem solid #ccc;border-radius:.1rem;padding:0 .1rem;overflow:hidden; position: relative;}
.box-1{
  margin:0 .2rem;
  padding:.2rem;
  box-shadow: 0 0 1px 0 #ccc;
  background:#fff;
}
.tabCon0{
  padding:.5rem 0;
   text-align:center
}
.solical {
  min-height:13rem;
  padding-bottom:.2rem;
  background: #f5f8fa;
  .topbar {
    background: #fff;
    display: flex;
    padding: 0 0.2rem;
    box-sizing: border-box;
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.27rem;
    .t1{
      padding:0 .9rem 0 .2rem;
      
      color: #333;
    }
    .chose_date {
      flex: 4;
      .line {
        float: left;
        margin: 0 0.2rem;
      }
      .starDate {
        float: left;
        input {
          width: 2.2rem;
          border: 1px solid #ccc;
          font-size: 0.28rem;
          background: #fff;
        }
      }
      .endDate {
        float: left;
        input {
          width: 2.2rem;
          border: 1px solid #ccc;
          font-size: 0.28rem;
          background: #fff;
        }
      }
    }
  }
  .tabs {
    background: #fff;
    height: 0.88rem;
    margin: 0.18rem 0 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    line-height: 0.82rem;
    padding: 0 0.2rem;
    box-sizing: border-box;
    .tab_list {
      float: left;
      margin: 0 0.4rem;
    }

    .active {
      color: #1b8cef;
      border-bottom: 2px solid #1b8cef;
    }
  }
  .count_box {
    padding: 0.2rem 0 0.2rem 0.2rem;
    font-size: 0.26rem;
    color: #333;
  }
  .tabCon {
    
    padding:0 0.2rem;
    box-sizing: border-box;
    .tab_item {
      display: flex;
      line-height: 0.56rem;
      &.status {
        font-size: 0.32rem;
        border-bottom: 1px solid #e2e2e2;
        padding: 0.1rem;
        box-sizing: border-box;
        margin-bottom: 0.2rem;

        .detail {
          font-size: 0.32rem;
          color: #1b8cef;
        }
        .tit {

          color: #333;
          font-size: 0.32rem;
        }

      }
      .tit,
      .detail {
        flex: 1;
        font-size: 0.26rem;
      }
      .tit {
        color: #bbb;
      }
      .detail {
        text-align: right;
      }
      .red_color {
        color: #ff0000;
      }
    }
  }
}
.detail-2{float:left;width:2rem;height:.6rem;margin:.15rem .05rem 0;padding:0 .3rem 0 .1rem;line-height: .6rem;position: relative;}
.select-show{position: fixed;width:100%;min-height:30%;left:0;bottom:0;border:.01rem solid #ccc;padding:.2rem 0;background:#fff;z-index: 1000;}
.select-show span{display:block;margin:0 .5rem;padding:.1rem;border-bottom:.01rem solid #ccc; font-size:.35rem;text-align:center;}
.select-show.show{
-webkit-animation:fadeInUpBig .6s .1s ease both;
-moz-animation:fadeInUpBig .6s .1s ease both;}
@-webkit-keyframes fadeInUpBig{
0%{opacity:0;
-webkit-transform:translateY(100%)}
100%{opacity:1;
-webkit-transform:translateY(0)}
}
@-moz-keyframes fadeInUpBig{
0%{opacity:0;
-moz-transform:translateY(100%)}
100%{opacity:1;
-moz-transform:translateY(0)}}
.arrow{
  display: block;
  position: absolute;top:50%;right:.1rem;
    width: .15rem;
    height: .15rem;
    margin-top:-.12rem;
    border-top: 1px solid #888;
    border-left: 1px solid #888;
    transform:rotate(-135deg);
}
.png_bg{width:100%;height:100%;background:#000;opacity:.4;z-index:999;position: fixed;top:0;left:0;}
</style>

