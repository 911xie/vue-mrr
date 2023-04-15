<template>
    <el-card :span="24">
        <el-row>
            <el-col :span="2">
                <el-button class="elbtn" style="background:#409EFF" @click="addDialogVisible = true">
                    <span class="elbtn" style="color:#fff">新增<i class="el-icon-document-add el-icon--right"/></span>
                </el-button>
            </el-col>
<!--            
            <el-col :span="2">
                <input ref="single" type='file' name="single" @change.stop="changeSingleData" />  
                <el-button class="elbtn" icon="el-icon-upload" @click="uploadFile">导入</el-button>
            </el-col>
-->
            <el-col style="width:180px;display:flex;align-items: center;justify-content: space-around;">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false"
                    :http-request="uploadFile">
                    <el-button class="elbtn"  style="background:#20B2AA">
                        <span  style="color:#fff">导入<i class="el-icon-upload el-icon--right"/></span>
                    </el-button>
                </el-upload>
                <span>      </span>
                <el-button class="elbtn"  style="background:#EE1289" @click="exportFile">
                    <span style="color:#fff">导出<i class="el-icon-download el-icon--right"/></span>
                </el-button>                
            </el-col>

            <el-col style="width:300px;background:#fff;display:flex;align-items: center;justify-content: space-around;">
                <el-input placeholder="请输入" v-model="qryText" clearable style="width:80%;">
                    <el-button slot="append" icon="el-icon-search" @click="likeQuery()"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="tableData">
                <el-table-column label="序号" width="60px" prop="" type="index" sortable="custom" align="center"/>
                <el-table-column label="ID" width="60px" prop="ID" type="index" sortable="custom" align="center" v-if="false"/>
                <el-table-column label="品目名" prop="IDHMCD" sortable="custom" align="center"/>
                <el-table-column label="工序" prop="IDTJYN"  align="center"/>
                <el-table-column label="AS400工程码" prop="IDEKOT" align="center"/>
                <el-table-column label="MAT工程码" prop="IDRUID" align="center"/>
                <el-table-column label="工程名" prop="IDETNM" align="center"/>                                     
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row.ID)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row.ID)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
            <div class="graph" style="padding-top:20px; height:40px;display: flex;align-items: center;justify-content: right;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="->, prev, pager, next"
                    :page-size="nPerPage"
                    :total="nTotal">
                </el-pagination> 
            </div>
        </el-row>
        <!--model:增加弹窗-->
        <el-dialog title="增加品目" :visible.sync="addDialogVisible" width="40%">
            <el-form label-width="120px" :model="addData">
                <el-form-item label="品目名">
                    <el-input v-model="addData.IDHMCD"></el-input>
                </el-form-item>
                <el-form-item label="工序">
                    <el-input v-model="addData.IDTJYN"></el-input>
                </el-form-item>
                <el-form-item label="AS400工程码">
                    <el-input v-model="addData.IDEKOT"></el-input>
                </el-form-item>
                <el-form-item label="MAT工程码">
                    <el-input v-model="addData.IDRUID"></el-input>
                </el-form-item>
                <el-form-item label="工程名">
                    <el-input v-model="addData.IDETNM"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd(addData)">提 交</el-button>
            </span>
        </el-dialog>
        <!--修改弹窗-->
        <el-dialog center title="修改品目信息" :visible.sync="editDialogVisible" width="40%">
            <el-form :model="editData" ref="editData" label-width="120px">
                <el-form-item label="品目名">
                    <el-input v-model="editData.IDHMCD"></el-input>
                </el-form-item>
                <el-form-item label="工序">
                    <el-input v-model="editData.IDTJYN"></el-input>
                </el-form-item>
                <el-form-item label="AS400工程码">
                    <el-input v-model="editData.IDEKOT"></el-input>
                </el-form-item>
                <el-form-item label="MAT工程码">
                    <el-input v-model="editData.IDRUID"></el-input>
                </el-form-item>
                <el-form-item label="工程名">
                    <el-input v-model="editData.IDETNM"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdate(editData)">修 改</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
 
<script>
import {
    apiGetUserList,
    apiUserAdd,
    apiGetUserById,
    apiUserUpdate,
    apiUserDelete,
    apiUserFuzzyQuery
} from "@/api/data.js"; // 调用api 登录接口
//import { apiUpdate } from '../../api/data';
 
export default {
    data() {
        return {
            tableData: [],
            diviceForm: [],
            search: "",
            qryText: "",
            addDialogVisible: false,
            editDialogVisible: false,

            addData: {
                IDHMCD: "",
                IDTJYN: "",
                IDEKOT: "",
                IDRUID: "",
                IDETNM: "",
            },
            editData: {
                IDHMCD: "",
                IDTJYN: "",
                IDEKOT: "",
                IDRUID: "",
                IDETNM: "",
            },

            // 分页
            nTotal: 0,
            nPage: 0, 
            nPerPage: 9, 

            singlefileList:[],
        };
    },
    created() {
        this.init();
        document.title = '2DID Maintenance';
    },
    methods: {
		changeSingleData () {
			console.log('ddddddddddddddddddddddd');
			this.singlefileList = this.$refs.single.files   
		},
        exportFile() {
            let data = {};
			let that = this;
			this.$axios({
				method: 'post',
				url: '/api/common/export2did',
				data,
				headers: {'Content-Type': 'multipart/form-data'}
			}).then(function (res) {
				console.log(JSON.stringify(res.data));
                const blob = new Blob([res.data]);
                const fileName = res.headers["content-disposition"].split(";")[1].split("filename=")[1];
                if ('download' in document.createElement("a")) {
                    const link = document.createElement("a");
                    link.download = fileName;
                    link.style.display = 'none';
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                } else {
                    navigator.msSaveBlob(blob, fileName);
                }
			});
        },
		uploadFile (f) {
            // let formData = new window.FormData()
			// for (let i = 0; i < this.singlefileList.length; i++) {  // 每个file append到formdata里
			// 	formData.append('single', this.singlefileList[i])
			// 	console.log('---------',this.singlefileList[i]);
			// }		

            const file = f.file
            const formData = new FormData()
            formData.append('single', file)
			let param = 'default';
			formData.append('data', param);		

			let that = this;
			this.$axios({
				method: 'post',
				url: '/api/common/import2did',
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
        init() {
            let that = this;
            let data = {"nPage":this.nPage, "nPerPage":this.nPerPage};

            this.$axios({
                method: 'post', 
                url: '/api/common/list2did', 
                data
            }).then(function (resp) {
                console.log(resp);
                that.tableData = resp.data.data.aryData;
                that.nTotal = resp.data.data.nTotal;     
            });
        },
        handleAdd(addData) {
            var that = this;
            let data = JSON.parse(JSON.stringify(this.addData));
            this.$axios({
                method: 'post', 
                url: '/api/common/add2did', 
                data
            }).then(function (resp) {
                that.addDialogVisible = false;
                that.init();
                that.addData = {};
                console.log(JSON.stringify(resp));         
            });
        },
        handleEdit(index, id) {
            // let data = {"id":id}
            // apiGetUserById(data).then((res) => {
            //     this.editData = res.data;
            //     this.editData.deptid = this.editData.dept.deptid;
            //     console.log('handleEdit...'+JSON.stringify(res.data));
            // }).catch((err) => {
            //     console.log("err==>", err);
            // }); 
            // this.editDialogVisible = true;     

            var that = this;
            let data = {"id":id}
            this.$axios({
                method: 'post', 
                url: '/api/common/get2didByID', 
                data
            }).then(function (resp) {
                that.editData = resp.data.data;
                console.log('handleEdit...'+JSON.stringify(resp.data));     
            });
            this.editDialogVisible = true;   
        },
        handleUpdate(editData) {
            // let data = JSON.parse(JSON.stringify(editData));
            // apiUserUpdate(data).then((res) => {
            //     this.editDialogVisible = false;
            //     this.init();
            //     console.log(JSON.stringify(res));
            // }).catch((err) => {
            //     console.log("err==>", err);
            // });

            var that = this;
            let data = JSON.parse(JSON.stringify(editData));
            this.$axios({
                method: 'post', 
                url: '/api/common/upd2did', 
                data
            }).then(function (resp) {
                that.editDialogVisible = false;
                that.init();
                console.log(JSON.stringify(resp.data));      
            });          
        },        
        handleDelete(id) {
            // let data = {"id":id};
            // apiUserDelete(data).then((res) => {
            //     this.editDialogVisible = false;
            //     this.init();
            //     console.log(JSON.stringify(res));
            // }).catch((err) => {
            //     console.log("err==>", err);
            // });

            console.log('del......',id);
            var that = this;
            let data = {"id":id};
            this.$confirm('此操作将删除此记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios({
                    method: 'post', 
                    url: '/api/common/del2did', 
                    data
                }).then(function (resp) {
                    that.editDialogVisible = false;
                    that.init();
                    console.log(JSON.stringify(resp));   
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });                        
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },

        likeQuery() {
            // let data = {"text": this.qryText};
            // apiUserFuzzyQuery(data).then((res) => {
            //     this.tableData = res.data;
            //     console.log(JSON.stringify(res));
            // }).catch((err) => {
            //     console.log("err==>", err);
            // });
            
            //表单转json(JSON.stringify())
            let data = {"text": this.qryText};
            console.log(this.qryText);
            this.$axios.post('/api/common/likeQuery', data).then(resp=>{
                this.tableData = resp.data.data;
                console.log(JSON.stringify(resp));
            }) 
        },
        // 分页方法      
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.nPage = val - 1;
            console.log('currPage:', this.nPage);
            this.init();
        },
    },
};
</script>
<style scoped>
/* 
.bg_btn button {background: #fb435f; } 
.bg_btn button:first-child { background: #0cc87e; }  
*/
.bg_btn button {background: #9A32CD; } 
.bg_btn button:first-child { background: #20B2AA; } 

.elbtn { border: none; }
</style>