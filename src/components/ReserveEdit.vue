<template>
	<el-dialog title="预定/编辑" :visible.sync="showDialog" width="50%" @close="handleClose">
		<el-form label-width="80px" :model="reserveData">
			<el-form-item label="用户id">
				<el-input v-model="reserveData.userid"></el-input>
			</el-form-item>

			<el-form-item label="会议议题">
				<el-input v-model="reserveData.title"></el-input>
			</el-form-item>
			<el-form-item label="会议内容">
				<el-input v-model="reserveData.content"></el-input>
			</el-form-item>
			<el-form-item label="开始时间">
				<el-input v-model="reserveData.start"></el-input>
			</el-form-item>
			<el-form-item label="结束时间">
				<el-input v-model="reserveData.end"></el-input>
			</el-form-item>
			<el-form-item label="会议室id">
				<el-input v-model="reserveData.roomid"></el-input>
			</el-form-item>			
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="editVisible = false">取 消</el-button>
			<el-button type="primary" @click="userAdd(userAddData)">提 交</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {    
	    // 接受父组件传递的值
	    props:{
	        editVisible:{
	            type: Boolean,         
	            default: false
	        }
	    },
	    data(){
	        return{
	            // 控制弹出框显示隐藏
	            showDialog: false,
				reserveData:{
					userid:'',
					title:'',
					content:'',
					start:'',
					end:'',
					roomid:'',
				},
	        }
	    },
	    methods:{
	        // 弹出框关闭后触发
	        handleClose(){
	            // 子组件调用父组件方法，并传递参数
	            this.$emit('changeShow','false')
	        }
	    },
	    watch:{
	        // 监听 addOrUpdateVisible 改变
	        editVisible(oldVal, newVal){
				console.log("editVisible的数值的变换.....", oldVal, newVal);
	            this.showDialog = this.editVisible
	        },
	    }
	}
</script>

<style lang="less" scoped>

</style>
