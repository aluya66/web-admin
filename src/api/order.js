import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_LOCALHOST
// VUE_APP_CONSOLE_LOCALHOST VUE_APP_CONSOLE_COMMON
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
 * 编辑订单收货信息
 * @param {*}
 */
export const editAddressInfo = params =>
  Http.fetch(`${context}/api/order/editaddress`, params, {
    method: 'put'
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
 * 取消订单
 * @param {*}
 */
export const cancelOrder = params =>
  Http.fetch(`${context}/api/order/cancel`, params, {
    method: 'put'
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

/**
 * 查询订单支付列表
 * @param {*}
 */
export const queryOrderpayList = params =>
  Http.fetch(`${context}/api/orderpay/list`, params, {
    method: 'get'
  })

/**
 * 查询订单备注
 * @param {*}
 */
export const queryOrderRemark = params =>
  Http.fetch(`${context}/api/order/remark`, params, {
    method: 'get'
  })

/**
 * 更新订单备注
 * @param {*}
 */
export const editOrderRemark = params =>
  Http.fetch(`${context}/api/order/getremark`, params, {
    method: 'put'
  })

/**
 * 商品销量统计
 * @param {*}
 */
export const queryGoodsStatistics = params =>
  Http.fetch(`${context}/api/commoditysales/statistics`, params, {
    method: 'get'
  })

/**
 * 分页查询订单商品
 * @param {*}
 */
export const queryGoodsList = params =>
  Http.fetch(`${context}/api/order/detail`, params, {
    method: 'get'
  })

/**
 * 查询订单详情信息
 * @param {*}
 */
export const queryShipDetail = params =>
  Http.fetch(`${context}/api/ship/detail`, params, {
    method: 'get'
  })

/**
 * 查询订单详情信息
 * @param {*}
 */
export const queryStargoList = params =>
  Http.fetch(`${context}/api/stargo/list`, params, {
    method: 'get'
  })

/**
* 查询售后单列表、退货单
* @param {*}
*/
export const queryAfterSalesList = params =>
  Http.fetch(`${context}/api/ass/list`, params, {
    method: 'get'
  })
