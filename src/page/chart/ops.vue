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
                            <div v-show=!showSetting> 
                                <el-row :gutter="20">
                                    <el-col style="overflow:hidden;width:100%;" :span="16">
                                        <span class="spanTitle">ORDER-PRODUCTION-SALES</span>
                                    </el-col>

                                </el-row>
                            </div>    
                        </el-col> 
                        <el-col style="margin-top:12px;overflow:hidden;width:19%;" :span="16" >
                            <span class="spanrefresh">即将刷新：{{countback}}</span>
                        </el-col>      
                    </el-row>

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
import * as echarts from 'echarts'

export default {
    name: 'home',
    data() {
        return {
            userImg: require('../../assets/images/user.png'),

            showSetting: false,
            icon:"el-icon-d-arrow-right",

            //自动刷新组变量
            countback: '',          // 倒数
            timer: null,            // 定时器
            triggertime: 0,         // 触发时间
            refreshValue: 10,       // 刷新间隔

            // 图表组变量         
            echartsData: {},
            nTotal: 0,
            nPage: 0, 
            nPerPage: 3, 
            nPStatus: 2, 
            nLot: 9,

        }
    },
    methods: {
        onShowSetting() {
            this.showSetting=!this.showSetting
            this.icon = this.showSetting ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right';
        },

        genDefaultAry(ary, index) {
            let rtnAry = [];
                 
            let name = '';
            switch(index) {
                case 1:
                    name = '受注';
                    break;
                case 2:
                    name = '生产';
                    break;
                case 3:
                    name = '贩卖';
                    break;
                default:
                    break;
            } 
            for (let i = 0; i < ary.length; i++){
                let tmp = {
                    NAME: name,
                    M1YYMM: ary[i].M1YYMM,
                    M1KOJO: ary[i].M1KOJO,

                    SJ: ary[i]["SJ"+index],
                    JH: ary[i]["JH"+index],
                    XJH: ary[i]["XJH"+index],
                    DCL: ary[i]["DCL"+index],
                    JBL: ary[i]["JBL"+index],
                } 
                rtnAry.push(tmp);
            }  
            return rtnAry;
        },
        genOverK(val) {
            var value = val;
            if (value >= 1000) {
                value = (value / 1000).toFixed(2) + 'k';
            }else if(value < 1000){
                value = value;
            }
            return value;
        },
        genLegendData(obj) {
            let rtnAry = [];
            let tmp = {
                NAME: "实   绩",
                VALUE: this.genOverK(obj.SJ),
            }; 
            rtnAry.push(tmp);
            tmp = {
                NAME: "月计划",
                VALUE: this.genOverK(obj.JH),
            };
            rtnAry.push(tmp);
            tmp = {
                NAME: "现计划",
                VALUE: this.genOverK(obj.XJH),
            };
            rtnAry.push(tmp);
            tmp = {
                NAME: "进步率",
                VALUE: obj.JBL.toFixed(2)+'%',
            };
            rtnAry.push(tmp);
            tmp = {
                NAME: "达成率",
                VALUE: obj.DCL.toFixed(2)+'%',
            };
            rtnAry.push(tmp);
            return rtnAry;
        },        

        getChartData() {
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
                url: '/api/common/ops', 
                data
            }).then(function (resp) {
                console.log(JSON.stringify(resp));
                if (resp.data.code == 0) {
                    let respData = resp.data.data;
                    let aryData = respData.datalist == null ? [] : respData.datalist;
                    console.log('1111111111111111.1',aryData);

                    let ary = that.genDefaultAry(aryData, 1);
                    let legend = that.genLegendData(ary[2]);
                    console.log('1111111111111111.2',legend);
                    console.log(JSON.stringify(ary));
                    let option = that.genChartOption(ary, legend);
                    echarts.init(that.$refs.chart01).dispose();
                    const myEcharts01 = echarts.init(that.$refs.chart01);
                    myEcharts01.setOption(option);

                    ary = that.genDefaultAry(aryData, 2);
                    legend = that.genLegendData(ary[2]);
                    option = that.genChartOption(ary, legend);
                    echarts.init(that.$refs.chart02).dispose();
                    const myEcharts02 = echarts.init(that.$refs.chart02);
                    myEcharts02.setOption(option);

                    ary = that.genDefaultAry(aryData, 3);
                    legend = that.genLegendData(ary[2]);
                    console.log('8888888888888.2', ary);
                    option = that.genChartOption(ary, legend);
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
        genChartOption(aryData, legendData) {
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
                        color:"#FFFFFF",
                        rich: {
                            name: {
                                verticalAlign: 'middle',
                                align: 'left',
                                width: 60,
                                fontSize: 12,
                                color: '#FFFFFF',
                                
                            },
                            value: {
                                verticalAlign: 'middle',
                                align: 'left',
                                width: 50,
                                fontSize: 18,
                                //fontWeight: 700,
                                color: '#FFFFFF'
                            },
                        },
                    },
                    data: legendData.map((item) => item.NAME),
                    formatter: function (params) {
                        //let item = legendData[params.dataIndex];
                        //return params.VALUE
                        let Value = '';
                        for(let i = 0; i < legendData.length; i++){
                            if (params === legendData[i].NAME){
                                Value = legendData[i].VALUE;
                                break;
                            }
                        }
                        return ('{name|' + params + '}' +'{value|' + Value + '}');
                    }
                },
                grid: {
                    left: "5%",
                    right: "20%",
                    bottom: "10%",
                    containLabel: true, //是否包含坐标轴的文字
                },
                //提示框
                tooltip: {
                    trigger: "axis",
                    transitionDuration:0,
                },
                title:{
                    text: aryData[0].NAME,
                    textStyle:{
                        color: '#FFFFFF',
                        fontSize: 28,
                    },
                },                    
                xAxis: {
                    type: "category",
                    name: '厂别',
                    data: aryData.map((item) => item.M1KOJO),
                    axisLabel: {
                        color: '#FFFFFF',
                        fontSize : 18,
                        padding: [5, 0, 0, 0]
                    },                            
                }, 
                yAxis:[
                    {
                        type: "value",//类目轴
                        name: "金额",
                        axisLine: {
                            lineStyle: {
                                color: '#FFFFFF',//"#551A8B",//"#17b3a3"
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            formatter: function(value, index) {
                                var value;
                                if (value >=1000) {
                                    value = value/1000+'k';
                                }else if(value <1000){
                                    value = value;
                                }
                                return value;
                            }
                        }  
                    },
                    {
                        type: 'value',
                        name: '百分比',
                        axisLine: {
                            lineStyle: {
                                color: '#FF7DFF',//"#551A8B",//"#17b3a3"
                            }
                        },
                        axisLabel: {
                            formatter: function(value, index) {
                                return value + '%';
                            }
                        },  
                        //offset: 50, //坐标轴移动50
                        position: 'right',
                        alignTicks: true,
                        axisTick: {
                            inside: 'false',
                            length: 10,
                        }                            
                    }                       
                ],
                color: ['#9B30FF', '#00CDCD', '#668B8B', '#FF7F00', '#EE3A8C'],
                series: [
                    {
                        name: "实   绩",
                        data: aryData.map((item) => item.SJ),
                        type: 'bar',
                        barGap : 0,
                        //barCategoryGap:50,
                        //stack: 'stack',
                        yAxisIndex:0,
                        // 柱子渐进色+背景透明
                        itemStyle:{
                            color:'#EE3A8C',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        var value;
                                        if (item.SJ >=1000) {
                                            value = Math.ceil(item.SJ/1000)+'k';
                                        }else if(item.SJ <1000){
                                            value = item.SJ;
                                        }  
                                        return '实绩\r\n' + value;
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
                        name: "月计划",
                        data: aryData.map((item) => item.JH),
                        type: 'bar',
                        //stack: 'stack',  
                        yAxisIndex:0,       
                        itemStyle:{
                            color:'#00CDCD',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        var value;
                                        if (item.JH >=1000) {
                                            value = Math.ceil(item.JH/1000)+'k';
                                        }else if(item.JH <1000){
                                            value = item.JH;
                                        }  
                                        return '月计划\r\n' + value;
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
                        name: "现计划",
                        data: aryData.map((item) => item.XJH),
                        type: 'bar',
                        //stack: 'stack',  
                        yAxisIndex:0,       
                        itemStyle:{
                            color:'#00CDCD',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        var value;
                                        if (item.XJH >=1000) {
                                            value = Math.ceil(item.XJH/1000)+'k';
                                        }else if(item.XJH <1000){
                                            value = item.XJH;
                                        }  
                                        return '现计划\r\n' + value;
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
                        name: "进步率",
                        data: aryData.map((item) => item.JBL),
                        type: 'bar',
                        //stack: 'stack',  
                        yAxisIndex:1,       
                        itemStyle:{
                            color:'#00CDCD',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        return ('进步率\r\n' + item.JBL + '%');
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
                        name: "达成率",
                        data: aryData.map((item) => item.DCL),
                        type: 'bar',
                        //stack: 'stack',  
                        yAxisIndex:1,       
                        itemStyle:{
                            color:'#00CDCD',
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    formatter: function (params) {
                                        let item = aryData[params.dataIndex];
                                        return ('达成率\r\n' + item.DCL + '%');
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
        document.title = 'OPS';
    },
    mounted() {
        this.getChartData();
        this.timer = setInterval(()=>{
            let hh = new Date().getHours();
            let mm = new Date().getMinutes();
            let ss = new Date().getSeconds();
            let n = this.refreshValue;
            if (mm == this.triggertime) {
                console.log('111', mm, ss, this.triggertime);
                this.getChartData();
            }
            
            let countback = this.triggertime * 60 - (mm * 60 + ss);
            if (countback > 0) 
                this.countback = Math.floor(countback/60).toString().padStart(2, '0')+':'+(countback % 60).toString().padStart(2, '0'); 
            console.log('222', mm, ss, n, this.triggertime, this.countback);
            this.triggertime = (Math.floor(mm/n) + 1) * n;
        }, 1000);

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