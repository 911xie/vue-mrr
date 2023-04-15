//request.js
import axios from "axios";
import qs from "qs";

import configg from '../config'
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
    config.method === 'post'
        ? config.data = qs.stringify({...config.data})
        : config.params = {...config.params};
    console.log('6666666 '+config.data);

    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    //config.headers['Content-Type'] = 'application/json';
 
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

        console.log('77777777 '+JSON.stringify(response));
        console.log('88888888 '+response.status+','+response.data.code+','+response.data.msg);
        //这里根据后端提供的数据进行对应的处理
        if (response.data.code === 0) {
            return response.data;
        } else {
            // app.$vux.toast.show({  //常规错误处理
            //     type: 'warn',
            //     text: response.data.data.msg
            // });
        }
    },
    error => {  //响应错误处理
        console.log('error');
        console.log(error);
        console.log(JSON.stringify(error));
 
        let text = JSON.parse(JSON.stringify(error)).response.status === 404
            ? '404'
            : '网络异常，请重试';
        // app.$vux.toast.show({
        //     type: 'warn',
        //     text: text
        // });
 
        return Promise.reject(error)
    }
);

export default service;