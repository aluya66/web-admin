# console-admin
 >中台管理系统，基于vue、vue-router、vuex、less、element-ui、axios构建技术解决方案

## 1、基础目录结构
```
├── devMock
├── plop-templates
├── public
├── server
└── src
    ├── api
    ├── components
    │   ├── SvgIcon
    │   └── View
    ├── demos
    ├── plugins
    │   └── i18n
    ├── routes
    ├── store
    ├── themes
    │   ├── icons
    │   ├── images
    │   └── styles
    ├── utils
    └── views
        ├── dashboard
        └── layout
```

## 2、项目配置

> 见`.env.*` 配置项，开发模式下只需配置`.env.development`

- 注意：
    - 本地服务端口`VUE_APP_PORT`
    - 代理数量（默认只代理一个，需要更多，修改`vue.config.js`中的`proxy`配置项）
    - 接口服务地址`VUE_APP_SERVERPATH_CONSOLE`

## 3、开发注意
- 所有表单页面，需在`data`数据中初始化必填字段
- 通用列表表格页面，基于`components/table`组件做页面开发

## 4、开发构建

- 安装依赖
```
	npm install
```

- 开发服务
```
	npm start

or

	npm run dev
```

- 语法检测
```
	npm run lint
```

- 打包生成部署包（需先执行依赖安装）.
```
	npm run build
```

## 5、服务部署
> nginx 部署

- 1、在工程根目录中,将`dist`目录下文件部署在`nginx`服务器`html`目录下.
- 2、配置`nginx`代理
```
	// 在VUE_APP_BASEURLPATH为/,VUE_APP_ROUTEMODEL为hash时，目前中台默认hash部署
	location ~ ^/(ysca-admin-web) {
		proxy_pass  http://gateway.yosar.develop  (中台网关地址)
	}

	location /api-ipx {
		proxy_pass  http://upms.yosar.develop/   （获取ipx菜单服务地址）
	}

	location /api-upload {
		proxy_pass  http://pillar-admin.yosar.develop/   （获取上传服务地址，不走网管）
	}

	// 在VUE_APP_BASEURLPATH为/console-admin,VUE_APP_ROUTEMODEL为history时，
	location /console-admin {
		try_files $uri $uri/ /console-admin/index.html;
	}

	location /api {
		proxy_pass  http://ip:port  /*线上框架后台服务域名及端口*/
	}
```

- 3、重启`nginx`
```
	nginx -s reload
```

> 自建node 服务部署，node版本8.11.0+

## 6、相关参考

- 组件编码规范
- See [Configuration Reference](https://cli.vuejs.org/config/).
