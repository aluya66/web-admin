import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roleList = store.getters && store.getters.roleList

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roleList.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      if (!value && !(value instanceof Array)) {
        throw new Error(`need roles! Like v-permission="['admin','editor']"`)
      }
    }
  }
}
