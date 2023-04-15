<template>
    <el-dialog title="提示" :visible.sync="showDialog" width="50%" @close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取 消</el-button>
            <el-button type="primary" @click="showDialog = false">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
	export default {    
	    // 接受父组件传递的值
	    props:{
	        addOrUpdateVisible:{
	            type: Boolean,         
	            default: false
	        }
	    },
	    data(){
	        return{
	            // 控制弹出框显示隐藏
	            showDialog: false
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
	        addOrUpdateVisible(oldVal, newVal){
				console.log("addOrUpdateVisible的数值的变换.....", oldVal, newVal);
	            this.showDialog = this.addOrUpdateVisible
	        },
	    }
	}
</script>

<style lang="less" scoped>

</style>
