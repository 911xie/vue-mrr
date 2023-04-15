<template>
    <div class="login-container">
        <el-form
            :model="ruleForm"
            :rules="rules"
            status-icon
            ref="ruleForm"
            label-position="left"
            label-width="0px"
            class="demo-ruleForm login-page"
        >
            <h3 class="title">系统登录</h3>
            <el-form-item prop="username">
                <el-input
                    type="text"
                    v-model="ruleForm.userid"
                    auto-complete="off"
                    placeholder="用户名"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    v-model="ruleForm.password"
                    auto-complete="off"
                    placeholder="密码"
                ></el-input>
            </el-form-item>
            <el-form-item style="width: 100%">
                <el-button
                    type="primary"
                    style="width: 100%"
                    @click="handleSubmit"
                    :loading="logining"
                >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    apiUserLogin
} from "@/api/data.js"; // 调用api 登录接口

export default {
    data() {
        return {
            logining: false,
            ruleForm: {
                userid: "",
                password: "",
            },
            rules: {
                userid: [
                    {
                        required: true,
                        message: "请输入您的账号",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true, 
                        message: "请输入您的密码", 
                        trigger: "blur" 
                    },
                ],
            },
        };
    },
    methods: {
        handleSubmit(){
            let data = {"userid":this.ruleForm.userid,"password":this.ruleForm.password};
            apiUserLogin(data).then((res) => {
                console.log('login return = '+JSON.stringify(res));
                // 标签有效
                // sessionStorage.setItem('token', res.data.token);

                // 浏览器有效
                // localStorage.setItem('s', true);
                localStorage.setItem('userdata', JSON.stringify(res.data));
                console.log("login success!!!==>", localStorage.getItem('userdata'));
                this.$router.replace({path: this.redirect || '/' })
                //this.$router.push('/')
            }).catch((err) => {
                console.log("err==>", err);
            });
        }
    },
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>