import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// const context = process.env.VUE_APP_CONSOLE_LOCALHOST
/**
 * 查询列表
 * @param {*}
 */
export const queryOperationList = params =>
  Http.fetch(`${context}/api/center/query`, params, {
    method: 'get'
  })

/**
 * 新增
 * @param {*}
 */
export const addOperation = params =>
  Http.fetch(`${context}/api/center/add`, params, {
    method: 'post'
  })

/**
 * 更新
 * @param {*}
 */
export const updateOperation = params =>
  Http.fetch(`${context}/api/center/update`, params, {
    method: 'put'
  })

/**
 * 删除
 * @param {*}
 */
export const deleteOperation = params =>
  Http.fetch(`${context}/api/center/delete`, params, {
    method: 'delete'
  })

/**
 * 查看详情
 * @param {*}
 */
export const queryOperationDetail = params =>
  Http.fetch(`${context}/api/center/detail`, params, {
    method: 'get'
  })
