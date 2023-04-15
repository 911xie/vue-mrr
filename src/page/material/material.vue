<template>
    <div style="background:#fff">
        <el-row style="height:20px"></el-row>
        <el-row style="display:flex;align-items: center;justify-content: center;">
            <el-col style="width:10%"></el-col>
            <el-col style="display:flex;align-items: center;justify-content: center;">
                <el-card style="width:100%;height:170px">
                    <el-row style="height:5px"></el-row>
                    <el-row style="">
                        <el-col style="width:80%;display:flex;align-items: center;justify-content: left;"> 
                            <span class="spantitle"><i class="el-icon-menu"/> 制品使用材料 · 履历查询 <i class="el-icon-menu el-icon--right"/></span>                           
                        </el-col>
                    </el-row>
                    <el-row style="height:10px"></el-row>
                    <el-row style="height:25px">
                        <div class="splitline"></div>
                    </el-row>
                    <el-row style="height:40px">
                        <el-col style="width:13%;background:#fff;display:flex;align-items: center;justify-content: left;" >
                            <div style="width:96%;display:flex;align-items: center;justify-content: left;">
                                <el-autocomplete class="elauto"
                                    :popper-append-to-body="true"
                                    v-model="edtLotNo"
                                    :fetch-suggestions="queryInputAsync"
                                    placeholder="请输入LotNo"
                                    style="width: 100%"
                                    @focus="LotNoFocus">
                                </el-autocomplete>
                            </div>
                        </el-col>
                        <el-col style="width:10%;background:#fff;display:flex;align-items: center;justify-content: left;" >
                            <div style="width:96%;display:flex;align-items: center;justify-content: left;">
                                <a-date-picker
                                    class="rangepicker"
                                    v-model="staticDate"
                                    format="YYYY-MM-DD"
                                    valueFormat="YYYY-MM-DD" 
                                />
                            </div>
                        </el-col>                        
                        <el-col style="width:10%;background:#fff;display:flex;align-items: center;justify-content: left;" >
                            <el-button class='btnGetData' type="primary"  @click="getData" icon="el-icon-search">
                                检索
                            </el-button>
                        </el-col> 

                        <el-col style="width:47%;background:#fff;display:flex;align-items: center;justify-content: right;" >
                            <span class="spanstatics">{{lotNo}}</span>
                        </el-col>
                        <el-col style="width:20%;background:#fff;display:flex;align-items: center;justify-content: right;" >
                            <!-- <span class="spanstatics">{{pm}}</span> -->
                            <span class="spanstatics">{{today}}</span>
                        </el-col>

                        <!-- <el-col style="width:40%;display:flex;align-items: center;justify-content: right;">
                            <a-select style="width:20%;" placeholder="" class="aselect" v-model:value="nPerPage" :options="pageOptions" @change="perpageChange"/>    
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                layout="prev, pager, next"
                                :page-size="nPerPage"
                                :total="nTotal">
                            </el-pagination> 
                        </el-col>                         -->
                    </el-row>
                </el-card>
            </el-col>
            <el-col style="width:10%"></el-col>
        </el-row>
        <el-row style="height:10px"></el-row>

<!-- BXPKNO,BXTJYN,BXKOTE,C.EBNAME,BXZAIR,B.POPART,BXLOTE,
D.T1FDNO,E.JPSLOT,BXBASY,BXKQTY,BXTANI,BXCPDT,BXSAGY -->

        <el-row style="display:flex;align-items: center;justify-content: center;">
            <el-col style="width:80%;display:flex;align-items: center;justify-content: center;">
                <el-table :data="tableData" style="width:100%;" :row-style="getRowStyle" :cell-style="{padding:'0px'}">
                    <el-table-column label="序号" prop="" type="index" align="center" width="50"/>
                    <el-table-column label="制番LOT" prop="BXPKNO" align="center" v-if="false"/>
                    <el-table-column label="品目" prop="BXHMCD" sortable="custom" v-if="true" align="center" />
                    <el-table-column label="工序" prop="BXTJYN" align="center" width="60"/>
                    <el-table-column label="工程" prop="BXKOTE" align="center" width="70"/>
                    <el-table-column label="工程名称" prop="EBNAME" align="center"/>
                    <el-table-column label="材料代码" prop="BXZAIR" align="center"/>
                    <el-table-column label="P*" prop="POPART" align="center" width="50"/>
                    <el-table-column label="照合LOT" prop="BXLOTE" align="center"/>
                    <!-- <el-table-column label="FEEDER" prop="T1FDNO" align="center"/>
                    <el-table-column label="槽号" prop="JPSLOT" align="center" width="70"/> -->
                    <el-table-column label="保管场所" prop="BXBASY" align="center"/> 
                    <el-table-column label="照合数量" prop="BXKQTY" sortable align="center" width="100"/> 
                    <el-table-column label="单位" prop="BXTANI" align="center" width="50"/> 
                    <!-- <el-table-column label="日期" prop="BXCPDT" sortable align="center" width="90"/> 
                    <el-table-column label="时间" prop="BXCPTM" align="center" width="70"/> -->
                    <el-table-column label="时间" prop="CREATEDATE" sortable align="center" width="150"/> 
                    <el-table-column label="担当" prop="BXSAGY" align="center" width="70"/>  
                    <template slot="empty">
                        <el-empty :image-size="200"></el-empty>
                    </template>        
                </el-table> 
            </el-col>
        </el-row> 
        <el-row style="height:10px"></el-row>
        <el-row style="display:flex;align-items: center;justify-content: center;">
            <el-col style="width:80%;display:flex;align-items: center;justify-content: right;">
                <a-select style="width:10%;" placeholder="" class="aselect" v-model:value="nPerPage" :options="pageOptions" @change="perpageChange"/>    
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="->,prev, pager, next"
                    :page-size="nPerPage"
                    :total="nTotal">
                </el-pagination>                 
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
            edtLotNo:'',//'L-G2-OTH-1201-01',//FT-20230328-001//L-G2-OTH-1201-01//'',
            edtValue: '1',

            lotNo: '制番LOT：',
            pm: '品目：',
            today: '照合时间：',

            staticDate: '',
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
        	historyList: [],
        };
    },
    created() {
        //this.time = new Date();
        this.staticDate = moment(new Date()).startOf('month').format("YYYY-MM-DD");
        document.title = 'Material';
        this.genDateRange();
    },
    mounted() {
        this.timer = setInterval(()=>{
            this.today = '照合时间：' + moment(new Date()).format("YYYY-MM-DD");
        }, 10*1000);
    },
    methods: {
    	LotNoFocus(){
            var r = window.localStorage.getItem('inputLotNo');
            if(r != null){
                this.historyList = JSON.parse(r);
            }
        },
        queryInputAsync(queryString, cb) {
            var historyList = this.historyList;
            var results = queryString ? historyList.filter(this.createFilter(queryString)) : historyList;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 100 * Math.random());
        },
        //保存所填的内容到localStorage
        handleHistoryRecord(){
            var that = this;
            var list = JSON.parse(window.localStorage.getItem('inputLotNo'));
            var newList = [];
            if(list != null){
                //去重
                newList = list.filter(function (item) {
                    return item.value != that.edtLotNo;
                });
            }
            newList.unshift({value: that.edtLotNo});//置于顶部
            if (newList.slice(0, 10)) {
                window.localStorage.setItem('inputLotNo', JSON.stringify(newList.slice(0, 10)));
            }
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toString().toLowerCase().includes(queryString.toString().toLowerCase()) === true);
            };
        },  
        clearHistoryRecord() {
            window.localStorage.setItem('inputLotNo','');
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
            this.getData();
        },        
		changeSingleData () {
			console.log('ddddddddddddddddddddddd');
		},	    
        handleChange(value) {
            console.log('dropdown-list:'+value+','+this.code);
        },
        perpageChange(value) {
            this.nPerPage = value;
            this.getData();
        },        
        getData() {
            let starttime = this.$moment(this.staticDate).startOf('day').format('YYYYMMDD');
            console.log('static time:' + starttime);

            let msg = '';
            if (this.edtLotNo.trim() == ''){
                msg = '请输入Lot号';
            }

            const reg = /^[1-9]\d{10}$/;
            let value = this.edtLotNo.trim();
            if ((!reg.test(value)) && value != '') {
                msg = '请输入正确Lot号（11位数字）';
            } 

            if (msg.length>0){
                this.$alert(msg, '提示', {
                    type:'error',
                    confirmButtonText: '确定',
                    callback: action => {
                        return;
                    }
                });
                return;
            }
            
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            let that = this;
            let data = {
                "nPage":this.nPage, 
                "nPerPage":this.nPerPage,                
                "LotNo":this.edtLotNo.trim(), 
                "starttime":starttime,
            };

            this.$axios({
                method: 'post', 
                url: '/api/common/material',
                data
            }).then(function (resp) {
                console.log(resp);
                if (resp.status == 200){
                    if (resp.data.code == 0) {
                        that.tableData = resp.data.data.aryData;
                        
                        that.nTotal = resp.data.data.nTotal;  
                        that.nPage = resp.data.data.reqPage;  
                        that.lotNo = that.tableData.length > 0 ? '制番LOT：' + that.tableData[0].BXPKNO : '制番LOT：';
                        that.pm = that.tableData.length > 0 ? '品目：'+that.tableData[0].BXHMCD : '';
                        that.handleHistoryRecord();
                    }
                    else {
                        loading.close();
                        that.$alert(resp.data.msg, '提示', {
                            type:'error',
                            confirmButtonText: '确定',
                            callback: action => {
                                return;
                            }
                        });                        
                    }
                }

                loading.close();
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
.btnGetData{
    height: 40px;
    background:tomato;
    color: white;   
    width:110px;
    border: none; 
}

/* 边框渐变色 */
.splitline{
    border: 1px solid #1874CD; 
    /* border-image: linear-gradient(to right, #8f41e9, #578aef) 1; */
    border-image: linear-gradient(to right, #1874DD, #FFFFFF) 1;
}
.spantitle{
    font-size: 30px;
    font-weight: bold;
    line-height: 40px;   
    color:#1874CD; 
}
.spanstatics {
    font-size: 18px;
    font-weight: bold;
    line-height: 40px;   
    color:#20B2AA; 
    width: 250px;
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