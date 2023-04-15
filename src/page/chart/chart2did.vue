<template>
    <div class="bgcolor" style="display:flex;justify-content:center;align-items:top;">
        <div style="width:80%;">
            <el-row class="home" :gutter="20" style="overflow:hidden;">
                <el-col style="margin-top:0px;overflow:hidden;width:100%" :span="16" >
                    <el-row class="home" :gutter="20" style="overflow:hidden;">
                        <el-col style="margin-top:10px;overflow:hidden;width:6%;" :span="16" >
                            <el-button :icon="icon" @click="" style="border:none;background:rgba(55,255,255,0.02)"></el-button>
                        </el-col>   
                        <el-col style="margin-top:10px;overflow:hidden;width:75%;height:55px" :span="16" >   
                            <div v-show="showSetting" class="transition-box"> 
                                <el-col style="overflow:hidden;width:15%;" :span="16" >
                                    <a-select class="aselect" v-model:value="refreshValue" :options="refreshOpt"/>
                                </el-col>
                                <el-col style="overflow:hidden;width:20%;" :span="16" >
                                    <a-select class="aselect" v-model:value="inventoryValue" :options="inventoryOpt" @change="getChartData"/>
                                </el-col>                
                                <el-col style="overflow:hidden;width:35%;" :span="16" >
                                    <a-range-picker style="width:100%;" :locale="locale" size='large' v-model:value="dateRange">
                                        <template #suffixIcon>
                                            <i class="iconfont icon-riqi"></i>
                                        </template>
                                    </a-range-picker>
                                </el-col>
                                <el-col style="margin-top:20px;overflow:hidden;width:30%;" :span="16" >
                                    <el-button class="elbtn" icon="el-icon-coffee-cup" @click="getChartData" v-show="false">查询</el-button>
                                </el-col>
                            </div>

                            <div v-show=!showSetting> 
                                <el-row :gutter="20">
                                    <!-- <el-col style="overflow:hidden;width:6%;" >
                                    </el-col>
                                    <el-col style="overflow:hidden;width:22%;" >
                                        <span class="spanstatics">今日实时入库：<br>{{incount}}</span>
                                    </el-col>
                                    <el-col style="overflow:hidden;width:22%;">
                                        <span class="spanstatics">今日实时出库：<br>{{outcount}}</span>
                                    </el-col>
                                    <el-col style="overflow:hidden;width:22%;">
                                        <span class="spanstatics">今日入库金额：<br>{{inamount}}</span>
                                    </el-col>    
                                    <el-col style="overflow:hidden;width:22%;">
                                        <span class="spanstatics">今日出库金额：<br><i class="el-icon-s-flag" style="color: red"></i>{{outamount}}</span>
                                    </el-col>  
                                    <el-col style="overflow:hidden;width:6%;">
                                    </el-col>-->
                                    <el-col style="overflow:hidden;width:100%;" :span="16">
                                        <span class="spanTitle">2DID AS400-MAT</span>
                                    </el-col>

                                </el-row>
                            </div>    
                        </el-col> 
                        <el-col style="margin-top:12px;overflow:hidden;width:19%;" :span="16" >
                            <span class="spanrefresh">即将刷新：{{countback}}</span>
                        </el-col>      
                    </el-row>

                    <div class="graph">
                        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :page-size="nPerPage"
                        :total="nTotal">
                        </el-pagination> 
                    </div>
                    <!-- 折线图 -->
                    <div class="graph">

                        <el-card class="bgcolor elcard" shadow="hover" style="height:360px;overflow:hidden;width:100%;">
                            <div ref="chart01" style="height:360px"></div>
                        </el-card>  
                    </div>
                    <div class="graph">
                        <el-card class="bgcolor elcard" shadow="hover" style="height:360px;overflow:hidden;width:100%;">
                            <div ref="chart02" style="height:360px"></div>
                        </el-card>                            
                    </div>        
                    <div class="graph">
                        <el-card class="bgcolor elcard" shadow="hover" style="height:360px;overflow:hidden;width:100%;">
                            <div ref="chart03" style="height:360px"></div>
                        </el-card>                            
                    </div> 
 
                    
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import {getData} from '../../api/data.js'
import * as echarts from 'echarts'
import { getPie3D, getParametricEquation } from '../../utils/pie3d.js' //工具类js，页面路径自己修改
const color = ['#005aff', '#f8b551', '#668B8B', '#7Ee630', '#37f1e2', '#ddf1e2', '#FF34B3']

export default {
    name: 'home',
    data() {
        return {
            userImg: require('../../assets/images/user.png'),
            tableData: [],
            tableLabel:{},
            countData: [],

            showSetting: false,
            icon:"el-icon-d-arrow-right",
            incount: 0,
            outcount: 0,
            inamount: 0,
            outamount: 0,

            //自动刷新组变量
            countback: '',          // 倒数
            timer: null,            // 定时器
            triggertime: 0,         // 触发时间
            refreshValue: 20,       // 刷新间隔

            // 日期范围组变量        
            dateRange:[],
 
            // 图表组变量         
            echartsData: {},
            nTotal: 0,
            nPage: 0, 
            nPerPage: 3, 
            nPStatus: 2, 
            nLot: 9,

            // percent
            percent:{
                as400:0,
                mat:0,
            }
        }
    },
    methods: {
        onShowSetting() {
            this.showSetting=!this.showSetting
            this.icon = this.showSetting ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right';
        },

        genDefaultAry(key, ary) {
            this.percent.as400 = 0;
            this.percent.mat = 0;
            let AS400SUM = 0;
            let MATSUM = 0;
            let AS400RATESUM = 0;
            let MATRATESUM = 0;
            let rtnAry = [];
            if (ary==null || typeof ary === 'undefined' || ary.length == 0) {
                for (let i = 0; i < 9; i++){
                    let tmp = {
                        KEY: key,
                        LOTNO: "N/A",
                        PWKQTY: 0,
                        MATCnt: 0,
                        RATE400: 0,
                        RATEMAT: 0,
                    }
                    rtnAry.push(tmp);
                }
            }    
            else {
                 
                for (let i = 0; i < ary.length; i++){
                    let tmp = {
                        KEY: ary[i].KEY,
                        LOTNO: ary[i].LOTNO,
                        PWKQTY: ary[i].PWKQTY,
                        MATCnt: ary[i].MATCnt,
                        RATE400: (ary[i].PWKQTY+0.0)/(ary[i].PWKQTY+ary[i].MATCnt),
                        RATEMAT: (ary[i].MATCnt+0.0)/(ary[i].PWKQTY+ary[i].MATCnt),
                    } 
                    rtnAry.push(tmp);
                    AS400SUM += ary[i].PWKQTY;
                    MATSUM += ary[i].MATCnt;
                    AS400RATESUM += (ary[i].PWKQTY+0.0)/(ary[i].PWKQTY+ary[i].MATCnt);
                    MATRATESUM += (ary[i].MATCnt+0.0)/(ary[i].PWKQTY+ary[i].MATCnt);
                }  
                // this.percent.as400 = (AS400SUM+0.0)/(AS400SUM+MATSUM);
                // this.percent.mat = (MATSUM+0.0)/(AS400SUM+MATSUM);
                this.percent.as400 = (AS400RATESUM + 0.0) / ary.length;
                this.percent.mat = (MATRATESUM + 0.0) / ary.length;
                console.log('111111111111.1='+this.percent.as400);
                console.log('222222222222.2='+this.percent.mat);
            }        
            return rtnAry;
        },

        getChartData() {
            let beginDate = this.dateRange[0].format('YYYYMMDD');
            let endDate = this.dateRange[1].format('YYYYMMDD');
            let that = this;
            let data = {"nPage":this.nPage, "nPerPage":this.nPerPage, "nPStatus":this.nPStatus, "nLot":this.nLot};

            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            this.$axios({
                method: 'post', 
                url: '/api/common/chart2did', 
                data
            }).then(function (resp) {
                console.log(JSON.stringify(resp));
                if (resp.data.code == 0) {
                    let respData = resp.data.data;
                    let mapData = respData.mapData == null ? [] : respData.mapData;
                    let aryData = respData.aryData == null ? [] : respData.aryData;
                    that.nTotal = respData.nTotal;
                    console.log('1111111111111111.1',aryData[0]);
                    console.log('1111111111111111.2',mapData[aryData[0]]);

                    let ary = that.genDefaultAry(aryData[0], mapData[aryData[0]]);
                    console.log(JSON.stringify(ary));
                    let option = that.genChartOption(ary);
                    echarts.init(that.$refs.chart01).dispose();
                    const myEcharts01 = echarts.init(that.$refs.chart01);
                    myEcharts01.setOption(option);

                    ary = that.genDefaultAry(aryData[1], mapData[aryData[1]]);
                    option = that.genChartOption(ary);
                    echarts.init(that.$refs.chart02).dispose();
                    const myEcharts02 = echarts.init(that.$refs.chart02);
                    myEcharts02.setOption(option);

                    ary = that.genDefaultAry(aryData[2], mapData[aryData[2]]);
                    console.log('8888888888888.2', ary);
                    option = that.genChartOption(ary);
                    echarts.init(that.$refs.chart03).dispose();
                    const myEcharts03 = echarts.init(that.$refs.chart03);
                    myEcharts03.setOption(option);                                        

                    loading.close();
                }
                else {
                    that.$alert(resp.data.msg, '提示', {
                        type:'error',
                        confirmButtonText: '确定',
                        callback: action => {}
                    });					
                }
            });
        },

        // Bar柱图刷新
        genChartOption(aryData) {
            console.log('...........................'+aryData.length);
            let that = this;
            let option = {
                legend: {
                    // // 右中    
                    // orient: 'vertical',
                    // x:'right',
                    // y:'center',
                    right:"right",
                    align:"left",
                    //图例文字颜色
                    textStyle:{
                        //color:"#fff",
                        rich: {
                            name: {
                                verticalAlign: 'middle',
                                align: 'left',
                                width: 60,
                                fontSize: 12,
                                color: '#fff',
                                
                            },
                            rate: {
                                verticalAlign: 'middle',
                                align: 'left',
                                width: 50,
                                fontSize: 30,
                                //fontWeight: 700,
                                color: '#fff'
                            },
                        },
                    },
                    data:["AS400", "MAT"],
                    formatter: function (name) {
                        let rate = name === "AS400" ? that.percent.as400 : that.percent.mat;
                        rate = (rate * 100).toFixed(2);
                        return ('{name|' + name + '} ' +'{rate|' + rate + '%} ');
                    }
                },
                grid: {
                    left: "2%",
                    right: "20%",
                    bottom: "7%",
                    containLabel: true, //是否包含坐标轴的文字
                },
                //提示框
                tooltip: {
                    trigger: "axis",
                    transitionDuration:0,
                },
                title:{
                    text: aryData[0].KEY,//+','+aryData[0].PWEKOT,
                    textStyle:{
                        color: "#fff"
                    }                            
                },                    
                xAxis: {
                    type: "value",
                    name: '数量',
                    //position: 'left',
                    axisLabel: {
                        formatter: function(value, index) {
                            var value;
                            if (value >=1000) {
                                value = value/1000+'k';
                            }else if(value <1000){
                                value = value;
                            }
                            return value;
                        }
                    },                            
                }, 
                yAxis:{
                    type: "category",//类目轴
                    data: aryData.map((item) => item.LOTNO),
                    axisLine: {
                        lineStyle: {
                            //color: "#551A8B",//"#17b3a3"
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        //color: "#551A8B",//"#333",
                        formatter: (val) => {
                            return `${val}`;
                        }
                    }  
                },
                color: ['#EE3A8C', '#00CDCD'],
                series: [
                    {
                        name: "AS400",
                        data: aryData.map((item) => item.PWKQTY),
                        type: 'bar',
                        stack: 'stack',
                        yAxisIndex:0,
                        // 柱子渐进色+背景透明
                        itemStyle:{
                            color:'#EE3A8C',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        let rate = (item.RATE400 * 100).toFixed(2);
                                        return (item.PWKQTY + '(' + rate + '%)');
                                    },
                                    position: 'inside', //在上方显示
                                    textStyle: {
                                        //数值样式
                                        color: 'white',
                                        fontSize: 12,
                                    },
                                },
                            },
                        }
                    },
                    {
                        name: "MAT",
                        data: aryData.map((item) => item.MATCnt),
                        type: 'bar',
                        stack: 'stack',  
                        yAxisIndex:0,       
                        itemStyle:{
                            color:'#00CDCD',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        let rate = (item.RATEMAT * 100).toFixed(2);
                                        return (item.MATCnt + '(' + rate + '%)');
                                    },
                                    position: 'inside', //在上方显示
                                    textStyle: {
                                        //数值样式
                                        color: 'white',
                                        fontSize: 12,
                                    },
                                },
                            },                            
                        }                                  
                    }                        
                ]
            };                
            return option;
        },
        // 分页方法      
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.nPage = val - 1;
            console.log('currPage:', this.nPage);
            this.getChartData();
        },
		// 自适应宽高
		changeSize () {
			this.statusChart.resize()
		}        
    },
    created() {
        document.title = '2DID';
    },
    mounted() {
        //this.dateRange.push(this.$moment().startOf('month'));
        this.dateRange.push(this.$moment().add(-1,'month'));
        this.dateRange.push(this.$moment());
        this.getChartData();
        // this.timer = setInterval(()=>{
        //     let hh = new Date().getHours();
        //     let mm = new Date().getMinutes();
        //     let ss = new Date().getSeconds();
        //     let n = this.refreshValue;
        //     if (mm == this.triggertime) {
        //         console.log('111', mm, ss, this.triggertime);
        //         this.getChartData();
        //     }
            
        //     let countback = this.triggertime * 60 - (mm * 60 + ss);
        //     if (countback > 0) 
        //         this.countback = Math.floor(countback/60).toString().padStart(2, '0')+':'+(countback % 60).toString().padStart(2, '0'); 
        //     console.log('222', mm, ss, n, this.triggertime, this.countback);
        //     this.triggertime = (Math.floor(mm/n) + 1) * n;
        // }, 1000);

    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
}
</script>
<style scoped>

.btnrow {
    height: 50px;
    /* 固定宽度，避免控件自适应宽度跑到下一行 */
    width: 520px;
    display: flex;
    flex-wrap: wrap;
	justify-content: space-between;
}
/* aselect 设置宽高 */
.aselect{
    width:100%;
}
:deep(.aselect) .ant-select-selection{
    height: 40px;
}
:deep(.aselect) .ant-select-selection__rendered{
    margin-top: 4px;
}
:deep(.aselect) .ant-select-selection-selected-value{ 
    display: block; 
    opacity: 1;
    font-size: 14px;
}

/* span 渐进色 */
.spanrefresh{
    background-image: linear-gradient(135deg, deeppink, dodgerblue);
    font-size: 22px;
    font-weight: bold;
    line-height: 40px;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    -moz-box-decoration-break: clone;
    color: transparent;
    position:relative;
}
.spanrefresh::selection{
    color:deeppink;
    background-color: #0ff;
}

.spanstatics {
    font-size: 18px;
    font-weight: bold;
    line-height: 30px;   
    color:#fff; 
}

.spanTitle {
    font-size: 28px;
    font-weight: bold;
    line-height: 40px;   
    color:#fff; 
}

.bgcolor{
    background:#0A2069;
}
.elcard{
    width:49.5%;
}

.transition-box {
    /* background: #0ff;  */
    height: 40px;
    width: 100%;
}

.pie3dchart,	.bg {
    width: 100%;
    height: 100%;
}

.bg {
    position: absolute;
    bottom: 50px;
    left: 50%;
    z-index: -1;
    width: 180px;
    height: 73px;
    background: no-repeat center;
    background-image: url('https://ks3-cn-beijing.ksyun.com/sxjg-elevator/datav-platform-2.0/images/chart_opacity_bg.png');
    background-size: 100% 100%;
    transform: translateX(-50%);
}
</style>