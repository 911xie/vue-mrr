<template>
    <div class="bgcolor" style="display:flex;justify-content:center;align-items:top;">
        <div style="width:80%;">
            <el-row class="home" :gutter="20" style="overflow:hidden;">
                <el-col style="margin-top:0px;overflow:hidden;width:100%" :span="16" >
                    <el-row class="home" :gutter="20" style="overflow:hidden;">
                        <el-col style="margin-top:10px;overflow:hidden;width:6%;" :span="16" >
                            <el-button :icon="icon" @click="onShowSetting()" style="border:none;background:rgba(55,255,255,0.02)"></el-button>
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
                                    <el-col style="overflow:hidden;width:6%;" >
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
                                        <!-- <i class="el-icon-s-flag" style="color: blue"></i> -->
                                    </el-col>  
                                    <el-col style="overflow:hidden;width:6%;">
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
                        <el-card class="bgcolor elcard" shadow="hover" style="height:360px;overflow:hidden;width:49.3%;">
                            <div ref="echarts" style="height:360px"></div>
                        </el-card>
                        <el-card class="bgcolor elcard" shadow="hover" style="height:360px;overflow:hidden;width:49.3%;">
                            <div class="pie3dchart bgcolor" ref="pie3dChart" style="height:360px"></div>
                        </el-card>  
                    </div>
                    <div class="graph">
                        <el-card class="bgcolor elcard" shadow="hover" style="height:260px;overflow:hidden;width:49.3%;">
                            <div ref="factorychart" style="height:260px"></div>
                        </el-card>                            
                        <!-- 饼状图 -->
                        <el-card class="bgcolor elcard" shadow="hover" style="height:260px;overflow:hidden;width:49.3%;">
                            <div style="height: 260px" ref="pieChartFactory"></div>                   
                        </el-card>  
                    </div>        
                    <div class="graph">
                        <el-card class="bgcolor elcard" shadow="hover" style="height:240px;overflow:hidden;width:49.3%;">
                            <div style="height: 240px" ref="pieEcharts"></div>                   
                        </el-card>                                          
                        <!-- 柱状图 -->
                        <el-card class="bgcolor elcard" shadow="hover" style="height:240px;overflow:hidden;" v-show=false>
                            <div style="height: 240px" ref="ngEcharts"></div>
                        </el-card>
                        <el-card class="bgcolor elcard" shadow="hover" style="height:240px;overflow:hidden;width:49.3%;">
                            <div ref="histogramLine" style="height:240px"></div>
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
            refreshValue: 10,       // 刷新间隔
            refreshOpt:[
                {
                    value: 1,
                    label: '1分钟',
                },                
                {
                    value: 5,
                    label: '5分钟',
                },                
                {
                    value: 10,
                    label: '10分钟',
                },                
                {
                    value: 20,
                    label: '20分钟',
                },                
                {
                    value: 30,
                    label: '30分钟',
                },                
            ],      
            // 日期范围组变量        
            dateRange:[],
            inventoryValue: 'out',
            inventoryOpt:[
                {
                    value: 'in',
                    label: '入库',
                },                
                {
                    value: 'out',
                    label: '出库',
                },                
            ],   
            // 图表组变量         
            echartsData: {
                order: {
                    legend: {
                        //图例文字颜色
                        textStyle:{
                            color:"#fff"
                        } ,
                    },
                    grid: {
                        left: "10%"
                    },
                    //提示框
                    tooltip: {
                        trigger: "axis",
                        transitionDuration:0,
                    },
                    title:{
                        text:"总览",
                        textStyle:{
                            color: "#fff"
                        }                            
                    },                    
                    xAxis: {
                        type: "category",//类目轴
                        data: [],
                        axisLine: {
                            lineStyle: {
                                //color: "#551A8B",//"#17b3a3"
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            //color: "#551A8B",//"#333",
                        }
                    },
                    yAxis: [
                        {
                            type: "value",
                            name: '数量',
                            // axisLine: {
                            //     lineStyle: {
                            //         color: "#551A8B"//"#17b3a3",
                            //     }
                            // },
                            position: 'left',
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
                        {
                            //boundaryGap: [0, '100%'],
                            type: 'value',
                            name: '金额',
                            axisLine: {
                                lineStyle: {
                                    color: '#FF7DFF',//"#551A8B",//"#17b3a3"
                                }
                            },
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
                            //offset: 50, //坐标轴移动50
                            position: 'right',
                            alignTicks: true,
                            axisTick: {
                                inside: 'false',
                                length: 10,
                            }                            
                        }                        
                    ],
                    color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
                    series: []
                },

                factory: {
                    legend: {
                        //图例文字颜色
                        textStyle:{
                            color:"#fff"
                        } ,
                    },
                    grid: {
                        left: "10%"
                    },
                    //提示框
                    tooltip: {
                        trigger: "axis",
                        transitionDuration:0,
                    },
                    title:{
                        text:"两厂出库",
                        textStyle:{
                            color: "#fff"
                        }                            
                    },                    
                    xAxis: {
                        type: "category",//类目轴
                        data: [],
                        axisLine: {
                            lineStyle: {
                                //color: "#551A8B",//"#17b3a3"
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            //color: "#551A8B",//"#333",
                        }
                    },
                    yAxis: [
                        {
                            type: "value",
                            name: '数量',
                            position: 'left',
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
                    ],
                    color: ['#d87a80', '#8d98b3'],
                    series: []
                },                
                // 不良数柱状图
                ngChart: {
                    legend: {
                        //图例文字颜色
                        textStyle: {
                            color: "#fff"
                        },
                    },
                    grid: {
                        left: "20%",
                    },
                    //提示框
                    tooltip: {
                        trigger: 'axis',
                        transitionDuration:0,
                    },
                    title:{
                        text:"不良数",
                        textStyle:{
                            color: "#fff"
                        }
                    },                    
                    xAxis: {
                        type: "category",//类目轴
                        data: [],
                        axisLine: {
                            lineStyle: {
                                //color: "#551A8B",//"#17b3a3"
                            }
                        },
                        axisLabel: {
                            // interval: 0,
                            //color: "#551A8B"
                        }
                    },
                    yAxis: [
                        {
                            type: "value",
                            axisLine: {
                                lineStyle: {
                                    //color: "#551A8B",//"#17b3a3"
                                }
                            },
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
                        }
            
                    ],
                    color: ['#2ec7c9', '#6ba2de', '#f67f12'],
                    series: []
                },
                //饼状图
                pie:{
                    title:{
                        text:"良率",
                        textStyle:{
                            color: "#fff"
                        }                        
                    },
                    tooltip:{
                        trigger:"item",
                        transitionDuration:0,
                    },         
                    color:[
                        "#0f78f4",
                        "#dd536b",
                        "#9462e5",
                        "#a6a6a6",
                        "#e1bb22",
                        "#39c362",
                        "#3ed1cf"
                    ],

                    series:[]
                },
                //两厂饼状图
                piefactory:{
                    title:{
                        text:"两厂比例",
                        textStyle:{
                            color: "#fff"
                        }                        
                    },
                    tooltip:{
                        trigger:"item",
                        transitionDuration:0,
                    },         
                    color:[
                        "#0f78f4",
                        "#dd536b",
                        "#9462e5",
                        "#a6a6a6",
                        "#e1bb22",
                        "#39c362",
                        "#3ed1cf"
                    ],
                    series:[]
                },                
                
                histogramLine: {
                    //表头
                    title: {
                        text: "ECharts 入门示例",
                        textStyle:{
                            color: "#fff"
                        }
                    },
                    tooltip: {
                        transitionDuration:0,
                    }, //提示
                    legend: {
                        //图例
                        data: ["良数","金额"], //对应series每一项中的name
                        //图例文字颜色
                        textStyle:{
                            color:"#fff"
                        } ,
                    },
                    xAxis: {
                        //x轴显示内容
                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {
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
                    }, //y轴默认
                    series: [
                        //数据1  柱形
                        {
                            name: "销量",
                            type: "bar", //类型  柱形
                            data: [5, 20, 36, 10, 10, 20] //柱形的点
                        },
                        //数据2  折线
                        {
                            name: "折线",
                            type: "line", //类型 折线
                            smooth: true, //是否是弯曲的折现  弯弯曲曲
                            data: [75, 20, 36, 10, 10, 3] //折线的点
                        }
                    ]
                },
            },

            optionData: [
				{
					name: 'B社',
					value: 138
				},
				{
					name: 'A社',
					value: 288
				},
				{
					name: 'C社',
					value: 388
				},
				{
					name: 'D社',
					value: 218
				},
				{
					name: 'E社',
					value: 218
				},
				{
					name: 'F社',
					value: 218
				},
			],
			statusChart:null,
			option:{}
        }
    },
    methods: {
        onShowSetting() {
            this.showSetting=!this.showSetting
            this.icon = this.showSetting ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right';
        },
        getChartData() {
            let beginDate = this.dateRange[0].format('YYYYMMDD');
            let endDate = this.dateRange[1].format('YYYYMMDD');
            let that = this;
            let data = {"stat":this.inventoryValue, "begin":beginDate,"end":endDate};

            this.$axios({
                method: 'post', 
                url: '/api/common/inventory', 
                data
            }).then(function (resp) {
                console.log(JSON.stringify(resp));
                if (resp.data.code == 0) {
                    let chartData = resp.data.data.barData;
                    let pieData = resp.data.data.pieData;
                    let todayData = resp.data.data.todayData;
                    let userData = resp.data.data.userData;
                    let factoryData = resp.data.data.factoryData;

                    that.incount = parseFloat(todayData[0].GOODPARTS/1000).toFixed(0)+'K';
                    that.outcount = parseFloat(todayData[1].GOODPARTS/1000).toFixed(0)+'K';
                    that.inamount = parseFloat(todayData[0].AMOUNT/1000).toFixed(2)+'K';
                    that.outamount = parseFloat(todayData[1].AMOUNT/1000).toFixed(2)+'K';

                   
                    // 堆叠图
                    that.refreshStack(chartData);

                    // 客户别出厂金额饼图
                    that.refreshPie3DChart(userData);

                    // 厂别出厂柱图
                    that.refreshBarFactoryChart(factoryData);

                    // 厂别出厂饼图
                    let datas = [
                        {name: '南屏', value: factoryData.TOTAL01},
                        {name: '龙山', value: factoryData.TOTAL03},
                    ];
                    that.refreshPieFactoryChart(datas);    

                    // 良品不良品饼图
                    datas = [
                        {name: '良品',      value: parseInt(pieData[0].GOODPARTS)},
                        {name: '不良品',    value: parseInt(pieData[0].DEFECTIVE)},
                    ];
                    that.refreshPieOKNGChart(datas);   
                    
                    // 不良品柱图
                    that.refreshNGBar(chartData);

                    // 出库金额
                    that.refreshOutMoney(chartData);
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
        // 堆叠图
        refreshStack(chartData){
            // 总览图
            this.echartsData.order.xAxis.data = chartData.map((item) => item.DATE.substring(6));
            this.echartsData.order.series = [];
            this.echartsData.order.color = ['#f67f12', '#ff7dff','#551A8B'];
            //if (that.inventoryValue == 'out'){
            this.echartsData.order.series.push({
                name: "良数",
                data: chartData.map((item) => item.GOODPARTS),
                type: 'bar',
                stack: 'stack',
                yAxisIndex:0,
                // 柱子渐进色+背景透明
                itemStyle:{
                    color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2ec7c9'//'#248ff7'
                        }, 
                        {
                            offset: 1,
                            color: 'rgba(22,75,247,0.1)'
                        }
                    ]),
                }
            })
            this.echartsData.order.series.push({
                "name": "不良数",
                "data": chartData.map((item) => item.DEFECTIVE),
                "type": 'bar',
                stack: 'stack',  
                yAxisIndex:0,                 
            });
            this.echartsData.order.series.push({
                "name": "金额",
                "data": chartData.map((item) => item.AMOUNT),
                "type": 'line',
                yAxisIndex:1,
            });

            echarts.init(this.$refs.echarts).dispose();
            const myEchartsOrder = echarts.init(this.$refs.echarts);
            myEchartsOrder.setOption(this.echartsData.order);
        },
        // 不良柱图
        refreshNGBar(chartData){
            // 不良数柱状图数据
            this.echartsData.ngChart.xAxis.data = chartData.map((item) => item.DATE.substring(6));//data.userData.map((item) => item.date);
            this.echartsData.ngChart.series = [];
            this.echartsData.ngChart.color = ['#f67f12'];
            this.echartsData.ngChart.series.push({
                "name": "不良数",
                "data": chartData.map((item) => item.DEFECTIVE),//data.userData.map((item) => item.active),
                //柱状图
                "type": 'bar',
                // 柱子渐进色+背景透明
                itemStyle:{
                    color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#f67f12'//'#248ff7'
                        }, 
                        {
                            offset: 1,
                            color: 'rgba(165, 75, 147, 0.2)'
                        }
                    ]),
                }                        
            });

            echarts.init(this.$refs.ngEcharts).dispose();
            const myEchartsUser = echarts.init(this.$refs.ngEcharts);
            myEchartsUser.setOption(this.echartsData.ngChart);
        },
        // 出库金额
        refreshOutMoney(chartData){
            // 柱状+折线
            this.echartsData.histogramLine.xAxis.data = chartData.map((item) => item.DATE.substring(6));
            this.echartsData.histogramLine.title.text = "出库金额";
            this.echartsData.histogramLine.legend.data = ["良数","金额"] //对应series每一项中的name
            this.echartsData.histogramLine.series = [];
            this.echartsData.histogramLine.series.push({
                name: "金额",
                data: chartData.map((item) => item.AMOUNT),//data.userData.map((item) => item.active),
                //折线图
                type: 'line',
                smooth: true,
                "itemStyle": {
                        //折线样式
                        /*设置折线颜色*/
                    normal: {
                        //color: "#ff7dff";
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 1,
                                color: 'rgba(255, 125, 255, 0.5)'
                            }, 
                            {
                                offset: 1,
                                color: 'rgba(255, 125, 255, 0.53)'
                            }]
                        )
                    }
                },
                areaStyle: {
                    normal: {
                        //背景渐变色 
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(255, 125, 255, 0.5)'
                            }, 
                            {
                                offset: 1,
                                color: 'rgba(255, 125, 255, 0.9)'
                            }
                        ]),                        
                    },
                },
            });     
            echarts.init(this.$refs.histogramLine).dispose();                           
            const myechartsTwo = echarts.init(this.$refs.histogramLine);
            myechartsTwo.setOption(this.echartsData.histogramLine);
        },
        // PieOK-NG图表刷新
        refreshPieOKNGChart(datas){
            
            // 良率饼图数据
            this.echartsData.pie.series = [];
            this.echartsData.pie.legend = {
                left: 'left',
                y: 'bottom',
                padding:[0,0,40,0],
                orient: 'vertical',
                textStyle: {
                    rich: {
                        name: {
                            verticalAlign: 'right',
                            align: 'left',
                            width: 35,
                            fontSize: 12,
                            color: '#fff'
                        },
                        value: {
                            align: 'left',
                            width: 42,
                            fontSize: 12,
                            color: '#fff'
                        },
                        count: {
                            align: 'left',
                            width: 42,
                            fontSize: 12,
                            color: '#fff'
                        }
                    },
                    color: '#54bef9'
                },
                data:datas.map((item) => item.name),
                formatter: function (name) {
                    var total = 0;
                    var tarValue;
                    for (var i = 0; i < datas.length; i++) {
                        total += datas[i].value;
                        if (name === datas[i].name) {
                            tarValue = datas[i].value;
                        }
                    }
                    let value = (tarValue / 1000).toFixed(2)+'K';
                    let rate = ((tarValue / total) * 100).toFixed(2);
                    
                    var p = Math.round((tarValue / total) * 100);
                    return ('{name|' + name + '} ' +'{value|' + rate + '%} ');
                }
            }
            this.echartsData.pie.series.push({
                data: [
                    {
                        name:"良品",
                        value: datas[0].value,//pieData[0].GOODPARTS,
                        itemStyle: {
                            normal: {//颜色渐变
                                // color: new echarts.graphic.LinearGradient(
                                //     0, 0, 0, 1,
                                //     [
                                //         {offset: 0, color: '#2ec7c9'},
                                //         {offset: 0.5, color: '#63B8FF'},
                                //         {offset: 1, color: '#9B30FF'}
                                //     ]
                                // )
                                //  径向渐变方式二 ======================================================
                                // x 0.5 y 0.5 代表圆心，r 代表半径
                                color: {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(82,216,60, 0.7)' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(82,216,60, 0.05)' // 100% 处的颜色
                                        }
                                    ],
                                    global: false // 缺省为 false
                                }
                            }
                        }                                    
                    },
                    {
                        name:"不良品",
                        value: datas[1].value,//pieData[0].DEFECTIVE,
                        itemStyle: {
                            normal: {//颜色渐变
                                color: '#f67f12'
                            }
                        }                                     
                    }                  
                ],
                type: 'pie',
                radius: ['0%', '80%'],
                startAngle: 325,//起始角度 不设置该值默认为：90
                label: {
                    normal: {
                        // formatter: params => {
                        //     return (
                        //         '{icon|●}{name|' + params.name + '}{value|' + params.value + '%}'
                        //     );
                        // },
                        // //padding: [0 , -100, 25, -100],
                        // rich: {
                        //     icon: {
                        //         fontSize: 16,
                        //         color:"#f0cc8f"
                        //     },
                        //     name: {
                        //         fontSize: 14,
                        //         padding: [0, 10, 0, 4],
                        //         color: '#cccccc'
                        //     },
                        //     value: {
                        //         fontSize: 18,
                        //         fontWeight: 'bold',
                        //         color: '#B03060'
                        //     }
                        // }
                        formatter: function(params) {
                            let total = 0;
                            for (let i = 0; i < datas.length; i++) {
                                total += datas[i].value;
                            }
                            let value = (params.value / 1000).toFixed(2)+'K';
                            let rate = ((params.value / total) * 100).toFixed(2);
                            return ('{name|' + params.name + '}\n{rate|'+ rate + '%}\n{value|' + value+'}');
                        },
                        rich: {
                            name: {
                                fontSize: 14,
                                color: '#cccccc',
                                lineHeight: 25,
                                align: 'left'
                            },
                            rate: {
                                fontSize: 18,
                                color: '#fff',
                                textShadowColor: '#1c90a6',
                                textShadowOffsetX: 0,
                                textShadowOffsetY: 2,
                                textShadowBlur: 5,      
                                align: 'left'
                            },
                            value :{
                                fontSize: 14,
                                color: '#cccccc',
                                lineHeight: 25,
                                align: 'left'                                        
                            }
                        }                        
                    }
                }, 
            })

            echarts.init(this.$refs.pieEcharts).dispose();
            const myEchartsPie = echarts.init(this.$refs.pieEcharts);
            myEchartsPie.setOption(this.echartsData.pie);
        },  
        // Bar厂别柱图刷新
        refreshBarFactoryChart(factoryData) {
            // 两厂柱图
            this.echartsData.factory.xAxis.data = factoryData.Z01.map((item) => item.DATE.substring(6));
            this.echartsData.factory.series = [];
            this.echartsData.factory.series.push({
                name: "南屏",
                data: factoryData.Z01.map((item) => item.QTY),
                type: 'bar',
                stack: 'stack',
                yAxisIndex:0,
                // 柱子渐进色+背景透明
                itemStyle:{
                    color:'#EE3A8C'
                }
            })
            this.echartsData.factory.series.push({
                name: "龙山",
                data: factoryData.Z03.map((item) => item.QTY),
                type: 'bar',
                stack: 'stack',  
                yAxisIndex:0,       
                itemStyle:{
                    color:'#00CDCD'
                }                                  
            });

            echarts.init(this.$refs.factorychart).dispose();
            const myEchartsfactory = echarts.init(this.$refs.factorychart);
            myEchartsfactory.setOption(this.echartsData.factory);
        },      
        // Pie厂别饼图刷新
        refreshPieFactoryChart(datas) {
            // 两厂pie图
            this.echartsData.piefactory.series = [];
            this.echartsData.piefactory.legend = {
                right: 'right',
                top:'top',
                y: 'center',
                orient: 'vertical',
                textStyle: {
                    rich: {
                        name: {
                            verticalAlign: 'right',
                            align: 'left',
                            width: 25,
                            fontSize: 12,
                            color: '#fff'
                        },
                        rate: {
                            align: 'left',
                            width: 42,
                            fontSize: 12,
                            color: '#fff'
                        },
                        count: {
                            align: 'left',
                            width: 42,
                            fontSize: 12,
                            color: '#fff'
                        }
                    },
                    color: '#54bef9'
                },
                data:datas.map((item) => item.name),
                formatter: function (name) {
                    var total = 0;
                    var tarValue;
                    for (var i = 0; i < datas.length; i++) {
                        total += datas[i].value;
                        if (name === datas[i].name) {
                            tarValue = datas[i].value;
                        }
                    }
                    let value = (tarValue / 1000).toFixed(2)+'K';
                    let rate = ((tarValue / total) * 100).toFixed(2);
                    
                    var p = Math.round((tarValue / total) * 100);
                    return ('{name|' + name + '} ' +'{rate|' + rate + '%} ' + '{count|' + value +'}');
                }
            }
            
            this.echartsData.piefactory.series.push({
                data: [
                    {
                        name:'龙山',
                        value: datas[1].value,
                        itemStyle: {
                            normal: {//颜色渐变
                                // color: '#EE3A8C'
                                // RadialGradient前三个分参数别代表圆心（x,y），半径（数值0-1）
                                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
                                    {
                                        offset: 0,
                                        color: 'rgba(0,205,205,1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(0,205,205,0.05)'
                                    }
                                ])
                            }
                        }                                  
                    },
                    {
                        name:'南屏',
                        value: datas[0].value,
                        itemStyle: {
                            normal: {//颜色渐变
                                color: '#00CDCD',
                                // RadialGradient前三个分参数别代表圆心（x,y），半径（数值0-1）
                                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
                                    {
                                        offset: 0,
                                        color: 'rgba(238,58,140,1)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(238,58,140,0.05)'
                                    }
                                ])                                        
                            }
                        }                                
                    }                            
                ],
                type: 'pie',
                radius: ['30%', '80%'],
                startAngle: 135,//起始角度 不设置该值默认为：90
                //roseType: 'radius',//玫瑰饼图
                label: {
                    normal: {
                        formatter: function(params) {
                            let total = 0;
                            for (let i = 0; i < datas.length; i++) {
                                total += datas[i].value;
                            }
                            let value = (params.value / 1000).toFixed(2)+'K';
                            let rate = ((params.value / total) * 100).toFixed(2);
                            return ('{name|' + params.name + '}\n{value|' + value +'}\n{rate|'+ rate + '%}');
                        },
                        rich: {
                            name: {
                                fontSize: 14,
                                color: '#cccccc',
                                lineHeight: 25,
                                align: 'left'
                            },
                            value: {
                                fontSize: 18,
                                color: '#fff',
                                textShadowColor: '#1c90a6',
                                textShadowOffsetX: 0,
                                textShadowOffsetY: 2,
                                textShadowBlur: 5,      
                                align: 'left'
                            },
                            rate :{
                                fontSize: 14,
                                color: '#cccccc',
                                lineHeight: 25,
                                align: 'left'                                        
                            }
                        }
                    }
                }, 
            })

            echarts.init(this.$refs.pieChartFactory).dispose();
            const myEchartsPieFactory = echarts.init(this.$refs.pieChartFactory);
            myEchartsPieFactory.setOption(this.echartsData.piefactory); 
        },
        // Pie3D图表初始化
		setPie3DLabel(data) {
            let tmp =JSON.parse(JSON.stringify(this.optionData)); 
            this.optionData = [];

            let total = 7;
            let nCount = 1;
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                let obj = data[i];
                if (nCount < total) {
                    let item = 	{
                        name: obj.USERNAME,
                        value: parseInt((obj.AMOUNT/1000) * 100) / 100
                    };
                    this.optionData.push(item);                    
                }
                else {
                    sum += (obj.AMOUNT - 0);
                }
                nCount++;
            }
            let item = 	{
                name: '其他',
                value: parseInt(sum/1000 * 100) / 100,
            };
            this.optionData.push(item);

			this.optionData.forEach((item, index) => {
				item.itemStyle = {
					color: color[index]
				}
				item.label = {
					normal: {
						show: true,
						color: color[index],
						formatter: [
							'{b|{b}}',
							'{c|{c}}{b|K}',
							'{d|{d}%}'
						].join('\n'), // 用\n来换行
						rich: {
							b: {
								color: '#fff',
								lineHeight: 25,
								align: 'left'
							},
							c: {
								fontSize: 18,
								color: '#fff',
								textShadowColor: '#1c90a6',
								textShadowOffsetX: 0,
								textShadowOffsetY: 2,
								textShadowBlur: 5
							},
							d: {
								//color: color[index],
                                color: color[index],
								align: 'left'
							}
						}
					}
				}
				item.labelLine = {
					normal: {
						lineStyle: {
							width: 1,
							color: 'rgba(255,255,255,0.7)'
						}
					}
				}
			})
		},
		// Pie3D图表刷新
		refreshPie3DChart(data) {
            this.setPie3DLabel(data);
            this.$echarts.init(this.$refs.pie3dChart).dispose();  
			this.statusChart = this.$echarts.init(this.$refs.pie3dChart)
			// 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
			this.option = getPie3D(this.optionData, 0.8, 240, 28, 26, 0.5)
			this.statusChart.setOption(this.option)
			// 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
			this.option.series.push({
				name: '电梯状态', //自己根据场景修改
				backgroundColor: 'transparent',
				type: 'pie',
				label: {
					opacity: 1,
					fontSize: 13,
					lineHeight: 20
				},
				startAngle: -40, // 起始角度，支持范围[0, 360]。
				clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
				radius: ['20%', '50%'],
				center: ['50%', '50%'],
				data: this.optionData,
				itemStyle: {
					opacity: 0  //这里必须是0，不然2d的图会覆盖在表面
				}
			})
			this.statusChart.setOption(this.option)
		},
		// 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
		// optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton

		// 自适应宽高
		changeSize () {
			this.statusChart.resize()
		}        
    },
    created() {
        document.title = 'AS400 KANBAN';
    },
    mounted() {
        //this.dateRange.push(this.$moment().startOf('month'));
        this.dateRange.push(this.$moment().add(-1,'month'));
        this.dateRange.push(this.$moment());
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