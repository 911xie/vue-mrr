<template>
    <el-row class="home" :gutter="20" style="overflow:hidden;">
        <el-col style="margin-top:20px;overflow:hidden;" :span="16" >
            <!-- 折线图 -->
            <el-card shadow="hover" style="height:280px;overflow:hidden;width:100%">
                <div ref="echarts" style="height: 280px"></div>
            </el-card>
            <div class="graph">
                <!-- 柱状图 -->
                <el-card shadow="hover" style="height:260px;overflow:hidden;">
                    <div style="height: 240px" ref="userEcharts"></div>
                </el-card>
                <!-- 饼状图 -->
                <el-card shadow="hover" style="height:260px;overflow:hidden;">
                    <div style="height: 240px" ref="videoEcharts"></div>                   
                </el-card>
            </div>
            <!-- 柱+折线图 -->
            <el-card shadow="hover" style="height:280px;overflow:hidden;width:100%">
                <div ref="histogramLine" style="height:280px"></div>
            </el-card>            
        </el-col>
    </el-row>
</template>
<script>
import {getData} from '../../api/data.js'
import * as echarts from 'echarts'

export default {
    name: 'home',
    data() {
        return {
            userImg: require('../../assets/images/user.png'),
            tableData: [],
            tableLabel:{},
            countData: [],
            echartsData: {
                order: {
                    legend: {
                        //图例文字颜色
                        color: "#333",
                    },
                    grid: {
                        left: "20%"
                    },
                    //提示框
                    tooltip: {
                        trigger: "axis",
                        transitionDuration:0,
                    },
                    xAxis: {
                        type: "category",//类目轴
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: "#17b3a3"
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            color: "#333",
                        }
                    },
                    yAxis: [
                        {
                            type: "value",
                            axisLine: {
                                lineStyle: {
                                    color: "#17b3a3"
                                }
                            }
                        }
                    ],
                    color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
                    series: []
                },
                //用户图
                user: {
                    legend: {
                        //图例文字颜色
                        textStyle: {
                        color: "#333"
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
                    xAxis: {
                        type: "category",//类目轴
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: "#17b3a3"
                            }
                        },
                        axisLabel: {
                        // interval: 0,
                        color: "#333"
                        }
                    },
                    yAxis: [
                        {
                            type: "value",
                            axisLine: {
                                lineStyle: {
                                    color: "#17b3a3"
                                }
                            },
                        }
            
                    ],
                    color: ['#2ec7c9', '#6ba2de', '#f67f12'],
                    series: []
        
                },
                //饼状图
                video:{
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
                        text: "ECharts 入门示例"
                    },
                    tooltip: {
                        transitionDuration:0,
                    }, //提示
                    legend: {
                        //图例
                        data: ["销量"] //对应series每一项中的name
                    },
                    xAxis: {
                        //x轴显示内容
                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {}, //y轴默认
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
                            itemStyle: {
                                //折线样式
                                /*设置折线颜色*/
                                normal: {
                                    color: "#c4cddc"
                                }
                            },
                            data: [75, 20, 36, 10, 10, 3] //折线的点
                        }
                    ]
                }                          
            },
            objData:[],
        }
    },
    methods: {
        getTabData() {
            getData().then((res) => {


        
            });
        }
    },
    mounted() {
        this.getTabData();
        console.log("xxx")
        // this.$http.get('/user?ID=12345')
        // .then(function (response) {
        //     console.log(response);
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
        // getMenu().then(res=>{
        //     console.log(res)
        // })
        getData().then(res=>{
            const {code, data} = res.data
            if (code === 20000) {
                this.tableData = data.tableData;
                this.tableLabel = data.tableLabel;
                this.countData = data.countData;

                //折线图数据
                const order = data.orderData;
                console.log('111111111111');
                console.log(order)
                console.log('222222222222');
                this.echartsData.order.xAxis.data = order.date;
                let keyArray = Object.keys(order.data[0]);
                keyArray.forEach((key) => {
                    this.echartsData.order.series.push({
                        name: key,
                        data: order.data.map((item) => item[key]),
                        type: 'line'
                    })
                });
        
                const myEchartsOrder = echarts.init(this.$refs.echarts);
                myEchartsOrder.setOption(this.echartsData.order);



                //视频饼图数据
                this.echartsData.video.series.push(
                    {
                        "data": data.videoData,
                        "type": 'pie',
                    }
                )
                const myEchartsVideo = echarts.init(this.$refs.videoEcharts);
                myEchartsVideo.setOption(this.echartsData.video);

                // 柱状+折线
                const myechartsTwo = echarts.init(this.$refs.histogramLine);
                myechartsTwo.setOption(this.echartsData.histogramLine);
            }
            console.log(res)
        })

        let that = this;
        let data = {};

        this.$axios({
            method: 'post', 
            url: '/api/common/dayreport', 
            data
        }).then(function (resp) {
            //console.log(JSON.stringify(resp));
            if (resp.data.code == 0) {
                let chartData = resp.data.data;
                let currDate = '';
                that.objData = [];
                

                for(let i = 0; i < chartData.length; i++){
                    let obj = chartData[i];
                    console.log(JSON.stringify(obj));
                    let itemData;

                    if (obj.flexname == 'D74 R-Cam KV-S') 
                        itemData = {
                            flex:obj.flexname,
                            total: obj.TOTAL,
                            mpeqty: 2
                        }
                    else if (obj.flexname == 'D73 R-Cam Jasper-Q') 
                        itemData = {
                            flex:obj.flexname,
                            total: obj.TOTAL,
                            mpeqty: 3
                        }
                    else 
                        itemData = {
                            flex:obj.flexname,
                            total: obj.TOTAL,
                            mpeqty: obj.MPEQty
                        };

                    if (currDate == obj.DD){
                        that.objData[that.objData.length-1].chartdata.push(itemData);
                    }
                    else {
                        let aryData = [];
                        aryData.push(itemData)
                        that.objData.push({
                            date: obj.DD,
                            chartdata:aryData
                        })
                    }
                    currDate = obj.DD;

                }
                console.log(JSON.stringify(that.objData));
                //console.log(JSON.stringify(that.objData.map((item) => item.date)));
                //console.log(JSON.stringify(that.objData.map((item) => item.chartdata)));
                
                //用户柱状图数据
                that.echartsData.user.xAxis.data = that.objData.map((item) => item.date);//data.userData.map((item) => item.date);
                that.echartsData.user.series.push({
                    "name": "D49 Dock",
                    "data": that.objData.map((item) => item.chartdata[0].mpeqty),//data.userData.map((item) => item.new),
                    //柱状图
                    "type": 'bar',
                });
        
                that.echartsData.user.series.push({
                    "name": "D74 R-Cam KV-S",
                    "data": that.objData.map((item) => item.chartdata[1].mpeqty),//data.userData.map((item) => item.active),
                    //柱状图
                    "type": 'bar',
                });

                that.echartsData.user.series.push({
                    "name": "D73 R-Cam Jasper-Q",
                    "data": that.objData.map((item) => item.chartdata[2].mpeqty),//data.userData.map((item) => item.active),
                    //柱状图
                    "type": 'bar',
                });

                
                const myEchartsUser = echarts.init(that.$refs.userEcharts);
                myEchartsUser.setOption(that.echartsData.user)
            }
            else {
                that.$alert(resp.data.msg, '提示', {
                    type:'error',
                    confirmButtonText: '确定',
                    callback: action => {}
                });					
            }
        });

        // getData().then(res=>{
        //     const {code, data} = res.data
        //     //用户柱状图数据
        //     this.echartsData.user.xAxis.data = data.userData.map((item) => item.date);
        //     this.echartsData.user.series.push({
        //         "name": "新增用户",
        //         "data": data.userData.map((item) => item.new),
        //         //柱状图
        //         "type": 'bar',
        //     });
    
        //     this.echartsData.user.series.push({
        //         "name": "活跃用户",
        //         "data": data.userData.map((item) => item.active),
        //         //柱状图
        //         "type": 'bar',
        //     });
        //     const myEchartsUser = echarts.init(this.$refs.userEcharts);
        //     myEchartsUser.setOption(this.echartsData.user)
        //     console.log(res)
        // })
    }

}
</script>