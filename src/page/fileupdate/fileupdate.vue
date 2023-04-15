<template>
	<el-container class="layout-container">
        <el-header class="layout-header">
        </el-header>
        <el-row class="layout-row" :style="bgStyle">
            <el-col class="elcol"></el-col>
            <el-col class="elcol elbg">
				<el-row class="elrow elbg"></el-row>
                <el-row class="btnrow elbg">
					<el-input class="elinput" v-model="zippath" placeholder="输出路径"></el-input>
				</el-row>
				<el-row class="elrow elbg btnrow">
					<!-- <input ref="single"  class="fileUpload" type='file' name="single" @change.stop="changeSingleData"/>  -->
					<el-button class="elbtn" icon="el-icon-coffee-cup" @click="selectFile">选择</el-button>
					<input ref="multi" class="fileUpload" type='file' name="multi" @change.stop="changeMultiData"/>
					<el-button class="elbtn" icon="el-icon-upload" @click="uploadFile">转化</el-button>
				</el-row>
                <el-row class="elrow elbg"></el-row>
            </el-col>
            <el-col class="elcol"></el-col>
        </el-row>
        <el-footer class="layout-footer"><!-- Footer --></el-footer>
	</el-container>
</template>
<script>
export default {
	name: 'fileszip',
	components: {
	},
	data() {
		return {
			singlefileList:[],
			multifileList:[],
			form:{
				collectPath:''
			},
			fileid:'',
			
			zippath:'\\\\mczsvr06\\设计输出数据\\Film',
		}
	},
	methods: {
		selectFile() {
			this.$refs.multi.click();
		},
		changeSingleData () {
			// console.log(this.$refs.single);
			// console.log(this.$refs.single.files);
			console.log('ddddddddddddddddddddddd');
			this.singlefileList = this.$refs.single.files   
		},		
		changeMultiData () {
			console.log('dddddddddddddddddddddddeeeeeeeee');
			console.log(this.$refs.multi.files[0].path)
			this.multifileList = this.$refs.multi.files  // 获取filelist
		},
		// 上传
		uploadFile () {
			let formData = new window.FormData()
			for (let i = 0; i < this.singlefileList.length; i++) {  // 每个file append到formdata里
				formData.append('single', this.singlefileList[i])
				console.log('---------',this.singlefileList[i]);
			}			
			for (let i = 0; i < this.multifileList.length; i++) {  // 每个file append到formdata里
				formData.append('multi', this.multifileList[i])
				console.log('---------',this.multifileList[i]);
			}
			console.log('00000000000uploadZip',this.zippath.length);
			let param = this.zippath.length > 0 ? this.zippath : 'default';
			formData.append('data', param);

			let that = this;
			this.$axios({
				method: 'post',
				url: '/api/common/uploadZip',
				data: formData,
				headers: {'Content-Type': 'multipart/form-data'}
			}).then(function (resp) {
				console.log(JSON.stringify(resp.data));
				if (resp.data.code == 0) {
					that.$alert(resp.data.msg, '提示', {
						type:'success',
						confirmButtonText: '确定',
						callback: action => {}
					});
				}
				else {
					that.$alert(resp.data.msg, '提示', {
						type:'error',
						confirmButtonText: '确定',
						callback: action => {}
					});					
				}
			});
		},
	},
	computed:{
        bgStyle(){
            return {
                backgroundImage: 'url(' + require('../../assets/images/background/10simple.jpeg') + ')'	
            }
        }
    },
	created (){
		document.title = '微应用Web平台·设计·文件自动归档';
	}
}

</script>

<style lang="less" scoped>
.fileUpload {
	display: none;
}

.layout-container {
    width: 100%;
    height: 100%;
}
.layout-header {
    width: 80%;  
    height: 500px;
}

.layout-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;

    height: 360px;
    width: 100%;
    //padding: 35px 35px 15px;
    background: #fff;
    border: 0px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.layout-row {
    width: 100%;
    height: 600px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
	justify-content: space-between;
}
.elcol {
    width:33.33%;
}

label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}

.elbg {
    // background-color: rgba(116, 210, 73, 0.02);
    background-color: rgba(255, 255, 255, 0.1);
}

.btnrow {
    height: 80px;
    /* 固定宽度，避免控件自适应宽度跑到下一行 */
    width: 520px;
    display: flex;
    flex-wrap: wrap;
	justify-content: space-between;
}
.elrow {
    height: 50px;
    /* 固定宽度，避免控件自适应宽度跑到下一行 */
    width: 520px;
}
.elbtn{
    width:128px;
    height:40px;
}
.elinput {
	width:480px;
	
}
:v-deep(.el-input__inner) {
	/* 只留边框底线 */
	border-radius: 0px;
	border-top-width: 0px;
	border-left-width: 0px;
	border-right-width: 0px;
	border-bottom-width: 1px;
	/* 透明背景 */
	background-color:transparent;
	color: #FFFFFF;
}
</style>