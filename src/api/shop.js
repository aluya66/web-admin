import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 查询门店列表
 * @param {*}
 */
export const queryShopList = params =>
  Http.fetch(`${context}/api/shop/queryshoplist`, params, {
    method: 'get'
  })

/**
 * 新增门店
 * @param {*}
 */
export const addShop = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'post'
  })

/**
 * 编辑门店
 * @param {*}
 */
export const editShop = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'put'
  })

/**
 * 删除门店
 * @param {*}
 */
export const deleteShop = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'delete'
  })

/**
 * 查看门店详情
 * @param {*}
 */
export const queryShopDetail = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'get'
  })

/**
 * 查询商户列表
 * @param {*}
 */
export const queryBusinessList = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'get'
  })

/**
 * 新增商户
 * @param {*}
 */
export const addBusiness = params =>
  Http.fetch(`${context}/api/business/saveBusiness`, params, {
    method: 'post'
  })

/**
 * 编辑商户
 * @param {*}
 */
export const editBusiness = params =>
  Http.fetch(`${context}/api/business/updatebusiness`, params, {
    method: 'put'
  })

/**
 * 删除商户
 * @param {*}
 */
export const deleteBusiness = params =>
  Http.fetch(`${context}/api/business/deletebusiness`, params, {
    method: 'delete'
  })

/**
 * 查看商户详情
 * @param {*}
 */
export const queryBusinessDetail = params =>
  Http.fetch(`${context}/api/business/querybusinesspage`, params, {
    method: 'get'
  })
