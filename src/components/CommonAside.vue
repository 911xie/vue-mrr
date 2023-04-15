<template>
	<!-- 注意background-color，text-color， active-text-color这3个是el-menu的属性，
	而不是el-menu的style里的属性 -->
	<el-menu default-active="1-4-1" class="el-menu-vertical-demo" 
	background-color="#2C2C2C" text-color="#fff" active-text-color="#ffd04b"
	@open="handleOpen" @close="handleClose" :collapse="isCollapse">
		<h3>后台管理系统</h3>
		<el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :index="item.path" :key="item.path">
			<i :class="'el-icon-'+item.icon"></i>
			<span slot="title">{{item.label}}</span>
		</el-menu-item>
		<!-- 直接用:index="index"报错，必须:index="''+index"，转化为string -->
		<!-- 报错信息：Invalid prop: type check failed for prop "index". Expected String with value "0", got Number with value 0. -->
		<el-submenu v-for="(item,index) in hasChildren" :index="''+index" :key="item.path">
			<template slot="title">
			<i :class="'el-icon-'+item.icon"></i>
			<span slot="title">{{item.label}}</span>
			</template>
			<el-menu-item-group v-for="(subItem, subIndex) in item.children" :key="subItem.path">
				<!-- 直接用:index="subIndex"报错，必须:index="''+subIndex"，转化为string -->
				<!-- 报错信息：Invalid prop: custom validator check failed for prop "index". -->
				<el-menu-item @click="clickMenu(subItem)" :index="''+subIndex">
					<i :class="'el-icon-'+subItem.icon"></i>
					<span slot="title">{{subItem.label}}</span>
				</el-menu-item>
			</el-menu-item-group>
		</el-submenu>
	</el-menu>
</template>

<script>
	export default {
		data() {
			return {
				//左边菜单栏是否展开
				isCollapse: false,
				menu:[
					{
						path: '/home',
						name: 'home',
						label: '首页',
						icon: 's-home',
					},
					{
						path: '/reserve',
						name: 'reserve',
						label: '会议室预定',
						icon: 'video-play',
					},
					{
						path: '/user',
						name: 'user',
						label: '用户管理',
						icon: 'user',
					},
					{
						path: '/dept',
						name: 'dept',
						label: '部门管理',
						icon: 's-management',
					},
					{
						label: '其他',
						icon: 'location',
						children: [
							{
								path: '/websocket',
								name: 'websocket',
								label: 'websocket测试',
								icon: 'setting',
							},
							{
								path: '/page2',
								name: 'page2',
								label: '页面2',
								icon: 'setting',
							},
							{
								path: '/login',
								name: 'login',
								label: '登录',
								icon: 'setting',
							},															
						],
					},
				]
			};
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			clickMenu(item){
				// 由于已经在index.js里Vue.use(VueRouter)做了全局引用，
				// 所以这里可以this.$router这样调用
				this.$router.push({
					name: item.name,
				})
			}
		},
		computed: {
			noChildren() {
				// 如果没有子项返回
				return this.menu.filter(item => !item.children)
			},
			hasChildren() {
				// 如果有子项返回
				return this.menu.filter(item => item.children)
			},
		}
	}
</script>

<style lang="less" scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}
	.el-menu {
		height: 100%;
		border: none;
		h3 {
			color: #fff;
			text-align: center;
			line-height: 48px;
		}
	}
</style>