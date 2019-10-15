/* eslint-disable import/extensions */
import Vue from 'vue'
// import registerComponent from './utils/libs/registerComponent'

// 临时过度
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

// 需要用到vuex时，打开
import store from './store'
import importI18n from './plugins/i18n'

// 加入公共的全局methods方法
import mixin from './views/mixins'

import './themes/styles/index.less' // global css
import './themes/icons'

import router from './routes'
import App from './App.vue'
import serviceApi from './api'
import View from './components/view'
Vue.use(View)

Vue.config.productionTip = false

// 全局注册自定义组件
// registerComponent(Vue)
Vue.use(iView)

Vue.mixin(mixin)
Vue.use(ElementUI, {
  locale
})

// 国际化支持
const i18n = importI18n(Vue)

const globalVue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    // 添加全局事件bus
    Vue.prototype.$api = serviceApi
    Vue.prototype.$msgTip = (message, type = 'success', duration = 1500) => {
      this.$message({
        message,
        type,
        duration
      })
    }
    Vue.prototype.$staticFile =
      process.env.NODE_ENV === 'production'
        ? `${process.env.VUE_APP_BASEURLPATH}${process.env.VUE_APP_STATICFILE}`
        : process.env.VUE_APP_STATICFILE
    Vue.prototype.$filePath =
      process.env.VUE_APP_imagePath || process.env.VUE_APP_serverUrl
  }
})

window.globalVue = globalVue
