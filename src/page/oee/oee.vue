<template>
    <div>
        <el-row style="height:20px"></el-row>
        <el-row style="display:flex;align-items: center;justify-content: center;">
            <el-col style="width:10%"></el-col>
            <el-col style="display:flex;align-items: center;justify-content: center;">
                <el-card style="width:100%;height:150px">
                    <el-row style="height:5px"></el-row>
                    <el-row style="">
                        <el-col style="width:20%;display:flex;align-items: center;justify-content: left;">
                            <!-- <el-input style="width:80%;" placeholder="请输入设备id" v-model="edtDevID" clearable></el-input> -->
<!--
                            <a-input-search style="width:92%;" placeholder="请输入设备id" v-model:value="edtDevID" @search="getcode">
                                <a-button slot="enterButton">获取Code</a-button>
                            </a-input-search>
-->   
                            <div style="width:92%;display:flex;align-items: center;justify-content: left;">
                            <el-autocomplete class="elauto"
                                :popper-append-to-body="true"
                                v-model="edtDevID"
                                :fetch-suggestions="queryInputAsync"
                                placeholder="请输入设备ID"
                                style="width: 100%"
                                @focus="devIDFocus">
                            </el-autocomplete>
                            <!-- icon="el-icon-s-finance" -->
                            <el-button class='btnGetcode' type="primary"  @click="getcode">
                                获取Code
                            </el-button>
                            </div>
                           
                        </el-col>
                        <el-col style="width:12%;display:flex;align-items: center;justify-content: center;" >
                            <a-select style="width:100%;" placeholder="选择Code" class="aselect" v-model:value="code" :options="codeOptions" @change="handleChange"/>
                        </el-col>
                        <el-col style="width:8%;display:flex;align-items: center;justify-content: center;"  >
                            <el-input style="width:80%;" placeholder="请输入操作值" v-model="edtValue" clearable></el-input>
                        </el-col>
                        <el-col style="width:15%;display:flex;align-items: center;justify-content: center;" >
                            <!-- <el-date-picker v-model="time" type="datetime" placeholder="选择日期时间" default-time="08:00:00"
                            value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>             -->
                            <a-date-picker
                                class="rangepicker"
                                v-model="time"
                                format="YYYY-MM-DD HH:mm:ss"
                                :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                valueFormat="YYYY-MM-DD HH:mm:ss" 
                            />                            
                        </el-col> 
                        <el-col style="width:10%;background:#fff;display:flex;align-items: center;justify-content: space-around;" >
                            <el-button type="success" style="width:110px" @click="postdata" icon="el-icon-alarm-clock">提  交</el-button>
                            <!-- <el-button type="primary" style="width:110px" @click="qrydata(0)" icon="el-icon-coffee-cup">查  询</el-button> -->
                        </el-col>
                    </el-row>
                    <el-row style="height:20px"></el-row>
                    <el-row style="height:40px">
                        <el-col style="width:30%;background:#fff;display:flex;align-items: center;justify-content: space-around;" >
                            <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" :placeholder="['Start Time', 'End Time']"
                            style="width:100%;" v-model:value="dateRange" class="rangepicker">
                                <template #suffixIcon>
                                    <i class="iconfont icon-riqi" ></i>
                                </template>
                            </a-range-picker>
                            
                        </el-col> 
                        <el-col style="width:10%;background:#fff;display:flex;align-items: center;justify-content: space-around;" >
                            <el-button type="primary" style="width:110px" @click="qrydata(0)" icon="el-icon-coffee-cup">查  询</el-button>
                        </el-col> 
                        <el-col style="width:60%;display:flex;align-items: center;justify-content: right;">
                            <a-select style="width:12%;" placeholder="" class="aselect" v-model:value="nPerPage" :options="pageOptions" @change="perpageChange"/>    
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                layout="prev, pager, next"
                                :page-size="nPerPage"
                                :total="nTotal">
                            </el-pagination> 
                        </el-col>                        
                    </el-row>
                </el-card>
            </el-col>
            <el-col style="width:10%"></el-col>
        </el-row>
        <el-row style="height:10px"></el-row>
        <!-- <el-row style="display:flex;align-items: center;justify-content: center;">
            <el-col style="width:80%;display:flex;align-items: center;justify-content: right;">
                <a-select style="width:8%;" placeholder="" class="aselect" v-model:value="nPerPage" :options="pageOptions" @change="perpageChange"/>    
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :page-size="nPerPage"
                    :total="nTotal">
                </el-pagination> 
            </el-col>
        </el-row> -->
        <el-row style="display:flex;align-items: center;justify-content: center;">
            <el-col style="width:80%;display:flex;align-items: center;justify-content: center;">
                <el-table :data="tableData" style="width:80%;" :row-style="getRowStyle" :cell-style="{padding:'0px'}">
                    <el-table-column label="序号" prop="" type="index" align="center"/>
                    <el-table-column label="ID" prop="id" type="index" align="center" v-if="false"/>
                    <el-table-column label="设备ID" prop="value" sortable="custom" align="center" />
                    <el-table-column label="分类ID" prop="categoryid" sortable align="center"/>
                    <!-- <el-table-column label="CODE" prop="code" sortable align="center"/> -->
                    <el-table-column label="分类名称" prop="name" sortable align="center"/>
                    <el-table-column label="开始时间" prop="starttime" sortable align="center"/>
                    <el-table-column label="结束时间" prop="endtime" sortable align="center"/>
                    <el-table-column label="时长(分钟)" prop="duration" sortable align="center"/>                                     
                </el-table> 
            </el-col>
        </el-row> 
    </div>
</template>
<script>
import moment from 'moment';
export default {
    data() {
        return {
            moment: moment,
            tableData: [],
            edtDevID:'',//'L-G2-OTH-1201-01',//FT-20230328-001//L-G2-OTH-1201-01//'',
            edtValue: '1',
            time: '',
            codeOptions:[],
            code: undefined,   //绑定的Id值     undefined才会显示placeholder  

            pageOptions: [
                {
                    value: 10,
                    label: '每页10条', 
                },
                {
                    value: 20,
                    label: '每页20条', 
                },
                {
                    value: 30,
                    label: '每页30条', 
                },
            ],
            dateRange:[],

            // 分页
            nTotal: 0,
            nPage: 0, 
            nPerPage: 10, 

            elTableRowHeight: 40,

            devID: '',
        	devIDOftenList: [],
          
        };
    },
    created() {
        //this.time = new Date();
        this.time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        document.title = 'OEE';
        this.genDateRange();
    },
    methods: {
    	devIDFocus(){
            var r = window.localStorage.getItem('inputDevID');
            if(r != null){
                this.devIDOftenList = JSON.parse(r);
            }
        },
        queryInputAsync(queryString, cb) {
            var devIDOftenList = this.devIDOftenList;
            var results = queryString ? devIDOftenList.filter(this.createFilter(queryString)) : devIDOftenList;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 100 * Math.random());
        },
        //保存所填的内容到localStorage
        handleHistoryRecord(){
            var that = this;
            var list = JSON.parse(window.localStorage.getItem('inputDevID'));
            var newList = [];
            if(list != null){
                //去重
                newList = list.filter(function (item) {
                    return item.value != that.edtDevID;
                });
            }
            newList.unshift({value: that.edtDevID});//置于顶部
            if (newList.slice(0, 10)) {
                window.localStorage.setItem('inputDevID', JSON.stringify(newList.slice(0, 10)));
            }
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toString().toLowerCase().includes(queryString.toString().toLowerCase()) === true);
            };
        },  
        clearHistoryRecord() {
            window.localStorage.setItem('inputDevID','');
        },     

        // 动态调整el-table行高
        getRowStyle({row, rowIndex}) {
            let styleRes = {
                "height": this.elTableRowHeight+"px",
            }
            return styleRes
        },
        genDateRange () {
            //this.dateRange.push(this.$moment().startOf('month'));
            this.dateRange.push(this.$moment().startOf('day'));
            this.dateRange.push(this.$moment().endOf('day'));
        },        
        // 分页方法      
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.nPage = val - 1;
            console.log('currPage:', this.nPage);
            this.qrydata(0);
        },        
		changeSingleData () {
			console.log('ddddddddddddddddddddddd');
		},	    
        handleChange(value) {
            console.log('dropdown-list:'+value+','+this.code);
        },
        perpageChange(value) {
            this.nPerPage = value;
            this.qrydata(0);
        },        
        getcode() {
            let msg = this.edtDevID.trim() == '' ? '请输入设备id' : '';
            if (this.edtDevID.trim() == ''){
                this.$alert(msg, '提示', {
                    type:'error',
                    confirmButtonText: '确定',
                    callback: action => {
                        return;
                    }
                });                     
            }

            let that = this;
            let data = {
                "devID":this.edtDevID,
            };

            this.$axios({
                method: 'post', 
                url: '/api/common/getOeeCode',
                data
            }).then(function (resp) {
                console.log(resp);
                that.codeOptions = resp.data.data;
                if (that.codeOptions.length > 0){
                    that.code = that.codeOptions[0].value;
                }
                that.handleHistoryRecord();
            });
        },
        postdata() {
            let sTime = this.$moment(this.time).format('YYYY-MM-DDTHH:mm:ss.000+08:00');
            console.log('now time:' + sTime + ','+this.edtValue);
            
            let msg = this.edtDevID.trim() == '' ? '请输入设备id' : '';
            msg = this.code == undefined ? '请选择Code' : msg;
            msg = this.edtValue.trim() == '' ? '请输入操作值' : msg;
            msg = sTime.trim() == '' ? '请输入时间' : msg;
            if (this.edtDevID.trim() == '' || this.code == undefined 
            || this.edtValue.trim() == '' || sTime.trim() == ''){
                this.$alert(msg, '提示', {
                    type:'error',
                    confirmButtonText: '确定',
                    callback: action => {
                        return;
                    }
                });                     
            }

            //return;
            let that = this;
            let data = {
                "id":this.edtDevID,
                "time":sTime,//"2023-03-29T15:15:00.000+08:00",
                "items": [
                    {
                        "code":this.code, 
                        "value":this.edtValue, 
                        "time":sTime,//"2023-03-29T15:15:00.000+08:00",
                    }
                ]
            };

            console.log('data:' + JSON.stringify(data));
            this.$axios({
                method: 'post', 
                url: '/postoee',///postoee/iot-api/v1/value', 
                data
            }).then(function (resp) {
                console.log(resp);
                if (resp.data.code === "CREATED"){
                    that.$alert("操作成功！", '提示', {
						type:'success',
						confirmButtonText: '确定',
						callback: action => {
                            that.qrydata(1);
                        }
					});
                } 
                else {
                    that.$alert("操作失败！", '提示', {
						type:'error',
						confirmButtonText: '确定',
						callback: action => {}
					});                    
                }               
            });
        },

        qrydata(isPostIoT) {
            console.log('-------isPostIoT=' + String(isPostIoT));
            let start = this.$moment(this.time).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            let end = this.$moment(this.time).endOf('day').format('YYYY-MM-DD HH:mm:ss');

            if (isPostIoT == 0) {
                start = this.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
                end = this.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
            }
            console.log('now time:' + start+','+end);

            let that = this;
            let data = {
                "nPage":this.nPage, 
                "nPerPage":this.nPerPage,
                "devID":this.edtDevID,
                "startTime":start,
                "endTime":end,
            };

            this.$axios({
                method: 'post', 
                url: '/api/common/getOeeData',
                data
            }).then(function (resp) {
                console.log(resp);
                that.tableData = resp.data.data.aryData;
                for (let i = 0; i < that.tableData.length; i++) {
                    that.tableData[i].duration = (that.tableData[i].duration / 60000).toFixed(2);
                }
                that.nTotal = resp.data.data.nTotal;  
                that.nPage = resp.data.data.reqPage;   
            });
        },
    },
};
</script>

<style scoped>

:deep(.ant-input-search) .ant-input{
    height: 40px;
}

:deep(.ant-input-search) .ant-input-search-button{
    height: 40px;
    background:tomato;
    color: white;
}
.btnGetcode{
    height: 40px;
    background:tomato;
    color: white;   
    width:110px;
    border: none; 
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

:deep(.rangepicker) .ant-input{
    line-height: 30px;
    height: 40px;
}

.certain-search-item-count{
    line-height: 60px;
}

/* 配置el-autocomplete的弹出下拉div样式，需要先
让:popper-append-to-body="false" */
/* 
.elauto >>> li {
    line-height: 25px;
} 
*/
:deep(.elauto) li {
    line-height: 25px;
}

 /* ant-select-selection--single */

</style>