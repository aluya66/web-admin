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
  Http.fetch(`${context}/api/channel/list`, params, {
    method: 'get',
    mockFile: 'channel-list'
  })

/**
 * 新增、编辑渠道
 * @param {*} params, put编辑 post新增 
 */
export const handleChannel = (params, method = 'post') =>
  Http.fetch(`${context}/api/channel`, params, {
    method,
    mockFile: 'channel-add'
  })


// 渠道开启、关闭
export const handleChannelStatus = params =>
  Http.fetch(`${context}/api/channel/stopopen`, params, {
    method: 'put'
  })

// 渠道删除
export const deleteChannel = params =>
  Http.fetch(`${context}/api/channel`, params, {
    method: 'delete',
    mockFile: 'channel-detele'
  })

/**
 * @param {*} 渠道规则列表
 */
export const getChannelRule = params =>
  Http.fetch(`${context}/api/rule/list`, params, {
    method: 'get',
    mockFile: 'channel-rule'
  })
