<template>
    <el-card :span="24">
        <el-row>
            <el-col :span="2">
            <el-button type="primary" @click="addDialogVisible = true">新增</el-button>
            </el-col>
            <el-col :span="6">
            <el-input placeholder="请输入" v-model="qryText" clearable>
                <el-button
                slot="append"
                icon="el-icon-search"
                @click="FuzzyQuery()">
                </el-button>
            </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="tableData">
                <el-table-column
                    label="序号"
                    prop="id"
                    type="index"
                    sortable="custom"
                    align="center"/>
                <el-table-column
                    label="类型"
                    width="130px"
                    align="center"
                    prop="type"/>
                <el-table-column
                    label="用户id"
                    width="130px"
                    align="center"
                    prop="userid"/>
                <el-table-column
                    label="用户名"
                    width="130px"
                    align="center"
                    prop="username"/>
                <el-table-column
                    label="部门"
                    width="130px"
                    align="center"
                    prop="dept.deptname"/>                    
                <el-table-column
                    label="邮箱"
                    width="130px"
                    align="center"
                    prop="email"/>                    
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </el-row>
        <!--model:增加弹窗-->
        <el-dialog title="增加用户" :visible.sync="addDialogVisible" width="30%">
            <el-form label-width="80px" :model="userAddData">
                <el-form-item label="用户类型">
                    <el-input v-model="userAddData.type"></el-input>
                </el-form-item>
                <el-form-item label="用户id">
                    <el-input v-model="userAddData.userid"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="userAddData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="userAddData.password"></el-input>
                </el-form-item>
                <el-form-item label="部门id">
                    <el-input v-model="userAddData.deptid"></el-input>
                </el-form-item>
                <el-form-item label="email">
                    <el-input v-model="userAddData.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userAdd(userAddData)">提 交</el-button>
            </span>
        </el-dialog>
        <!--修改弹窗-->
        <el-dialog center title="修改用户信息" :visible.sync="editDialogVisible" width="30%">
            <el-form :model="editData" ref="editData" label-width="90px">
                <el-form-item label="用户类型">
                    <el-input v-model="editData.type"></el-input>
                </el-form-item>
                <el-form-item label="用户id">
                    <el-input v-model="editData.userid"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="editData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="editData.password"></el-input>
                </el-form-item>
                <el-form-item label="部门id">
                    <el-input v-model="editData.deptid"></el-input>
                </el-form-item>
                <el-form-item label="email">
                    <el-input v-model="editData.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userUpdate(editData)">修 改</el-button>
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
            userAddData: {
                type: 0,
                userid: "",
                username: "",
                password: "",
                deptid: "",
                email: "",
            },
            editData: {
                type: 0,
                userid: "",
                password: "",
                username: "",
                deptid: "",
                email: "",
            },
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            apiGetUserList().then((res) => {
                console.log(JSON.stringify('getUserList1...'+res));
                this.tableData = res.data;
                this.total = res.data.length;
                console.log(JSON.stringify(res.data));
            }).catch((err) => {
                console.log("err==>", err);
            });
            
            // this.$http.get('/api').then(resp=>{
            //     this.tableData=resp.data; //后端数据传给users数组
            //     console.log(JSON.stringify(resp));
            // })
        },
        userAdd(userAddData) {
            var that = this;
            apiUserAdd(userAddData).then((res) => {
                that.addDialogVisible = false;
                this.init();
                this.userAddData = {};
                console.log(JSON.stringify(res));
            }).catch((err) => {
                console.log("err==>", err);
            });

            // //表单转json(JSON.stringify())
            // let data = JSON.parse(JSON.stringify(this.userAddData));
            // this.$post('/api/user/add', data).then(resp=>{
            //     that.addDialogVisible = false;
            //     this.init();
            //     this.userAddData = {};
            //     console.log(JSON.stringify(resp));
            // })
        },
        handleEdit(index, id) {
            let data = {"id":id}
            apiGetUserById(data).then((res) => {
                this.editData = res.data;
                this.editData.deptid = this.editData.dept.deptid;
                console.log('handleEdit...'+JSON.stringify(res.data));
            }).catch((err) => {
                console.log("err==>", err);
            }); 
            this.editDialogVisible = true;     

            // let data = {"id":id}
            // this.$axios.post('/api/user/getUserById', data).then(resp=>{
            //     this.editData = resp.data;
            //     this.editData.deptid = this.editData.dept.deptid;
            //     console.log(JSON.stringify(resp.data));
            // })   

            // this.editDialogVisible = true;
        },
        userUpdate(editData) {
            let data = JSON.parse(JSON.stringify(editData));
            apiUserUpdate(data).then((res) => {
                this.editDialogVisible = false;
                this.init();
                console.log(JSON.stringify(res));
            }).catch((err) => {
                console.log("err==>", err);
            });

            // //表单转json(JSON.stringify())
            // let data = JSON.parse(JSON.stringify(this.editData));
            // console.log(JSON.stringify(this.editData));
            // this.$axios.post('/api/user/update', data).then(resp=>{
            //     that.editDialogVisible = false;
            //     this.init();
            //     this.userAddData = {};
            //     console.log(JSON.stringify(resp));
            // })            
        },        
        handleDelete(id) {
            let data = {"id":id};
            apiUserDelete(data).then((res) => {
                this.editDialogVisible = false;
                this.init();
                console.log(JSON.stringify(res));
            }).catch((err) => {
                console.log("err==>", err);
            });

            // var that = this;
            // //表单转json(JSON.stringify())
            // let data = {"id":id};
            // this.$axios.post('/api/user/delete', data).then(resp=>{
            //     that.editDialogVisible = false;
            //     this.init();
            //     console.log(JSON.stringify(resp));
            // }) 
        },

        FuzzyQuery() {
            let data = {"text": this.qryText};
            apiUserFuzzyQuery(data).then((res) => {
                this.tableData = res.data;
                console.log(JSON.stringify(res));
            }).catch((err) => {
                console.log("err==>", err);
            });
            
            // //表单转json(JSON.stringify())
            // let data = {"text": this.qryText};
            // console.log(this.qryText);
            // this.$axios.post('/api/user/fuzzyQuery', data).then(resp=>{
            //     this.tableData = resp.data;
            //     console.log(JSON.stringify(resp));
            // }) 
        },
    },
};
</script>