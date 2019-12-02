import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 支付列表
export const getPay = params =>
  Http.fetch(`${context}/api/pcs/recode/list`, params, {
    method: 'get',
    mockFile: 'pay-list'
  })

// 账户列表
export const getAccount = params =>
  Http.fetch(`${context}/api/pcs/account/list`, params, {
    method: 'get',
    mockFile: 'account-list'
  })

// 账户列表启用
export const startAccount = params =>
  Http.fetch(`${context}/api/pcs/account/effect`, params, {
    method: 'put',
    mockFile: 'account-start'
  })

// 账户禁用
export const forbiddenAccount = params =>
  Http.fetch(`${context}/api/pcs/account/abate`, params, {
    method: 'put',
    mockFile: 'account-forbidden'
  })

/**
 * 渠道列表
 */
export const getPaychannel = params =>
  Http.fetch(`${context}/api/pcs/channel/list`, params, {
    method: 'get',
    mockFile: 'paychannel-list'
  })

/**
 * 渠道启用
 */
export const paychannelStart = params =>
  Http.fetch(`${context}/api/pcs/channel/effect`, params, {
    method: 'put',
    mockFile: 'paychannel-start'
  })

/**
 * 渠道禁用
 */
export const paychannelForbidden = params =>
  Http.fetch(`${context}/api/pcs/channel/abate`, params, {
    method: 'put',
    mockFile: 'paychannel-forbidden'
  })
