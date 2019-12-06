import utils from 'utils'
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    el.onclick = function() {
      document.documentElement.scrollTop = utils.getEle(value).offsetTop
    }
  }
}
