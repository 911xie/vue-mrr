<template>
    <el-row class="home" :gutter="20" style="overflow:hidden;">
        <el-col style="margin-top:20px;overflow:hidden;" :span="16" >
            <!-- 折线图 -->
            <el-card shadow="hover" style="height:380px;overflow:hidden;width:100%">
                <div ref="echarts" style="height: 380px"></div>
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
                chart3D: {
                    tooltip: {},
                    visualMap: {
                        max: 20,
                        inRange: {
                            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        }
                    },
                    xAxis3D: {
                        type: 'category',
                        data: []
                    },
                    yAxis3D: {
                        type: 'category',
                        data: []
                    },
                    zAxis3D: {
                        type: 'value'
                    },
                    grid3D: {
                        boxWidth: 200,
                        boxDepth: 80,
                        light: {
                            main: {
                                intensity: 1.2
                            },
                            ambient: {
                                intensity: 0.3
                            }
                        },
                        viewControl: {
                            alpha: 15,
                            beta: 40,
                            projection: 'perspective', // 投影方式，默认为透视投影'perspective'，也支持设置为正交投影'orthographic'
                            autoRotate: true,// 是否开启视角绕物体的自动旋转查看。
                            autoRotateDirection: 'cw', // 物体自转的方向 'cw'顺时针方向 'ccw'逆时针方向
                            zoomSensitivity: 0,// 鼠标灵敏度
                            // minDistance: 100, // 鼠标控制能拉近到主体的最小距离
                            // maxDistance: 100, // 鼠标控制能拉远到主体的最大距离
                            autoRotateAfterStill: 5,// 在鼠标静止操作后恢复自动旋转的时间间隔
                            distance: 250,// 默认视角距离主体的距离
                            autoRotateSpeed:1,// 物体自转的速度  单位为角度 / 秒，默认为10 ，也就是36秒转一圈
                        },                        
                    },
                    series: [{
                        type: 'bar3D',
                        data: [],
                        shading: 'color',

                        label: {
                            show: false,
                            textStyle: {
                                fontSize: 16,
                                borderWidth: 1
                            }
                        },
                        
                        itemStyle: {
                            opacity: 0.4
                        },

                        emphasis: {
                            label: {
                                textStyle: {
                                    fontSize: 20,
                                    color: '#900'
                                }
                            },
                            itemStyle: {
                                color: '#900'
                            }
                        }
                    }]
                },
            },
        }
    },
    methods: {
        gen3DChart() {
            let days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
            let hours = [
                '0A', '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A',
                '0P', '1P', '2P', '3P', '4P', '5P', '6P', '7P', '8P', '9P', '10P', '11P'
            ];
            let data = [
                [0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],
                [1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],
                [2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],
                [3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],
                [4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],
                [5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],
                [6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]
            ];
            this.echartsData.chart3D.xAxis3D.data = hours;
            this.echartsData.chart3D.yAxis3D.data = days;
            this.echartsData.chart3D.series[0].data = data.map((item) => [item[1], item[0], item[2]]);

            const echarts3D = echarts.init(this.$refs.echarts);
            echarts3D.setOption(this.echartsData.chart3D);
        }
    },
    mounted() {
        console.log("xxx")
        this.gen3DChart();
    }

}
</script>