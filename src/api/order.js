import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 查询列表
 * @param {*}
 */
export const queryOrderList = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'get'
  })

/**
 * 新增
 * @param {*}
 */
export const addOrder = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'post'
  })

/**
 * 编辑
 * @param {*}
 */
export const editOrder = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'put'
  })

/**
 * 删除
 * @param {*}
 */
export const deleteOrder = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'delete'
  })

/**
 * 查看详情
 * @param {*}
 */
export const queryOrderDetail = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'get'
  })
