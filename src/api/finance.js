import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 查询商户列表
 * @param {*}
 */
export const queryShopList = params =>
  Http.fetch(`${context}/api/shopaccount/queryshopaccount`, params, {
    method: 'get'
  })

/**
 * 查询账户明细列表
 * @param {*}
 */
export const queryAccountList = params =>
  Http.fetch(`${context}/api/shopaccountdetail/queryshopaccountdetail`, params, {
    method: 'get'
  })

/**
 * 新增账户交易明细
 * @param {*}
 */
export const addAccountList = params =>
  Http.fetch(`${context}/api/shopaccountdetail/create`, params, {
    method: 'post'
  })

/**
 * 编辑交易明细
 * @param {*}
 */
export const editAccountList = params =>
  Http.fetch(`${context}/api/shopaccountdetail/update`, params, {
    method: 'put'
  })

/**
 * 删除交易明细
 * @param {*}
 */
export const deleteAccountList = params =>
  Http.fetch(`${context}/api/shopaccountdetail/delete`, params, {
    method: 'delete'
  })

/**
 * 用户提现列表
 * @param {*}
 */
export const queryUserExtractList = params =>
  Http.fetch(`${context}/api/userextractdetail/queryuserextractdetail`, params, {
    method: 'get'
  })

/**
 * 用户提现审核
 * @param {*}
 */
export const checkExtract = params =>
  Http.fetch(`${context}/api/userextractdetail/checkextract`, params, {
    method: 'put'
  })
