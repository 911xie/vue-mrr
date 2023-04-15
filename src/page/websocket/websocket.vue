<template>

    <el-container class="layout-container">
        <el-header class="layout-header">
            <!-- Header -->
            <!-- <img :src="bannerImg" class="banner"> -->
        </el-header>
        <el-row class="layout-row" :style="bgStyle">
            <el-col class="elcol"></el-col>
            <el-col class="elcol elbg">
                <!-- <el-row style="background:#676767;height=100px">666</el-row> -->
                <el-row class="elbg">
                <el-main class="layout-page elbg">
                <Web-Socket></Web-Socket>
                </el-main>
                </el-row>
                <!-- <el-row>666</el-row> -->
            </el-col>
            <el-col class="elcol"></el-col>
        </el-row>
        <el-footer class="layout-footer"><!-- Footer --></el-footer>
	</el-container>
</template>
<script>
import WebSocket from '../../components/WebSocket.vue'
import * as dateUtils from "../../utils/date"; 
export default {
	name: 'wsDemo',
	// 3.定义组件标签
	components: {
		WebSocket,
	},
	data() {
		return {
            //bannerImg: require('../../assets/images/water.jpeg')
            bgImgUrl:require('../../assets/images/background/11sky.jpeg'),// 背景图片的地址
            bgImgUrlList:[
                '01design.jpeg',
                '02doll.jpeg',
                '03flower.jpeg',
                '07microcity.jpeg',
                '08money.jpeg',
                '09office.jpg',
                '12wall.jpeg',
                '13ring.jpeg',
                '14waterdrop.jpeg',
                '15sign.jpeg',
                '16cartoon.jpeg',
                '17wenli.jpeg',
                '18chahua.jpeg',
                '19jiequ.jpeg',
                '20lvyou.jpeg',
                '21jiequ.jpeg',
                '22yujie.jpeg',
                '23fugu.jpeg',
                '24fugu.jpeg',
                '25fugu.jpeg',
                '26jiequ.jpeg',
                '27sheji.jpeg',
                '28shatan.jpeg',
                '29jiaju.jpeg',
                '30daosui.jpeg',
                '31jinrong.jpeg',
                '32dafeidou.jpeg',
                '33zhenzhu.jpeg',
                '34meishi.jpeg',
                '35yejing.jpeg',
                '36penzai.jpeg',
                '37qingchun.jpeg',
                '38qiutian.jpeg',
                '39shengdanka.jpeg',
                '40yumao.jpeg',
                '41sheji.jpeg',
                '42aixin.jpeg',
                '43chengshi.jpeg',
                '04fresh.jpg',
                '11sky.jpeg',
                '10simple.jpeg',
                '05fresh1.jpeg',
                '06fresh2.jpg',
                '44chengshi.jpeg',
                '45shouhui.jpeg',
                '46jiejing.jpeg',
                '47qingxin.jpeg',
                '48fugu.jpeg',
                '49shouhui.jpeg',
                '50luwei.jpeg',
                '51nvren.jpeg',
                '52heiban.jpeg',
            ]
        }
	},
    methods: {
        getBgImg(n) {
            return require('../../assets/images/background/'+this.bgImgUrlList[n]);
        },
    },
    created () {
        document.title = '微应用Web平台·调达·对账';

        let that = this;
        let data = {};
        this.$axios({
            method: 'post', 
            url: '/api/common/getbglist', 
            data
        }).then(function(resp){
            console.log(JSON.stringify(resp.data));
            if (resp.data.list.length > 0) {
                console.log("length:" + resp.data.list.length);

                that.bgImgUrlList = resp.data.list;

                let nCount = 0;
                let timer = setInterval(() => {
                    let myDate = new Date()
                    let wk = myDate.getDay()
                    
                    let len = that.bgImgUrlList.length;
                    console.log('IntervalIntervalInterval = ' + wk + ',' + len);
                    //if (wk == 1) 
                    {
                        //this.changeBackground(nCount % 18)  
                        //let num = nCount % len; 
                        let num = dateUtils.getWeekNum() % len ;
                        console.log('IntervalIntervalInterval num= ' + num + ','+that.bgImgUrlList[num]);
                        that.bgImgUrl = that.getBgImg(num);
                        nCount++;
                    }
                }, 5 * 1000)
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
    computed:{
        bgStyle(){
            return {
                backgroundImage: 'url(' + this.bgImgUrl + ')'
            }
        }
    }
}

</script>

<style lang="less" scoped>
.layout-container {
    width: 100%;
    height: 100%;
    //background: #ffffff;
    //background-image: url('../../assets/images/water.jpeg');
}
.layout-header {
    width: 80%;  
    height: 500px;
    //background-image: url('../../assets/images/teck.jpeg');
}

// .layout-page {
//     -webkit-border-radius: 5px;
//     border-radius: 5px;
//     //上-右-下-左
//     margin: 180px auto;
//     //height: 600px;
//     width: 600px;
//     padding: 35px 35px 15px;
//     background: #fff;
//     border: 0px solid #eaeaea;
//     box-shadow: 0 0 25px #cac6c6;
// }
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
    //background: #f077f0;
    //background-image: linear-gradient(to bottom right, #f077f0, #2088dd);
    //background-image: url('../../assets/images/sky.jpeg');
    //background-image: url('../../assets/images/fresh.jpg');
    //background-image: url('../../assets/images/money.jpeg');
}
.elcol {
    width:33.33%;
    //background: #f077f0;
}

label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}

.elbg {
    // background-color: rgba(116, 210, 73, 0.02);
    background-color: rgba(255, 255, 255, 0.1);
}


</style>