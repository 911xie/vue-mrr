import axios from "./axios";
import requestApi from "./request.js"
//api.js
import service from './request'
 
export const getPersonInfo = data => {
    return service({
        url: '/person_pay/getpersoninfo',
        method: 'post',
        data
    })
};

export const getMenu = (param) => {
    return axios.request({
        url:'/permission/getMenu',
        method:'post',
        data: param
    })
}

export const getData = () => {
    return axios.request({
        //mock拦截器里配置的路径
        url:'/home/getData',
    })
}

export const apiGetUserList = () => {
    console.log('llllllll');
    // return axios.request({
    //     url:'/api/user/findAll',
    // })
    return service({
        url: '/api/user/findAll',
        method: 'post',
    })
    // let data = {"a":"1"};
    // return service({
    //     url: '/api/user/getAll',
    //     method: 'post',
    //     data: data
    // })
}

export const apiUserAdd = (indata) => {
    //let data = indata; // 报错：no String-argument constructor/factory method to deserialize from String value ('type=0&userid=8&username=8&password=8&deptid=1&email=8');
    let data = JSON.parse(JSON.stringify(indata));
    return service({
        //url: '/api/user/addxForm',
        url: '/api/user/addUser',
        method: 'post',
        data
    })
}

export const apiGetUserById = (indata) => {
    let data = JSON.parse(JSON.stringify(indata));
    return service({
        url: '/api/user/getUserById',
        method: 'post',
        data
    })    
}

export const apiUserUpdate = (indata) => {
    let data = JSON.parse(JSON.stringify(indata));
    return service({
        url: '/api/user/update',
        method: 'post',
        data
    })   
}

export const apiUserDelete = (indata) => {
    let data = JSON.parse(JSON.stringify(indata));
    return service({
        url: '/api/user/delete',
        method: 'post',
        data
    })   
}

export const apiUserFuzzyQuery = (indata) => {
    let data = JSON.parse(JSON.stringify(indata));
    return service({
        url: '/api/user/fuzzyQuery',
        method: 'post',
        data
    })   
}

export const apiUserLogin = (indata) => {
    let data = JSON.parse(JSON.stringify(indata));
    return service({
        url: '/api/user/login',
        method: 'post',
        data
    })   
}

export const apiReserve = () => {
    return service({
        url: '/api/reserve/findAll',
        method: 'post',
    })   
}

export const apiDept = (indata) => {
    let data = JSON.parse(JSON.stringify(indata)); 
    return service({
        url: '/api/dept/findAll',
        method: 'post',
        data
    })   
}

export const updDept = (indata) => {
    let data = JSON.parse(JSON.stringify(indata)); 
    return service({
        url: '/api/dept/update',
        method: 'post',
        data
    })   
}

export const addDept = (indata) => {
    let data = JSON.parse(JSON.stringify(indata)); 
    return service({
        url: '/api/dept/add',
        method: 'post',
        data
    })   
}

export const delDept = (indata) => {
    let data = JSON.parse(JSON.stringify(indata)); 
    return service({
        url: '/api/dept/delete',
        method: 'post',
        data
    })   
}