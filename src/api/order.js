import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 查询订单列表
 * @param {*}
 */
export const queryOrderList = params =>
  Http.fetch(`${context}/api/order/list`, params, {
    method: 'get'
  })

/**
 * 查询订单列表统计信息
 * @param {*}
 */
export const queryOrderInfo = params =>
  Http.fetch(`${context}/api/order/datacount`, params, {
    method: 'get'
  })

/**
 * 查看订单详情
 * @param {*}
 */
export const queryOrderDetail = params =>
  Http.fetch(`${context}/api/order/info`, params, {
    method: 'get'
  })

/**
 * 查询订单收货信息
 * @param {*}
 */
export const queryAddressInfo = params =>
  Http.fetch(`${context}/api/order/address`, params, {
    method: 'get'
  })

/**
 * 发货订单列表
 * @param {*}
 */
export const queryDeliveryList = params =>
  Http.fetch(`${context}/api/order/delivery`, params, {
    method: 'get'
  })

/**
 * 获取vip会员订单列表
 * @param {*}
 */
export const queryVipList = params =>
  Http.fetch(`${context}/api/order/vip`, params, {
    method: 'get'
  })

/**
 * 退款订单列表
 * @param {*}
 */
export const queryRefundList = params =>
  Http.fetch(`${context}/api/order/refund`, params, {
    method: 'get'
  })
