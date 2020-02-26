import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON
// VUE_APP_CONSOLE_COMMON VUE_APP_CONSOLE_LOCALHOST

// 店铺 风格
export const getShopStyle = params =>
  Http.fetch(`${context}/api/shop/styles`, params, {
    method: 'get'
  })

// 店铺列表
export const getShopList = params =>
  Http.fetch(`${context}/api/shop/list`, params, {
    method: 'get'
  })

// 店铺详情
export const getShopDetail = params =>
  Http.fetch(`${context}/api/shop/detail`, params, {
    method: 'get'
  })

// 店铺 新增
export const addShop = params =>
  Http.fetch(`${context}/api/shop`, params, {
    method: 'post'
  })

// 店铺 编辑
export const editShop = params =>
  Http.fetch(`${context}/api/shop`, params, {
    method: 'put'
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
 * 查询商户列表
 * @param {*}
 */
export const queryBusinessList = params =>
  Http.fetch(`${context}/api/business/querybusinesspage`, params, {
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

// 根据渠道查询商品列表
export const getGoodsListByChannel = params =>
  Http.fetch(`${context}/api/business/goods/list`, params, {
    method: 'post'
  })

// 根据渠道查询店铺列表
export const getShopListByChannel = params =>
  Http.fetch(`${context}/api/channel/shoplist`, params, {
    method: 'get'
  })

// 渠道新增关联价格类型
export const addChannelPrice = params =>
  Http.fetch(`${context}/api/channel/addprice`, params, {
    method: 'post'
  })

// 查询渠道关联价格信息类型
export const queryChannelPrice = params =>
  Http.fetch(`${context}/api/channelprice`, params, {
    method: 'get'
  })

/**
* @param {*} 门店渠道列表
*/
export const getShopChannel = params =>
  Http.fetch(`${context}/api/open/channel/list`, params, {
    method: 'get'
  })

/**
* @param {*} 获取关联商户
*/
export const getBusiness = params =>
  Http.fetch(`${context}/api/business/querypage`, params, {
    method: 'get'
  })
