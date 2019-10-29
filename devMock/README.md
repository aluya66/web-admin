# 一个接口对应一个json文件，mock开发数据

- 配置`.env.development`文件中的mock开关，为`true`时开启mock数据功能，配置后需重启服务

````
	VUE_APP_MOCKFLAG = true
````

- 在`devMock/data`下面添加本地`mockFile`文件，例如`goods-list.json`

- api接口请求配置中添加`mockFile`文件名称，例如
````
	export const getList = params => Http.fetch(`${context}/v1/goods/list`, params, {
		method: 'get',
		mockFile: 'goods-list'
	})
````
