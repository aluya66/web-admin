import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_PAY

// 支付列表
export const getPay = params =>
  Http.fetch(`${context}/api/payrecode/querypayrecodepage`, params, {
    method: 'get',
    mockFile: 'pay-list'
  })

// 账户列表
export const getAccount = params =>
  Http.fetch(`${context}/api/payaccount/querypayaccountpage`, params, {
    method: 'get',
    mockFile: 'account-list'
  })

// 账户列表启用
export const startAccount = params =>
  Http.fetch(`${context}/api/payaccount/effectpayaccount`, params, {
    method: 'put',
    mockFile: 'account-start'
  })

// 账户禁用
export const forbiddenAccount = params =>
  Http.fetch(`${context}/api/payaccount/abatepayaccount`, params, {
    method: 'put',
    mockFile: 'account-forbidden'
  })

/**
 * 渠道类型枚举
  */
export const getFindchannelType = params =>
  Http.fetch(`${context}/api/paychannel/findchannelcode`, params, {
    method: 'get',
    mockFile: 'paychannel-type'
  })

/**
 * 渠道列表
 */
export const getPaychannel = params =>
  Http.fetch(`${context}/api/paychannel/querypaychannelpage`, params, {
    method: 'get',
    mockFile: 'paychannel-list'
  })

/**
 * 渠道启用
 */
export const paychannelStart = params =>
  Http.fetch(`${context}/api/paychannel/effectpaychannel`, params, {
    method: 'put',
    mockFile: 'paychannel-start'
  })

/**
 * 渠道禁用
 */
export const paychannelForbidden = params =>
  Http.fetch(`${context}/api/paychannel/abatepaychannel`, params, {
    method: 'put',
    mockFile: 'paychannel-forbidden'
  })
