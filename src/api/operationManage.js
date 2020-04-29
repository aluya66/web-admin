import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 查询意向单列表
 * @param {*}
 */
export const queryIntentionList = params =>
  Http.fetch(`${context}/api/intention/list`, params, {
    method: 'get'
  })

/**
 * 更新意向单
 * @param {*}
 */
export const updateIntention = params =>
  Http.fetch(`${context}/api/intention/update`, params, {
    method: 'post'
  })

/**
 * 查询意向单详情
 * @param {*}
 */
export const queryIntentionDetail = params =>
  Http.fetch(`${context}/api/intention/detail`, params, {
    method: 'get'
  })
