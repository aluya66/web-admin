import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON
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
 * 发货订单明细
 * @param {*}
 */
export const queryDeliveryDetail = params =>
  Http.fetch(`${context}/api/order/deliveryinfo`, params, {
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
  Http.fetch(`${context}/api/afterrefund/queryafterrefundpage`, params, {
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

/**
* 售后单详情
* @param {*}
*/
export const afterSalesDetail = params =>
  Http.fetch(`${context}/api/ass/detail`, params, {
    method: 'get'
  })

/**
* 售后单审核
* @param {*}
*/
export const approveAfterSales = params =>
  Http.fetch(`${context}/api/ass/approve`, params, {
    method: 'put'
  })

/**
* 售后费用设置列表
* @param {*}
*/
export const afterSalesCostSettingList = params =>
  Http.fetch(`${context}/api/afterset/queryaftersetpage`, params, {
    method: 'get'
  })

/**
* 售后费用设置 新增
* @param {*}
*/
export const afterSalesCostSettingCreate = params =>
  Http.fetch(`${context}/api/afterset/saveafterset`, params, {
    method: 'post'
  })

/**
* 售后费用设置 编辑
* @param {*}
*/
export const afterSalesCostSettingUpdate = params =>
  Http.fetch(`${context}/api/afterset/updateafterset`, params, {
    method: 'put'
  })

/**
* 售后费用设置 详情
* @param {*}
*/
export const getAfterSalesCostSettingDetails = params =>
  Http.fetch(`${context}/api/template/detail`, params, {
    method: 'get'
  })

/**
* 售后费用设置 删除
* @param {*}
*/
export const afterSalesCostSettingDelete = params =>
  Http.fetch(`${context}/api/afterset/deleteafterset`, params, {
    method: 'delete'
  })

/**
* 售后单: 导出excel
* @param {*}
*/
export const afterSalesExport = params =>
  Http.fetch(`${context}/api/ass/asexport`, params, {
    method: 'get'
  })

/**
* 退货单: 导出excel
* @param {*}
*/
export const reshipExport = params =>
  Http.fetch(`${context}/api/ass/roexport`, params, {
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })

/**
* 查询售后打款记录
* @param {*}
*/
export const getRefundFeeRecord = params =>
  Http.fetch(`${context}/api/afterrefundlog/queryafterrefundlogpage`, params, {
    method: 'get'
  })

/**
* 新增打款信息记录
* @param {*}
*/
export const createRefundRecord = params =>
  Http.fetch(`${context}/api/afterrefundlog/saveaafterrefundlog`, params, {
    method: 'post'
  })

/**
* 售后单: 更新售后单物流
* @param {*}
*/
export const updateRefundDelivery = params =>
  Http.fetch(`${context}/api/ass/delivery`, params, {
    method: 'post'
  })


  /**
* 订单: 导出excel
* @param {*}
*/
export const orderListExport = params =>
Http.fetch(`${context}/api/order/export`, params, {
  method: 'get'
})