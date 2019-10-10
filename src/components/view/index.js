import View from './index.vue'

const install = function (Vue) {
  Vue.component(View.name, View)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}
