import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 店铺列表
export const getShopList = params =>
  Http.fetch(`${context}/api/shop/list`, params, {
    method: 'get'
  })

// 店铺详情
export const getShopDetail = params =>
  Http.fetch(`${context}/api/shop`, params, {
    method: 'get'
  })

/**
 * @param {*} 渠道列表
 */
export const getChannel = params =>
  Http.fetch(`${context}/v1/channel/list`, params, {
    method: 'get',
    mockFile: 'channel-list'
  })

// 新增渠道
export const addChannel = params =>
  Http.fetch(`${context}/v1/channel`, params, {
    method: 'post',
    mockFile: 'channel-add'
  })

// 修改渠道
export const updateChannel = params =>
  Http.fetch(`${context}/v1/channel`, params, {
    method: 'put',
    mockFile: 'channel-update'
  })

// 渠道删除
export const deleteChannel = params =>
  Http.fetch(`${context}/v1/channel`, params, {
    method: 'delete',
    mockFile: 'channel-detele'
  })

/**
 * @param {*} 渠道规则列表
 */
export const getChannelRule = params =>
  Http.fetch(`${context}/v1/rule/list`, params, {
    method: 'get',
    mockFile: 'channel-rule'
  })
