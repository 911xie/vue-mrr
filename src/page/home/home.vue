<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top:20px">
            <el-card shadow="hover">
                <div class="user">
                    <img :src="userImg"/>
                    <div class="userinfo">
                        <p class="name">Admin</p>
                        <p class="access">超级管理员</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>上次登录时间<span>2022-05-17</span></p>
                    <p>上次登录地点<span>珠海</span></p>
                </div>
            </el-card>
            <el-card style="margin-top:20px;height=460px">
                <el-table :data="tableData">
                    <el-table-column v-for="(val, key) in tableLabel"
                    :key="key" :prop="key" :label="val">
                    </el-table-column>
                </el-table>
            </el-card>



        </el-col>
        <el-col style="margin-top:20px" :span="16" >
            <div class="num">
                <el-card v-for="item in countData" :key="item.name" :body-style="{display:'flex',padding:0}">
                    <i class="icon" :class="`el-icon-${item.icon}`" :style="{background:item.color}"></i>
                    <div class="detail">
                        <p class="num">￥{{item.value}}</p>
                        <p class="txt">{{item.name}}</p>
                    </div>
                </el-card>
            </div>


            <!-- 折线图 -->
            <el-card shadow="hover" style="height: 280px">
                <div ref="echarts" style="height: 280px"></div>
            </el-card>
            <div class="graph">
                <!-- 柱状图 -->
                <el-card shadow="hover" style="height: 260px">
                    <div style="height: 240px" ref="userEcharts"></div>
                </el-card>
                <!-- 饼状图 -->
                <el-card shadow="hover" style="height: 260px">
                    <div style="height: 240px" ref="videoEcharts"></div>                   
                </el-card>
            </div>
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
                        trigger: 'axis'
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
                    color: ['#2ec7c9', '#6ba2de'],
                    series: []
        
                },
                //饼状图
                video:{
                    tooltip:{
                        trigger:"item",
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
                }           
            }, 
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
        
                const myEchartsOrder = echarts.init(this.$refs.echarts)
                myEchartsOrder.setOption(this.echartsData.order)
                //用户柱状图数据
                this.echartsData.user.xAxis.data = data.userData.map((item) => item.date)
                this.echartsData.user.series.push({
                    "name": "新增用户",
                    "data": data.userData.map((item) => item.new),
                    //柱状图
                    "type": 'bar',
                });
        
                this.echartsData.user.series.push({
                    "name": "活跃用户",
                    "data": data.userData.map((item) => item.active),
                    //柱状图
                    "type": 'bar',
                });
                const myEchartsUser = echarts.init(this.$refs.userEcharts)
                myEchartsUser.setOption(this.echartsData.user)

                //视频饼图数据
                this.echartsData.video.series.push(
                    {
                        data:data.videoData,
                        type:'pie',
                    }
                )
                const myEchartsVideo = echarts.init(this.$refs.videoEcharts)
                myEchartsVideo.setOption(this.echartsData.video);
            }
            console.log(res)
        })
    }

}
</script>