import point from './point'

const install = function(Vue) {
  Vue.directive('point', point)
}

if (window.Vue) {
  window['point'] = point
  Vue.use(install); // eslint-disable-line
}

point.install = install
export default point
