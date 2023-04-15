<template>
    <header>
        <div class="l-content">
            <el-button plain icon="el-icon-menu" size="mini"></el-button>
            <h3 style="color:#fff">首页</h3>
        </div>
        <div class="r-content">
            <el-dropdown trigger="click" size="mini">
                <span>
                    <img :src="uerImg" class="user">
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="height: 32px;padding-top:5px;color: #0099ff">个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="onExit" style="height: 32px;padding-top:5px;color: #0099ff;">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>        
    </header>
</template>

<script>
export default {
    name:'CommonHeader',
    data() {
        return {
            uerImg: require('../assets/images/user.png')
        }
    },
    methods:{
        onExit() {
            console.log('exittttttt');
            // this.$message({
            //     message: '居中的文字',
            //     center: true,
            //     type: 'error',
            //     duration: 10000
            // });
            this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //sessionStorage.removeItem("token")
                localStorage.removeItem("userdata");
                //this.$router.push('/login')
                this.$router.replace({path: this.redirect || '/login' })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        }
    }

}
</script>
<style lang="less" scoped>
header {
    height:100%;
    display: flex;
    justify-content: space-between;
    align-items:center;
}
.l-content{
    display: flex;
    align-items:center;    
    .el-button{
        margin-right:20px;
    }
}
.r-content{
    .user{
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}
</style>