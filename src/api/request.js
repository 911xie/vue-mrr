//request.js
import axios from "axios";
import qs from "qs";

import configg from '../config'
import ElementUI from 'element-ui';
const baseUrl = process.env.NODE_DEV === 'development'?configg.baseUrl.dev:configg.baseUrl.pro;

/****** 创建axios实例 ******/
const service = axios.create({
    baseURL: baseUrl,//process.env.BASE_URL,  // api的base_url
    timeout: 5000  // 请求超时时间
});

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
    // app.$vux.loading.show({
    //     text: '数据加载中……'
    // });
    console.log('6666666url '+config.url);
    // config.method === 'post'
    //     ? config.data = qs.stringify({...config.data})
    //     : config.params = {...config.params};
    console.log('6666666 '+config.data);

    //config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    console.log('inininin '+JSON.stringify(userdata));
    if (userdata != null && userdata.token != null ) {
        config.headers['token'] = userdata.token;
    }
    
    return config;
}, error => {  //请求错误处理
    // app.$vux.toast.show({
    //     type: 'warn',
    //     text: error
    // });
    Promise.reject(error)
});

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
    response => {  //成功请求到数据
        // app.$vux.loading.hide();

        console.log('77777777 '+ JSON.stringify(response));
        console.log('88888888 '+ response.status+','+response.data.code+','+response.data.msg);
        //这里根据后端提供的数据进行对应的处理
        if (response.data.code === 0) {
            console.log('9999999999 ok');
            return response.data;
        } else if(response.data.code === 1002){
            //app.$router.replace({path: this.redirect || '/login' });  
            window.location.href = "/login"; 
        } else if(response.data.code === 1003){
            ElementUI.Message({
                message: response.data.msg,
                center: true,
                type: 'error',
                duration: 10000
            });
            //window.location.href = "/login";                 
        } else {
            // app.$vux.toast.show({  //常规错误处理
            //     type: 'warn',
            //     text: response.data.data.msg
            // });
            console.log(response.data.code);
        }
    },
    error => {  //响应错误处理
        console.log('error111');
        console.log(error);
        console.log(JSON.stringify(error));
        if (error.response.status==500) {
            // 清除掉，否则报500后每次都跳转不到登录页面
            localStorage.removeItem("userdata");
            ElementUI.Message({
                message: '服务端异常',
                center: true,
                type: 'error',
                duration: 10000
            });
        }
 
        return Promise.reject(error)
    }
);

export default service;