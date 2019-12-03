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
 * @param {*} 渠道管理关联规则
 */
export const relevanceRuleAjax = params =>
  Http.fetch(`${context}/api/channel/join`, params, {
    method: 'post'
  })

/**
 * 新增渠道
 * @param {*} params
 */
export const addChannel = (params) =>
  Http.fetch(`${context}/api/channel`, params, {
    method: 'post',
    mockFile: 'channel-add'
  })

/**
 * 编辑渠道
 * @param {*} params
 */
export const editChannel = (params) =>
  Http.fetch(`${context}/api/channel`, params, {
    method: 'put'
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
 * 渠道规则列表
 * @param {*}
 */
export const getChannelRule = params =>
  Http.fetch(`${context}/api/rule/list`, params, {
    method: 'get',
    mockFile: 'channel-rule'
  })

/**
 * 渠道规则开启、关闭
 * @param {*}
 */
export const handleRuleStatus = params =>
  Http.fetch(`${context}/api/rule/stopopen`, params, {
    method: 'put'
  })

/**
 * 渠道规则删除
 * @param {*}
 */
export const deleteRule = params =>
  Http.fetch(`${context}/api/rule`, params, {
    method: 'delete'
  })

/**
 * 渠道规则新增
 * @param {*}
 */
export const addRule = params =>
  Http.fetch(`${context}/api/rule`, params, {
    method: 'post'
  })

/**
 * 渠道规则编辑
 * @param {*}
 */
export const editRule = params =>
  Http.fetch(`${context}/api/rule`, params, {
    method: 'put'
  })

/**
 * 渠道规则详情
 * @param {*}
 */
export const getRuleInfo = params =>
  Http.fetch(`${context}/api/rule/byid`, params, {
    method: 'get'
  })

/**
 * 品牌查询
 * @param {*}
 */
export const searchBrandAjax = params =>
  Http.fetch(`${context}/api/brand/querypage`, params, {
    method: 'get'
  })
