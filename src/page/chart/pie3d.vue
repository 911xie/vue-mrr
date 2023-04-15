<template>
    <!-- <div class="chart-container"> -->
       <div class="chart bgcolor" ref="chart"></div>
       <!-- 底座背景 -->
       <!-- <div class="bg"></div>  -->
    <!-- </div> -->
</template>
 
<script>
import { getPie3D, getParametricEquation } from '../../utils/pie3d.js' //工具类js，页面路径自己修改
 
const color = ['#005aff', '#f8b551', '#2E16f0', '#7Ee630', '#37f1e2']
 
export default {
	name: 'chart',
	data () {
		return {
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
				}
			],
			statusChart:null,
			option:{}
		}
	},
	created () {
		this.setLabel()
	},
	mounted () {
		this.initChart()

		//根据窗口变化自动调节图表大小
		const that = this
		window.onresize = function () {
			that.changeSize()
		}
	},
	methods: {
		// 初始化label样式
		setLabel () {
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
							'{c|{c}}{b|元}',
							'{d|{d}%}'
						].join('\n'), // 用\n来换行
						rich: {
							b: {
								color: '#fff',
								lineHeight: 25,
								align: 'left'
							},
							c: {
								fontSize: 22,
								color: '#fff',
								textShadowColor: '#1c90a6',
								textShadowOffsetX: 0,
								textShadowOffsetY: 2,
								textShadowBlur: 5
							},
							d: {
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
		// 图表初始化
		initChart () {
			this.statusChart = this.$echarts.init(this.$refs.chart)
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
			this.bindListen(this.statusChart)
		},
		// 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
		// optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
		bindListen (myChart, optionName = 'option') {

		},
		// 自适应宽高
		changeSize () {
			this.statusChart.resize()
		}
	}
}
</script>
 
<style lang='less' scoped>
.chart-container {
	position: relative;
	width: 100%;
	height: 100%;


}
	.chart,	.bg {
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
	.bgcolor{
		background:#0A2069;
	}
</style>