import Vue from 'vue'
import App from './App.vue'

// 1.先引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/less/index.less'
import http from 'axios'
//导入图片库
//import "@/assets/iconfont-cdn/iconfont.css"
import "@/assets/iconfont-local/iconfont.css"

import './api/mock.js'
import router from './router'

// ant-design库
import {DatePicker,Select} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'
Vue.use(DatePicker);
Vue.use(Select);

import Antd from 'ant-design-vue';
Vue.use(Antd);

// moment库
import moment from "moment";
Vue.prototype.$moment = moment;

// import echartsGL from 'echarts-gl'会告警：
// warning  in ./src/main.js
// export 'default' (imported as 'echartsGL') was not found in 'echarts-gl' (module has no exports)
//import echartsGL from 'echarts-gl'
import * as echartsGL from 'echarts-gl'
Vue.prototype.$echartsGL = echartsGL

Vue.config.productionTip = false
// 2.vue注入全局
Vue.use(ElementUI)

//插件要全局引用可以用Vue.use,axios不是插件，要全局使用就用Vue.prototype绑定
//app.config.globalProperties.$axios=axios
Vue.prototype.$axios = http

// 挂载到$message上
Vue.prototype.$message = ElementUI.Message


import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')

