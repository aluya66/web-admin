## 自定义组件编码及使用规范,含全局加载

### 1、组件目录文件说明
- 组件目录`xx`包含`xx组件、index、README`三个文件
    - xx.vue 组件文件
    - index.js 导出文件
    - README.md 组件说明文件

### 2、组件文件命名

-  `components`里面组件的目录名称与组件名称一致，如：

```
    - components
        - demo
            - demo.vue

```

### 4、组件使用

> 在业务中导入方式

- 引用`components`多组件

``` js
    import components from 'components';
    const { CDemo, CButton } = components;

    // 注册组件
    components: {
        CDemo,
        CButton
    }
```
- 引用单个组件

```js
    import CDemo from 'components/demo';

    // 注册组件
    components: {
        CDemo
    }
```

> 在业务中使用方式，例如`demo`

```
    <template>
        <c-demo>test</c-demo>
    </template>
```
