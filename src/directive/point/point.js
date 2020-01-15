import utils from 'utils'
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    el.onclick = function () {
      if (!utils.getEle(value)) return
      document.documentElement.scrollTop = utils.getEle(value).offsetTop
    }
  }
}
