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
<!--     <div class="topbar">
        <h2>筛选</h2>
        <div class="chose_date">
            <div class="starDate"><input type="month" v-model='starDate' v-on:input='dateIpnut'> </div>
                <div class="line">—</div>
            <div class="endDate"><input type="month" v-model='endDate'> </div>
        </div>
    </div> -->
     <ul class="tabs">
        <li v-for="(item,index) in tabs" class="tab_list " :class="{active:index == num}" @click="tab(index)" >{{item.name}}</li>
        </ul>
        <!-- <div class="count_box">汇缴年月 : <span>{{starDate}}——{{endDate}} 共5个月</span> </div> -->
        <div class="tabCon" v-if="hasData=='1'">
            <div v-for='(itemCon,index) in tabContents' v-show=" index == num">
                <!-- {{itemCon}} -->
                <div class="tab_item status">
                    <div class="tit">缴费状态</div>
                      <!-- 0:未参保,1:正常参保,2:暂停参保,3:终止参保 -->
            <div class="detail" v-if="securityIn.userState === '0'">未参保</div>
            <div class="detail" v-else-if="securityIn.userState === '1'">正常参保</div>
            <div class="detail" v-else-if="securityIn.userState === '2'">暂停参保</div>
            <div class="detail" v-else-if="securityIn.userState =='3'">终止参保</div>
            </div>
                <div class="tab_item">
                    <div class="tit">最新参保单位名称</div>
                    <div class="detail">{{securityIn.companyName}}</div>
                </div>
                <div class="tab_item">
                    <div class="tit">首次参保年月</div>
                    <div class="detail">{{securityIn.beginPayDate}}</div>
                </div>
                <div class="tab_item">
                    <div class="tit">最后参保年月</div>
                    <div class="detail">{{securityIn.endPayDate}}</div>
                </div>
                <div class="tab_item">
                    <div class="tit">按月缴费年份</div>
                    <div class="detail">{{securityIn.yearSpan}}</div>
                </div>
                <div class="tab_item">
                    <div class="tit">缴费总金额</div>
                    <div class="detail red_color">￥{{securityIn.totalAmount}}</div>
                </div>
            </div>
            </div>
            <div class="tabCon0"  v-else>{{noData}}</div>
            <!-- 身份证输入 -->
            <!-- <div class="mask"></div>
            <div class="inputs_box">
                <div>请输入您的身份证号</div>
                <div><input type="text"></div>
                <div>确定</div>
            </div> -->
    </div>
</template>
<script>
import baseUrl from "../../api/config";
import api from "../../api/api";
export default {
  data() {
    return {
      // tabs: ["医疗", "养老", "失业", "工商", "生育"],
      idCard: this.$route.params.idCard,
      tabs: [
        { name: "养老", value: 1 },
        { name: "失业", value: 3 },
        { name: "工伤", value: 4 },
        { name: "生育", value: 5 },
        { name: "医疗", value: null },
      ],
      tabContents: [ "养老","失业", "工商", "生育", "医疗"],
      num: 0,
      starDate: "2018-01",
      endDate: "2018-06",
      idNo: null,
      selectSbNo:{
        selectVal :localStorage.getItem("selectVal"),
        list:"",
        index:0,
        selctShow:false 
      },
      securityIn: {
        personalNo:"",
        userState:"",
        companyName:"",
        type:"",
        beginPayDate: "",
        endPayDate: "",
        yearSpan: "",
        totalAmount: "", //总金额
        status: "0",
      },

      hasData: true,
      noData: '未查询到相关数据',
      isDate: false,      //日期刷

    };
  },
  methods: {
    tab(index) {
      this.$store.commit('UPDATE_LOADING', true);
      this.num = index;
      this.getPersonStatus(this.tabs[this.num].value);
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
    getDate() {
      //基础查询
      let _index = this.selectSbNo.index
      this.$store.commit('UPDATE_LOADING', true);
      api.findPersonalBasicInfo({idCard:this.idCard}).then(res => {    
        if (res.data.success) {
          let data = res.data.jsonRes.output[_index].data;
          this.selectSbNo.list = res.data.jsonRes.output
          this.selectSbNo.selectVal = data.aac001
          this.securityIn.personalNo = data.aac001
          this.securityIn.userState = data.aac031
          //this.securityIn.companyName = data.aab004 

          this.getPersonStatus(1);

        }
      }).catch(() => {
        this.hasData = 0
        this.$store.commit('UPDATE_LOADING', false);
      });
    },
    getPersonStatus(type) {
      var params = {
        personalNo: this.securityIn.personalNo,
        idCard: this.idCard, // this.idNo,
        type: type
      };

      api.personalPaymentStatus(params).then(res => {
        // 0:未参保,1:正常参保,2:暂停参保,3:终止参保
        if (res.data.success) {
          var data = res.data.jsonRes || [];
          // var data = [];
          if (data == [] || data.length == 0 || data.status == "" || data.status == null) {
           this.hasData = 0;
          } else {
            this.hasData = 1;
            this.securityIn.companyName = data.companyName;
            this.securityIn.beginPayDate = data.beginPayDate;
            this.securityIn.endPayDate = data.endPayDate;
            this.securityIn.yearSpan = data.yearSpan;
            this.securityIn.totalAmount = data.totalAmount;
            this.securityIn.status = data.status;

          }
          this.$store.commit('UPDATE_LOADING', false);  
        }
      }).catch(() => {
        this.hasData = 0
        this.$store.commit('UPDATE_LOADING', false);
      });
    }
  },
  mounted() {
    this.getDate();
  }
};
</script>
<style lang="less" scoped>
html,body{height: 100%;}

.tabCon0{
  padding:.5rem 0;
   text-align:center
}
.solical {
  background: #f5f8fa;
  height:auto;
  min-height:13rem;
  .topbar {
    background: #fff;
    display: flex;
    padding: 0 0.2rem;
    border-bottom: 1px solid #ccc;
    height: 0.9rem;
    line-height: 0.9rem;
    h2 {
      flex: 1;
      font-size: 0.28rem;
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
    line-height: 0.82rem;
    padding: 0 0.2rem;
    border-bottom:1px solid #ccc;
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
    margin: 0 0 0.28rem 0.2rem;
    font-size: 0.26rem;
    color: #333;
  }
  .tabCon {
    margin:.2rem .5rem;
    padding:0  0.2rem;
    background: #fff;
    height: auto;
    box-shadow: 0 0 1px 0 #ccc;
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
  .noData{
    text-align: center;
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
