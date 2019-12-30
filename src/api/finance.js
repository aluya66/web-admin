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

/**
 * 结算管理-结算单列表查询
 * @param {*}
 */
export const queryBusinessSettlePage = params =>
  Http.fetch(`${context}/api/businesssettle/querybusinesssettlepage`, params, {
    method: 'get'
  })

/**
 * 结算管理-查询结算开始日期
 * @param {*}
 */
export const querySettleDate = params =>
  Http.fetch(`${context}/api/businesssettle/queryshopsettledate`, params, {
    method: 'get'
  })

/**
 * 结算管理-匹配订单数据
 * @param {*}
 */
export const matchingOrder = params =>
  Http.fetch(`${context}/api/businesssettle/matchingorder`, params, {
    method: 'post'
  })

/**
 * 结算管理-提交结算、审核商家结算、关闭订单
 * @param {*}
 */
export const financialSettle = params =>
  Http.fetch(`${context}/api/businesssettle/financialsettle`, params, {
    method: 'put'
  })

/**
 * 结算管理-查询结算单详情
 * @param {*}
 */
export const queryBusinessSettleDetail = params =>
  Http.fetch(`${context}/api/businesssettle/querybusinesssettledetail`, params, {
    method: 'get'
  })

/**
 * 结算管理-查询加盟商户结算明细列表
 * @param {*}
 */
export const queryBusinessSettleDetailPage = params =>
  Http.fetch(`${context}/api/businesssettle/querybusinesssettledetailpage`, params, {
    method: 'get'
  })

/**
 * 结算管理-新增加盟商户结算付款信息
 * @param {*}
 */
export const savePaymentLog = params =>
  Http.fetch(`${context}/api/businesssettle/savepaymentlog`, params, {
    method: 'post'
  })

/**
 * 结算管理-删除加盟商户结算付款信息
 * @param {*}
 */
export const deletePaymentLog = params =>
  Http.fetch(`${context}/api/businesssettle/deletepaymentlog`, params, {
    method: 'delete'
  })

/**
 * 结算管理-查询加盟商户结算付款信息
 * @param {*}
 */
export const queryBusinessSettlePaymentLogPage = params =>
  Http.fetch(`${context}/api/businesssettle/querybusinesssettlepaymentlogpage`, params, {
    method: 'get'
  })

/**
 * 结算管理-打款完成
 * @param {*}
 */
export const financialFinishPay = params =>
  Http.fetch(`${context}/api/businesssettle/financialfinishpay`, params, {
    method: 'put'
  })

/**
 * 结算管理-查询操作日志
 * @param {*}
 */
export const querySettleOperateLog = params =>
  Http.fetch(`${context}/api/businesssettle/querybusinesssettleoperatelogpage`, params, {
    method: 'get'
  })
