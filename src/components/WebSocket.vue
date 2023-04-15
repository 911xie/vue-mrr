<template>
    <div class="layout-container">
        <!--overflow:hidden是禁止滚动条出现-->
        <el-col class="demo-ruleForm login-page" style="overflow:hidden">
            <el-row class = "elrow ">
                <el-col style="width:8%;">
                    <span class="iconfont icon-waibi-zijinchizhanghujixianechaxun" 
                    style="font-size:30px;color:#FF7F00;padding-top:-2px"></span>
                </el-col>
                <el-col style="width:34%;align-content: center;">
                    <!--如果没有行高，因为一个字体是26px，一个字体是30px，所以对不齐，
                    要把行高设到30px就可以自动居中而实现对齐-->
                    <span class="titlespan" style="line-height:40px">对账·供应商</span>
                </el-col>

                <el-col style="width:18%;">
                    <!-- el-input靠右用flex啥的没效，居然用text-align:right可以 -->
                    <el-input oninput="value = value.replace(/\D/g, '')" @keyup.native="onKeyUp" 
                        style="text-align:right;" class="inputLine" v-model="username" placeholder="担当番号"/>
                </el-col>
                <el-col style="width:10%;">
                    <el-tooltip content="连接服务器" placement="bottom" effect="light">
                        <el-button class="btnOrange" icon="el-icon-connection" circle 
                        @click.native="connect()" :disabled="cnntDisable"></el-button>
                    </el-tooltip>
                </el-col>
                <el-col style="width:20%;text-align:right;" v-show="isConn" >
                    <span style="vertical-align: middle;line-height:40px">{{name}}</span>
                </el-col>   
                <el-col style="width:10%;" v-show="isConn">
                    <el-avatar :src="avatarUrl" style="vertical-align: middle"></el-avatar>
                </el-col>             
            </el-row>

            <el-row class = "elrowbdline" style = "height:20px" >
            </el-row> 

            <el-row class = "elrow" >
                <el-radio-group class="elRadioGrp" v-model="tabPosition" style="margin-bottom: 30px;" @change="changeTab(tabPosition)">
                    <el-radio-button label="Domestic"><span class="iconfont icon-fl-renminbi"> 国内 </span></el-radio-button>
                    <el-radio-button label="Abroad"><span class="iconfont icon-meiyuan"> 国外 </span></el-radio-button>
                </el-radio-group>
            </el-row>    

            <el-row class = "elrow" >
                <!-- <el-date-picker style="width:480px" v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
                <a-range-picker style="width:100%;" :locale="locale" size='large' v-model:value="dateRange">
                    <template #suffixIcon>
                        <i class="iconfont icon-riqi" ></i>
                    </template>
                </a-range-picker>
            </el-row>
            <el-row class = "elrow" style="display:flex;">
                <!-- <el-col><el-input v-model="toriCode" placeholder="物料类别"></el-input></el-col> -->
                <a-select class="aselect" v-model:value="material" :options="materialOptions" @change="handleChange"/>
                <a-select class="aselect" v-model:value="factory" :options="factoryOptions" @change="handleChange"/>
                <!-- <el-col><el-input v-model="toriCode" placeholder="工厂别"></el-input></el-col> -->
                <el-col><el-input v-model="toriCode" placeholder="供应商"></el-input></el-col>
            </el-row>
            <el-row class = "elrow">
                <span class="prgspan" v-show="isShow" :style="{'--fontColor': fontColor}">{{progressMsg}}</span>
                <el-progress :percentage="percentage" :color="customColors" v-show="isShow"></el-progress>
            </el-row>
            <el-row class = "btnrow"><!--type="primary"type="success"type="danger" -->
                <el-button class="elbtn" @click="sendDataToServer(1)" icon="el-icon-coffee-cup" :disabled="btnDisable[0]">生成xls</el-button>
                <el-button class="elbtn" @click="sendDataToServer(2)" icon="el-icon-message" :disabled="btnDisable[1]">转pdf发送</el-button>
                <el-button class="elbtn" @click="sendDataToServer(3)" icon="el-icon-delete" :style="{display:visibleBtn}" :disabled="btnDisable[2]">清空文件</el-button>
                <!-- <el-dropdown @command="handleCommand" :style="{display:visibleDrop}" class="eldropbtn">
                    <el-button type="primary">
                    更多操作 <i class="el-icon-arrow-down el-icon--left"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item></el-dropdown-item>
                    <el-dropdown-item command="a" icon="el-icon-delete">清空文件</el-dropdown-item>
                    <el-dropdown-item command="b" icon="el-icon-box">清除发送状态</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->

                <a-dropdown :style="{display:visibleDrop}" placement="bottomRight" :disabled="btnDisable[2]">
                    <a-menu slot="overlay" @click="handleMenuClick">
                        <a-menu-item key="1"> <a-icon type="delete" />清空文件 </a-menu-item>
                        <a-menu-item key="2"> <a-icon type="codepen" />清除发送状态 </a-menu-item>
                    </a-menu>
                    <a-button class="dropbtn"> 更多操作 <a-icon type="down-circle" /> </a-button>
                </a-dropdown>
            </el-row>
        </el-col>
    </div>
</template>

<script>
import * as dateUtils from "../utils/date"; 
import locale from 'ant-design-vue/es/locale/zh_CN'; 
//import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import female from '@/assets/images/girl64.png' //woman96.png'
import male from '@/assets/images/boy64.png' //man96.png'
export default {
    name: "WebSocket",
    data() {
        return {
            // ws是否启动
            wsIsRun: false,
            // 定义ws对象
            webSocket: null,
            // ws请求链接（类似于ws后台地址）
            ws: '',
            // ws定时器
            wsTimer: null,
            
            percentage: 0,
            progressMsg: "",
            customColors: [
                {color: '#f56c6c', percentage: 20},
                {color: '#e6a23c', percentage: 40},
                {color: '#5cb87a', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#6f7ad3', percentage: 100}
            ], 

            // startDate: '2022-08-05',
            // endDate: '2022-08-15',
            progressnum: 0,
            svrIsRun: false,
            toriCode: "",
            dateRange:[],
            materialOptions:[
                {
                    value: '11',
                    label: '物料类别（11）',
                },                
                {
                    value: '15',
                    label: '物料类别（15）',
                },                
                {
                    value: '17',
                    label: '物料类别（17）',
                },                
                {
                    value: 'ALL',
                    label: '物料类别（ALL）',
                },                
            ],
            material:"ALL",   //绑定的Id值     undefined才会显示placeholder
            factoryOptions:[
                {
                    value: '01',
                    label: '南屏工厂（01）',
                },                
                {
                    value: '02',
                    label: '龙山工厂（02）',
                },                
                {
                    value: 'ALL',
                    label: '全部工厂（ALL）',
                },                
            ],
            factory:"ALL",   //绑定的Id值     undefined才会显示placeholder
            
            isShow: false,
            fontColor: '#f56c6c',

            btnDisable:[true, true, true],
            cnntDisable: true,
            billsType: 'Domestic',//'Abroad',//
            tabPosition: 'Domestic',
            title:'对账·国内',
            locale,
            username:'',
            avatarUrl: female,//'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            name:'',
            isConn : false,
            visibleBtn: '',   //显示
            visibleDrop: 'none'  //隐藏
        }
    },
    async mounted() {
        this.wsIsRun = true;
        //this.wsInit();
        this.genDateRange();
        // this.startDate = '2022-04-01';
        // this.endDate = '2022-04-30'
        // this.dateRange = ['2022-04-01', '2022-04-30']
        this.changeTab('Domestic');
    },
    methods: {
        handleMenuClick(e) {
            console.log(e.key);
            this.sendDataToServer(e.key==1 ? 3: 4);
        },
        handleCommand(command) {
            //this.$message('click on item ' + command);
            let nCmd = command == 'a' ? 3 : 4;
            this.sendDataToServer(nCmd);
        },
        handleChange(value) {
            console.log('dropdown-list:'+value+','+this.material);
        },
        genDateRange () {
            // var date = new Date();
            // var year = date.getFullYear();
            // date.setDate(1);
            // var month = date.getMonth() + 1
            // var day = date.getDate()
            // month = month < 10 ? '0' + month : month;
            // day = day < 10 ? '0' + day : day;
            //this.dateRange.push(year + '-' + month + '-' + day);
            //this.dateRange.push(this.$moment(year + '-' + month + '-' + day, 'YYYY-MM-DD'));
            this.dateRange.push(this.$moment().startOf('month'));
            this.dateRange.push(this.$moment());
        },
        changeTab(tabPosition) {
            this.title = tabPosition == 'Domestic' ? '对账·国内' : '对账·国外';
            if (tabPosition == 'Domestic'){
                this.visibleBtn = 'none';
                this.visibleDrop = '';
            }else {
                this.visibleBtn = '';
                this.visibleDrop = 'none';                
            }
            console.log(this.title);
        },
        onKeyUp:function(e){
            var keyCode = window.event? e.keyCode:e.which;
            console.log('onKeyUp', keyCode, e, this.username, this.username.length);
            if (this.username.length >= 6){
                if (keyCode == 13){
                    console.log('onKeyUp key: return');
                    this.connect();
                }
                this.cnntDisable = false;
            }
            else {
                this.cnntDisable = true;
                if (this.cnntDisable){
                    console.log('客户端主动断开');
                    this.wsDestroy();
                    this.btnDisable = [true, true, true];
                    this.isConn = false;
                }
            }
        },
        sendDataToServer(sendtype) {
            if (this.svrIsRun) {
                //throw Error('服务端数据正在生成中...');
                console.log('服务端数据正在生成中...return!!!');
                return;
            }
            console.log("current week is " + dateUtils.getWeekNum());
            
/*
            let beginDate = this.dateRange[0];
            let endDate = this.dateRange[1];

            if (typeof beginDate == 'object' && beginDate.constructor == Date) {
                console.info(beginDate + " 为日期类型！")
                beginDate = dateUtils.formatDate('yyyy-MM-dd', beginDate);
            }
            if (typeof endDate == 'object' && endDate.constructor == Date) {
                console.info(endDate + " 为日期类型！")
                endDate = dateUtils.formatDate('yyyy-MM-dd', endDate);
            }
*/
            let beginDate = this.dateRange[0].format('YYYY-MM-DD');
            let endDate = this.dateRange[1].format('YYYY-MM-DD');
            console.log('sendDataToServer...'+this.webSocket.readyState);
            if (this.webSocket.readyState === 1) {
                let sendMsg = "";
                let toriCode = this.toriCode == "" ? "ALL" : this.toriCode;
                if (sendtype == 1) {
                    //sendMsg = 'Bills|'+this.startDate+'|'+this.endDate + '|' + this.toriCode;
                    sendMsg = this.tabPosition + '|Bills|' + beginDate + '|' + endDate + '|' 
                    + toriCode + '|' + this.material + '|' + this.factory;                    
                }
                else if (sendtype == 2) {
                    sendMsg = this.tabPosition + '|TransPDFandSend|' + toriCode;
                }
                else if (sendtype == 3) {
                    sendMsg = this.tabPosition + '|Clean|' + toriCode;
                    this.isShow = false;
                }
                else if (sendtype == 4) {
                    sendMsg = this.tabPosition + '|CleanSendFlag|' + toriCode;
                    this.isShow = false;
                }
                console.log('sendContent...['+sendMsg+']');
                this.webSocket.send(sendMsg);
            } else {
                throw Error('服务未连接')
            }
        },
        connect() {
            let that = this;
            let data = {"empcode":this.username};
            this.$axios({
                method: 'post', 
                url: '/validate/service/qryUser', 
                data
            }).then(function(resp){
                console.log(JSON.stringify(resp.data));
                if (resp.data.data.length > 0) {
                    console.log("length:"+resp.data.data.length);
                    that.name = resp.data.data[0].empname;
                    that.avatarUrl = resp.data.data[0].sex == '男' ? male:female;
                    that.isConn = true;
                    that.wsInit();
                }
                else {
                    that.$alert(resp.data.message, '提示', {
                        type:'error',
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                }
            });
        },
        /**
         * 初始化ws
         */
        wsInit() {
            console.log("wsInit username" + this.username);
            //const wsuri = 'ws://localhost:8082/bills/'+this.username;
            const wsuri = 'ws://192.168.121.57:8082/bills/'+this.username;
            this.ws = wsuri
            if (!this.wsIsRun) return
            // 销毁ws
            this.wsDestroy();
            // 初始化ws
            this.webSocket = new WebSocket(this.ws)
            // ws连接建立时触发
            this.webSocket.addEventListener('open', this.wsOpenHanler)
            // ws服务端给客户端推送消息
            this.webSocket.addEventListener('message', this.wsMessageHanler)
            // ws通信发生错误时触发
            this.webSocket.addEventListener('error', this.wsErrorHanler)
            // ws关闭时触发
            this.webSocket.addEventListener('close', this.wsCloseHanler)

            // 检查ws连接状态,readyState值为0表示尚未连接，1表示建立连接，2正在关闭连接，3已经关闭或无法打开
            clearInterval(this.wsTimer)
            this.wsTimer = setInterval(() => {
                if (this.webSocket.readyState === 1) {
                    clearInterval(this.wsTimer)
                } else {
                    console.log('ws建立连接失败1')
                    this.btnDisable = [true, true, true];
                    this.wsInit()
                }
            }, 3000)
        },
        wsOpenHanler(event) {
            console.log('ws建立连接成功');
            this.btnDisable = [false, false, false];
        },
        wsMessageHanler(e) {
            console.log('wsMessageHanler')
            console.log(e);
            let str = e.data.split("|");
            if (str[0] == 'SYN') {
                let pos = parseInt(str[1]);
                pos = isNaN(pos) ? 0 : pos;
                this.progressMsg = str[2];
                this.percentage = pos;   
                this.isShow = true;
                if (pos < 20) this.fontColor = '#f56c6c';
                else if (pos < 40) this.fontColor = '#e6a23c';
                else if (pos < 60) this.fontColor = '#5cb87a';
                else if (pos < 80) this.fontColor = '#1989fa';
                else this.fontColor = '#6f7ad3';
                console.log("pos=" + pos +",fontColor="+this.fontColor);
                this.svrIsRun = true;             
            }
            else if (str[0] == 'FIN') {
                this.svrIsRun = false; 

                let msg = '';
                if (str[1] == 'XLS')
                    msg = '已生成期间所有供应商对账数据';
                else if (str[1] == '2PDF')
                    msg = '已转PDF并发送邮件';
                else if (str[1] == 'CLN')
                    msg = '已清空临时文件';
                else if (str[1] == 'CLNSENDFLAG')
                    msg = '已清除发送状态';
                else if (str[1] == 'SEND1')
                    msg = '所有供应商已发送，如想再次发送请先清除发送标志或清除文件';

                this.$alert(msg, '提示', {
                    type:'success',
                    confirmButtonText: '确定',
                    //center:true,
                    callback: action => {}
                });
            }
            else if (str[0] == 'ERR') {
                this.svrIsRun = false; 
                this.$alert(str[1], '提示', {
                    type:'error',
                    confirmButtonText: '确定',
                    callback: action => {}
                });
            }

            //const redata = JSON.parse(e.data)
            //console.log(redata)
        },
        /**
         * ws通信发生错误
         */
        wsErrorHanler(event) {
            console.log(event, '通信发生错误')
            this.wsInit()
        },
        /**
         * ws关闭
         */
        wsCloseHanler(event) {
            console.log(event, 'ws关闭')
            this.wsInit()
        },
        /**
         * 销毁ws
         */
        wsDestroy() {
            if (this.webSocket !== null) {
                this.webSocket.removeEventListener('open', this.wsOpenHanler);
                this.webSocket.removeEventListener('message', this.wsMessageHanler);
                this.webSocket.removeEventListener('error', this.wsErrorHanler);
                this.webSocket.removeEventListener('close', this.wsCloseHanler);
                this.webSocket.close();
                this.webSocket = null;
                clearInterval(this.wsTimer);
            }
        },
    }
}
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
}

.elrow {
    height: 50px;
    /* 固定宽度，避免控件自适应宽度跑到下一行 */
    width: 520px;
}

:deep(.el-input) .el-input__inner {
    background-color: rgba(255, 255, 255, 1);/*rgba(5, 170, 160, 0.1);rgba(66, 255, 255, 0.1);*/
}

.btnrow {
    height: 50px;
    /* 固定宽度，避免控件自适应宽度跑到下一行 */
    width: 520px;
    display: flex;
    flex-wrap: wrap;
	justify-content: space-between;
}

.titlespan{
    font-size:26px;
    font-weight:600;
    line-height:30px;
    /* color:#FF7F00; */
    background-image: linear-gradient(to  bottom, #FF7F00, #FF7F00, #FF7F00);
    background-clip: text;
    color: transparent;
}
.elrowbdline{
    border-top: 2px solid;
    /* border-image: linear-gradient(to right, #FF7F00, #FFF68F) 1; */
    border-image: linear-gradient(to right, #FF7F00, #FF7F00) 1;
}

.prgspan{
    /* color:blue; */
    color: var(--fontColor) !important;
    font-weight:bold;
    font-size: 12px;
}
.elbtn{
    width:128px;
    height:40px;
}

:deep(.eldropbtn) .el-button{
    width:128px;
    height:40px;    
}

.dropbtn{
    margin-left: 8px;
    height:40px;
    width:130px;
}

.elRadioGrp {
    width: 300px;
    display: flex;
    background: rgba(5, 170, 160, 0.1);/*rgba(219, 112, 147, 0.1);rgba(142, 56, 142, 0.1);*/
    border-radius: 5px;
}

:deep(.elRadioGrp) .el-radio-button .el-radio-button__inner {
    width: 150px;
    border-radius: 5px;
    background: transparent;
    color: #78828d;
    box-sizing: border-box;
    border: none;
    
    /* 解决el-radio-button点击时出现蓝色阴影边框 */
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}

:deep(.elRadioGrp) .is-active .el-radio-button__inner {
    border-radius: 5px;
    background-color:rgba(5, 170, 160, 1);/*rgba(142, 56, 142, 1);rgba(219, 112, 147, 1); #8E388E; #05AAA0;*/
    color: #fff;
}

:deep(.inputLine) .el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 0px;

    /*border: 0px; 上右下左 */
    border-width:0px 0px 1px 0px;
    width: 100%;
}
:deep(.inputLine) .el-input__inner:focus{
    border-color:#FF7F00;
}
:deep(.inputLine) .el-input__inner {
    background-color: rgba(255, 255, 255, 0);/*rgba(5, 170, 160, 0.1);rgba(66, 255, 255, 0.1);*/
}

.btnOrange {
    background: #FF7F00; 
    border-radius: 4px; 
    width: 100%;
    border: 0px;
    color: #FFFFFF;
}

.btnOrange:disabled {
    background:#CCCCCC;
}

.aselect{
    width:100%;
}
:deep(.aselect) .ant-select-selection{
    height: 40px;
}
:deep(.aselect) .ant-select-selection__rendered{
    margin-top: 4px;
}
:deep(.aselect) .ant-select-selection-selected-value{ 
    display: block; 
    opacity: 1;
    font-size: 14px;
}

</style>