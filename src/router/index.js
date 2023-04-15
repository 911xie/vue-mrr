import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'main',
        //component: Main,
        component: () => import('../page/Main.vue'),
        //重定向默认显示第一个children路由
        redirect:"/user",
        children: [
            {
                path:'/home',
                name: 'home',
                component: () => import('../page/home/home.vue')
            },
            {
                path:'/user',
                name: 'user',
                component: () => import('../page/user')
            },
            {
                path:'/dept',
                name: 'dept',
                component: () => import('../page/dept/dept.vue')
            },
            {
                path:'/reserve',
                name: 'reserve',
                component: () => import('../page/reserve/reserve.vue')
            },
            // {
            //     path:'/websocket',
            //     name: 'websocket',
            //     component: () => import('../page/websocket/websocket.vue')
            // },
            {
                path:'/page2',
                name: 'page2',
                component: () => import('../page/page2/page2.vue')
            },
            // {
            //     path:'/login',
            //     name: 'login',
            //     component: () => import('../page/login/login.vue')
            // },
        ]
    },
    {
        path:'/login',
        name: 'login',
        component: () => import('../page/login/login.vue')
    },
    {
        path:'/bills',
        name: 'bills',
        component: () => import('../page/websocket/websocket.vue')
    },
    {
        path:'/fileszip',
        name: 'fileszip',
        component: () => import('../page/fileszip/fileszip.vue')
    },
    {
        path:'/fileupdate',
        name: 'fileupdate',
        component: () => import('../page/fileupdate/fileupdate.vue')
    },
    {
        path:'/chart1',
        name: 'chart1',
        component: () => import('../page/chart/chart1.vue')
    },    
    {
        path:'/chart2',
        name: 'chart2',
        component: () => import('../page/chart/chart2.vue')
    },   
    {
        path:'/bar3d',
        name: 'bar3d',
        component: () => import('../page/chart/bar3d.vue')
    },  
    {
        path:'/pie3d',
        name: 'pie3d',
        component: () => import('../page/chart/pie3d.vue')
    },           
    {
        path:'/inventory',
        name: 'inventory',
        component: () => import('../page/chart/inventory.vue')
        //component: () => import('../page/chart/ops.vue')
    },    
    {
        path:'/chart2did',
        name: 'chart2did',
        component: () => import('../page/chart/chart2did.vue')
    },     
    {
        path:'/list2did',
        name: 'list2did',
        component: () => import('../page/chart/list2did.vue')
    },         
    {
        path:'/ops',
        name: 'ops',
        component: () => import('../page/chart/ops.vue')
    },     
    {
        path:'/oee',
        name: 'oee',
        component: () => import('../page/oee/oee.vue')
    },      
    {
        path:'/chatgpt',
        name: 'chatgpt',
        component: () => import('../page/chatgpt/chatgpt.vue')
    },  
    {
        path:'/material',
        name: 'material',
        component: () => import('../page/material/material.vue')
    },      
]

// 1.实例化
const router = new VueRouter({
    mode: 'history',
    routes
})

var exclude = [
    '/login',
    '/register',
    '/bills',
    '/fileszip',
    '/fileupdate',
    '/inventory',
    '/chart1',
    '/chart2',
    '/bar3d',
    '/pie3d',
    '/chart2did',
    '/list2did',
    '/ops',
    '/oee',
    '/chatgpt',
    '/material'
]

router.beforeEach((to, from, next)=>
{
    console.log('to.path...=['+ to.path +']');
    //登录及注册页面可以直接进入,而主页面需要分情况
    // if(to.path == '/bills' || to.path == '/fileszip' || to.path == '/fileupdate' || to.path == '/inventory'
    // || to.path == '/chart1' || to.path == '/chart2' || to.path == '/bar3d' || to.path == '/pie3d' ||
    // to.path == '/chart2did' || to.path == '/list2did' || to.path == '/ops') 
    if (exclude.indexOf(to.path) >= 0)
    {
        console.log('router.beforeEach...to.path=' + to.path + ', next()!');
        next();
    }
    else if(to.path == '/clean')
    {
        localStorage.removeItem("userdata");
    }    
    else
    {
        if(from.path == "/login")//从登录页面可以直接通过登录进入主页面
        {
            next();
        }
        else{
            //从/进入,如果登录状态是true，则直接next进入主页面
            //if(localStorage.s === "true")
            let userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log('3.router.beforeEach....... ');
            console.log('3.1.router.beforeEach....... ' +  JSON.stringify(userdata));
            if (userdata != null)
            {
                console.log('3.2.router.beforeEach...other '+ JSON.stringify(userdata))
                next();                
            }
            else {//如果登录状态是false，那么跳转至登录页面,需要登录才能进入主页面
                console.log('4.router.beforeEach...relogin ')
                next('/login');
                console.log("需要登录")
            }
        }
    }
})

// 2.暴露
export default router