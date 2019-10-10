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

> 见`.env.development & .env.production` 配置项

- 注意：
    - 本地服务端口
    - 代理数量（默认只代理一个，需要更多，修改`vue.config.js`中的`proxy`配置项）
    - 接口服务地址
    - 路由模式（基于nginx服务时，正式部署时以history模式，开发阶段以hash）

## 3、开发构建

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

## 4、服务部署
> nginx 部署

- 1、在工程根目录中,将`dist`目录下文件部署在`nginx`服务器`html`目录下.

- 2、配置`nginx`代理
```
	location /dm-admin {
		try_files $uri $uri/ /dm-admin/index.html;
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

## 5、相关参考

- 组件编码规范
- See [Configuration Reference](https://cli.vuejs.org/config/).
