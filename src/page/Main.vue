<template>
	<el-container style="height:100%">
		<!-- <el-aside width="auto">Aside</el-aside> -->
		<el-aside width="auto">
			<!-- 4.按命名规范使用自定义组件标签 -->
			<common-aside></common-aside>
		</el-aside>
		<el-container>
			<el-header>
				<common-header></common-header>
			</el-header>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
<script>
// 1.components目录下新建CommonAside.vue文件
// 2.在这引入
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
export default {
	//name: 'Main',
	// 3.定义组件标签
	components: {
		CommonAside,
		CommonHeader,
	},
	data() {
		return {}
	}
}
</script>

<style lang="less" scoped>
.el-header {
	background: #181717b0;
}
.el-main {
	padding-top: 0;
}
</style>

