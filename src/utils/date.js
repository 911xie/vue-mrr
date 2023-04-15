//import * as dateUtils from "../utils/date"; 
//beginDate = dateUtils.formatDate('yyyy-MM-dd hh:mm:ss', beginDate);
import moment from "moment";
export function formatDate(fmt, date) {
    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1,(date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o ={
        'M+': date.getMonth()+1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o){
        if(new RegExp(`(${k})`).test(fmt))
        {
            let str = o[k] + '';
            fmt=fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str))
        }
 
    }
    return fmt
}
function padLeftZero(str){
    return ('00' + str).substr(str.length)
}

export function getWeekNum() {
    //获得当前日期是第几周的方法
    var year = new Date().getFullYear();
    var week = moment(new Date()).format("E");//获得今天是星期几
    var startweek = moment(new Date(year + "-01-01")).format("E");//获得今年的1月1号是星期几
    //今天到1月1号的时间戳之差
    var millisDiff =
      new Date(moment().format("yyyy-MM-DD")).getTime() -
      new Date(year + "-01-01").getTime();
    var days =
      (millisDiff -
        week * (24 * 60 * 60 * 1000) -
        (7 - startweek) * (24 * 60 * 60 * 1000)) /
      86400000;
    return days / 7 + 2; 
    //这里加的2代表的是本周和今年1月1号所在的那一周
}