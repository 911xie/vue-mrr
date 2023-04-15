<template>
	<div class='calendarAll'>
		<table width="100%">
			<!-- <td width="5%">
				<el-button @click="show">按钮</el-button>
			</td> -->
			<td width="95%">
				<div class='calendarBox'>
					<full-calendar ref="fullCalendar" style="height: 100%" :options="calendarOptions"></full-calendar>    
				</div>
				<reserve-edit :editVisible="editVisible" @changeShow="showEditDlg"></reserve-edit>
			</td>
		</table>

	</div>
</template>
<script>
// 引入日历组件
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';

import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/scale.css';

import _ from 'lodash';// 如果不引入会报  _ is not defined
import AddOrUpdate from '../../components/addOrUpdate.vue';
import {getData} from '../../api/data.js';
import ReserveEdit from '../../components/ReserveEdit.vue';

import {
    apiReserve
} from "@/api/data.js"; // 调用api 登录接口

export default {
	// 定义组件标签
	components: {
		FullCalendar,
		timeGridPlugin,
		interactionPlugin,
		listPlugin,
		AddOrUpdate,
		ReserveEdit,

		apiReserve
	},
	data(){
		return{
			calendarOptions: {
				timeZone: 'local',//'UTC',
				plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
				height: 800,
				headerToolbar: {
					//left: "prev, next today",
					left: "prev next today",
					center: "title",
					//right: "dayGridMonth, dayGridWeek, dayGrid",
					right: "dayGridMonth dayGridWeek timeGridDay list",
					//right: 'agendaWeek,dayGridWeek,dayGrid'
				},
				buttonText: {
					// 设置按钮
					today: "今天",
					month: "月",
					week: "周",
					dayGrid: "天",
				},
				// allDaySlot: false,
				editable: true,
				selectable: true,
				navLinks: true,
				// displayEventEnd: true,//所有视图显示结束时间
				initialView: "dayGridMonth", // 设置默认显示月，可选周、日
				dateClick: this.handleDateClick,
				eventClick: this.handleEventClick,
				eventsSet: this.handleEvents,
				select: this.handleDateSelect,
				eventMouseEnter: this.eventMouseEnter,
				slotMinTime: '08:00:00',
				slotMaxTime: '22:30:00',
				slotLabelFormat :{
                    hour: '2-digit',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: 'short',
                    hour12:false
				},
				eventDidMount: function (info) {
					if (info.event.extendedProps.background) {
						info.el.style.background = info.event.extendedProps.background;
						info.el.style.color = info.event.extendedProps.textcolor;
					}
				},
				
				changeMonth: this.changeMonth,
                //dayClick: this.dayClick,
				dateClick: this.dateClick,
                moreClick: this.moreClick,
				eventRender: this.eventRenderCallback,

				
          		dayMaxEvents: true,// allow "more" link when too many events,只能选中或拖动一次

				// timezone
				// 设置日程
				events: [],
				eventColor: "#F08F00", // 修改日程背景色
				//locale: "zh-cn", // 设置语言
				weekNumberCalculation: "ISO", // 周数
				customButtons: {
					prev: { // this overrides the prev button
						text: "PREV",
						click: () => {
						this.prev();
						}
					},
					next: { // this overrides the next button
						text: "PREV",
						click: () => {
							this.next();
						}
					},
					today: {
						text: "Today",
						click: () => {
							this.today();
						}
					}
				}
			},
			addOrUpdateVisible:false,
			editVisible:false,
			subList: [],
			currTime:0,
		}
	},
	methods:{
		showEditDlg(isShow){
			console.log('showEditDlg...'+isShow);
			if(isShow === 'false'){
				this.editVisible = false
			}else{
				this.editVisible = true
			}
		},

		// 选择月份
		changeMonth (start, end, current) {
			console.log('changeMonth', start.format(), end.format(), current.format())
		},
		// 点击事件
		eventClick (event, jsEvent, pos) {
			console.log('eventClick', event, jsEvent, pos)
		},
		// 点击当天
		dateClick (day, jsEvent) {
			console.log('dateClick', day, jsEvent)
			let prevTime = this.currTime === 0 ? new Date().getTime() - 1000000 : this.currTime;
			this.currTime = new Date().getTime();
			if (this.currTime - prevTime < 500)
			{
				console.log("this is double click");
				this.editVisible = true;
			}
			else {
				console.log("this is single click");
			}
		},
		// 查看更多
		moreClick (day, events, jsEvent) {
			console.log('moreCLick', day, events, jsEvent)
		},

		prev() {
			this.calendarApi.prev();
		},
		// 切换下一个按钮事件
		next() {
			this.calendarApi.next();
		},
		// 点击今天按钮
		today() {
			this.calendarApi.today();
		},
		handleDateClick: function (arg) {
			this.$forceUpdate();
			console.log(arg,'事件1')
		},
		handleEventClick(calEvent) {
			console.log(calEvent,'事件2');
			this.dialogVisible = true; // 显示dialog弹窗
			let id = calEvent.event.id; // 获取当前点击日程的ID
			let info = this.subList.filter((item) => {
				return item.id == id // 通过ID进行数据匹配 
			});
			this.$nextTick(() => {
				this.form = _.cloneDeep(info[0]); // 数据通过深拷贝赋值到form表单用于编辑
				this.getShowTime(this.form.beginDate, this.form.endDate); // 处理时间回显格式
				console.log(info[0],'数据')
			});
		},
		eventMouseEnter:function (info) {
			console.log('1111111111111', JSON.stringify(info.event));
			let event = info.event;
            tippy(info.el, {
				//theme: 'tomato',
				//content:"会议内容："+event.extendedProps.enddate,

				content:"<div style='width:16rem;'>" +
        		"<div style='border-bottom: 0.1rem solid #CCCCCC;line-height: 1rem;></div>" +
                "<div style='color: #666666'>会议主题："+event.title+"</div>" +
				"<div style='color: #666666'>会议预定："+event.extendedProps.reserve+"</div>" +
				"<div style='color: #666666'>会议内容："+event.extendedProps.content+"</div>" +
				"<div style='color: #666666'>开始时间："+event.start+"</div>" +
                "<div style='color: #666666'>结束时间："+event.end+"</div>" +
                "</div>",
				// placement: "top-start",
				// arrow: false,
				// 鼠标放在提示中提示不消失
				// interactive: true,
				theme:'tomato',
				placement: 'right-end',
				arrow: true,
				allowHTML: true,
				// 鼠标放在提示中提示不消失
				interactive: true,
            });
        },

		getShowTime(beginDate, endDate) {
			this.form.startDate = this.dealWithTime(beginDate);
			this.form.startTime = this.getHoursMin(beginDate);
			this.form.endDate = this.dealWithTime(endDate);
			this.form.endTime = this.getHoursMin(endDate);
		},
		// 获取时分时间
		getHoursMin(value) {
			return value.substring(11, 16);
		},
		// 处理会议时间格式
		dealWithTime(date) {
			let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)[0];
			return newDate;
		},
		
		handleEvents(events) {
			console.log(events,'事件3');
		},


		getReservationList(arrayData){
			let newArr = [];
			this.subList = arrayData;
			arrayData.forEach((item) => {
			newArr.push({
				start: this.dealWithTime(item.beginDate),
				end: this.addDate(this.dealWithTime(item.endDate), 1),
				color: item.status,
				id: item.id,
				title: `${this.getTitle(item.beginDate, item.endDate)} ${item.title}`,
			})
			});
			this.calendarOptions.events = newArr;
		},
		// 日期加1天
		addDate(date, days) {
			var d = new Date(date);
			d.setDate(d.getDate() + days);
			var mon = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
			let endD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
			return `${d.getFullYear()}-${mon}-${endD}`;
		},
		// 获取会议事件title
		getTitle(date1, date2) {
			let start = date1.substring(11, 16);
			let end = date2.substring(11, 16);
			return `${start}~${end}`;
		},
		// 刷新fullCalendar的events数据
		refreshEvent(eventsData) {
			let calendarFunc = this.calendarApi.view.calendar
			let events = calendarFunc.getEvents()   //获取数据
			
			// if(getEvents && getEvents.length>0){  
			// 	getEvents.map(item=>{
			// 		calendarFunc.getEventById(item.id).remove()
			// 	})
			// }
			if (events && events.length > 0) {
				//循环删除数据（通过ID）
				// events.map(event => {
				// 	calendarFunc.getEventById(event.id).remove()
				// 	console.log('remove', event.id);
				// })
				// events.forEach(event => {
				// 	event.remove();
				// 	console.log('remove1', event.id);
				// })
				// 
				_.forEach(events, event => {
					event.remove();
					console.log('remove2', event.id);
				})
			}
			this.subList = [];
			for(let i = 0; i < eventsData.length; i++){
				let event = eventsData[i];
				this.calendarApi.addEvent(event);
				this.subList.push(event);
			}
		}
	},
	mounted() {
		// 获取用户信息
		this.calendarApi = this.$refs.fullCalendar.getApi();
		// getData().then(res=>{
        //     const {code, data} = res.data
        //     if (code === 20000) {
		// 		console.log('reserve-event...666'+data.eventData);
		// 		// this.refreshEvent(data.eventData);
				
		// 		this.calendarApi.setOption('events', data.eventData);
        //     }
            
        // })

		let data = {};
		//this.$axios.post('/api/reserve/findAll', data).then(resp=>{
		apiReserve().then((resp) => {
			console.log('events-eeeeeee 1 ', resp);
			let respData = [];
			for (var key in resp.data) {
				let item = resp.data[key];
				console.log('events-eeeeeee 2 ', key, item.room.roomcolor)
				let obj = {
					id: item.id,
					title: item.title,
					start: item.start,
					end: item.end,
					color: item.room.roomcolor,
					status: "已结束",
					content: item.content,
					reserve: item.user.username+'('+item.user.dept.deptname+')',
					background: "linear-gradient(to right, #FDF5E6, "+item.room.roomcolor+")",
					textcolor: "#FFFFFF"
				}
				respData.push(obj);
			}

			for (var key in respData) {
				console.log(respData[key])
			}
			// 		{
			// 			id: 19,
			// 			title: '15:00~16:30 PIZ报告会',
			// 			start: '2022-07-21 15:00:00',
			// 			end: '2022-07-21 16:30:00',
			// 			color: '#4B0082',
			// 			status: "已结束",
			// 			content: "检讨月度工作内容，下月工作计划，工作效率提升讨论，安全生产培训等",
			// 			reserve: '李  琴(总务部-总务课)',
			// 			background: "linear-gradient(to right, #FDF5E6, #4B0082)",
			// 			textcolor: "#FFFFFF"
			// 		},	
					
			this.calendarApi.setOption('events', respData);
		}).catch((err) => {
			console.log("err==>", err);
		});
	},
}
</script>

<style scoped>

</style>

