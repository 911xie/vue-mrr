const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	//设置是否在开发环境下每次保存代码时都启用 eslint验证
	lintOnSave: false,
	devServer: {
		port: 8080,
		proxy:{
			//api是后端数据接口的路径
			'api':{
				//后端数据接口的地址
				target:'http://localhost:8082',
				//允许跨域
				changeOrigin:true,
				//调用时用api替代根路径
				pathRewrite:{
					'^/api':''
				}
			},
			'validate': {
				target: 'http://192.168.121.57:8000',
				changeOrigin: true,
				pathRewrite:{
					'^/validate':''
				}
			},
			'postoee': {
				target: 'http://192.168.137.145/iot-api/v1/value',
				changeOrigin: true,
				pathRewrite:{
					'^/postoee':''
				}				
			},	
			'chatgpt': {
				target: 'https://api.chatgpt.com/api/chat',
				changeOrigin: true,
				pathRewrite:{
					'^/chatgpt':''
				}				
			},					
		}
	},
	//如果不加以下，就报：The following entrypoint(s) combined asset size exceeds the recommended
	configureWebpack: {
		// provide the app's title in webpack's name field, so that
		// it can be accessed in index.html to inject the correct title.
		performance: {
			maxEntrypointSize: 10000000,
			maxAssetSize: 20000000,
			assetFilter: function(assetFilename) {
				return assetFilename.endsWith('.js');
			}
		}
	},
})