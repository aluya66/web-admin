import Http from '../utils/request'
import utils from 'utils'

console.log(utils)
const context = process.env.VUE_APP_IPX

/**
 * 获取菜单列表
 * @param {Object} params {parentId: 5}
 */
export const getMenuList = params => Http.fetch(`${context}/menu/list`, params, {
  token: utils.getUrlParam('token') || '',
  method: 'get'
})
