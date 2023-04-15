// mock数据模拟
import Mock from 'mockjs'

// 图表数据
let List = []
export default {
	getStatisticalData: () => {
		//Mock.Random.float 产生随机数100到8000之间 保留小数 最小0位 最大0位
		for (let i = 0; i < 7; i++) {
			List.push(Mock.mock({
				苹果: Mock.Random.float(100, 8000, 0, 0),
				vivo: Mock.Random.float(100, 8000, 0, 0),
				oppo: Mock.Random.float(100, 8000, 0, 0),
				魅族: Mock.Random.float(100, 8000, 0, 0),
				三星: Mock.Random.float(100, 8000, 0, 0),
				小米: Mock.Random.float(100, 8000, 0, 0)
			}))
		}
		return {
			code: 20000,
			data: {
				eventData:[
					{
						id: 1,
						title: '09:30~11:30 月度报告会',
						start: '2022-07-25 09:30:00',
						end: '2022-07-25 11:30:00',
						color: '#f08f00',
						status: "已结束",
						content: "检讨月度工作内容，下月工作计划，工作效率提升讨论，安全生产培训等",
						reserve: '李  琴(总务部-总务课)',
					},
					{
						id: 2,
						title: '10:00~12:00 月度报告会',
						start: '2022-07-25 10:00:00',
						end: '2022-07-25 12:00:00',
						color: '#4B0082',
						status: "已结束",
					},
					{
						id: 3,
						title: '09:30~10:30 与BCS会议 检讨出货排产',
						start: '2022-07-13',
						end: '2022-07-13',
						color: '#6bb377',
						status: "已结束",
					},
					{
						id: 4,
						title: '11:00~12:30 B社WIP会议',
						start: '2022-07-13',
						end: '2022-07-13',
						color: '#4B0082',
						status: "已结束",
					},
					{
						id: 5,
						title: '12:30~13:30 Wellbe来访',
						start: '2022-07-13',
						end: '2022-07-13',
						color: '#BCEE68',
						status: "已结束",
					},
					{
						id: 6,
						title: '14:00~14:30 M社监察',
						start: '2022-07-13',
						end: '2022-07-13',
						color: '#FF8247',
						status: "已结束",
					},
					{
						id: 7,
						title: '14:30~15:30 AI制造部PIZ例会',
						start: '2022-07-13',
						end: '2022-07-13',
						color: '#8B4726',
						status: "已结束",
					},
					{
						id: 8,
						title: '15:30~16:30 参加欣旺达召开的IMDS操作培训',
						start: '2022-07-13',
						end: '2022-07-13',
						color: '#36648B',
						status: "已结束",
					},
					{
						id: 9,
						title: '09:30~11:30 月度报告会',
						start: '2022-07-05',
						end: '2022-07-05',
						color: '#6A5ACD',
						status: "已结束",
					},
					{
						id: 10,
						title: '09:30~11:30 智慧工厂会议',
						start: '2022-07-11',
						end: '2022-07-11',
						color: '#6A5ACD',
						status: "已结束",
					},
					{
						id: 11,
						title: '09:30~11:30 EC需求会',
						start: '2022-07-15',
						end: '2022-07-15',
						color: '#6A5ACD',
						status: "已结束",
					},	
					{
						id: 12,
						title: '12:30~13:30 供应商来访',
						start: '2022-07-15',
						end: '2022-07-15',
						color: '#BCEE68',
						status: "已结束",
					},
					{
						id: 13,
						title: '14:00~14:30 M社监察2次',
						start: '2022-07-15 14:00',
						end: '2022-07-15 14:30',
						color: '#FF8247',
						status: "已结束",
					},
					{
						id: 14,
						title: '14:30~15:30 总务部周例会',
						start: '2022-07-15 14:30',
						end: '2022-07-15 15:30',
						color: '#8B4726',
						status: "已结束",
					},	
					{
						id: 15,
						title: '16:30~17:30 调达部效率提升例会',
						start: '2022-07-15 16:30',
						end: '2022-07-15 17:30',
						color: '#36648B',
						status: "已结束",
						content: "检讨工作中存在问题，探讨效率提升方式方法，安全生产培训",
						reserve: '曾  波(调达部-调达课)',
						background: "linear-gradient(to right, #FDF5E6, #36648B)",
						textcolor: "#FFFFFF"
					},
					{
						id: 16,
						title: '09:30~11:30 采购部例会',
						start: '2022-07-18 09:30',
						end: '2022-07-18 11:30',
						color: '#FF8247',
						status: "已结束",
					},	
					{
						id: 17,
						title: '12:30~13:30 洁净度MIL检讨会议',
						start: '2022-07-18 12:30',
						end: '2022-07-18 13:30',
						color: '#BCEE68',
						status: "已结束",
					},
					{
						id: 18,
						title: '14:00~14:30 初流总结会议',
						start: '2022-07-18 14:00',
						end: '2022-07-18 14:30',
						color: '#6A5ACD',
						status: "已结束",
					},	
					{
						id: 19,
						title: '15:00~16:30 PIZ报告会',
						start: '2022-07-21 15:00:00',
						end: '2022-07-21 16:30:00',
						color: '#4B0082',
						status: "已结束",
						content: "检讨月度工作内容，下月工作计划，工作效率提升讨论，安全生产培训等",
						reserve: '李  琴(总务部-总务课)',
						background: "linear-gradient(to right, #FDF5E6, #4B0082)",
						textcolor: "#FFFFFF"
					},																			
				],
				// 饼图
				videoData: [
					{
						name: '小米',
						value: 2999
					},
					{
						name: '苹果',
						value: 5999
					},
					{
						name: 'vivo',
						value: 1500
					},
					{
						name: 'oppo',
						value: 1999
					},
					{
						name: '魅族',
						value: 2200
					},
					{
						name: '三星',
						value: 4500
					}
				],
				// 柱状图
				userData: [
					{
						date: '周一',
						new: 5,
						active: 200
					},
					{
						date: '周二',
						new: 10,
						active: 500
					},
					{
						date: '周三',
						new: 12,
						active: 550
					},
					{
						date: '周四',
						new: 60,
						active: 800
					},
					{
						date: '周五',
						new: 65,
						active: 550
					},
					{
						date: '周六',
						new: 53,
						active: 770
					},
					{
						date: '周日',
						new: 33,
						active: 170
					}
				],
				// 折线图
				orderData: {
					date: ['20191001', '20191002', '20191003', '20191004', '20191005', '20191006', '20191007'],
					data: List
				},
				tableLabel:{
					name: '课程',
					todayBuy:'今日购买',
					monthBuy:'本月购买',
					totalBuy:'总购买',
				},
				tableData: [
					{
						name: 'oppo',
						todayBuy: 500,
						monthBuy: 3500,
						totalBuy: 22000
					},
					{
						name: 'vivo',
						todayBuy: 300,
						monthBuy: 2200,
						totalBuy: 24000
					},
					{
						name: '苹果',
						todayBuy: 800,
						monthBuy: 4500,
						totalBuy: 65000
					},
					{
						name: '小米',
						todayBuy: 1200,
						monthBuy: 6500,
						totalBuy: 45000
					},
					{
						name: '三星',
						todayBuy: 300,
						monthBuy: 2000,
						totalBuy: 34000
					},
					{
						name: '魅族',
						todayBuy: 350,
						monthBuy: 3000,
						totalBuy: 22000
					}
				],
				countData: [
					{
						name: "今日支付订单",
						value: 1234,
						icon: "success",
						color: "#2ec7c9",
					},
					{
						name: "今日收藏订单",
						value: 210,
						icon: "star-on",
						color: "#ffb980",
					},
					{
						name: "今日未支付订单",
						value: 1234,
						icon: "s-goods",
						color: "#5ab1ef",
					},
					{
						name: "本月支付订单",
						value: 1234,
						icon: "success",
						color: "#2ec7c9",
					},
					{
						name: "本月收藏订单",
						value: 210,
						icon: "star-on",
						color: "#ffb980",
					},
					{
						name: "本月未支付订单",
						value: 1234,
						icon: "s-goods",
						color: "#5ab1ef",
					},
				]
			}
		}
	}
}