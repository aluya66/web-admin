import Http from '../utils/request'

const context = process.env.VUE_APP_LOCALHOST
// VUE_APP_LOCALHOST VUE_APP_CONSOLE_COMMON
// 添加商品
export const add = params =>
  Http.fetch(`${context}/api/goods`, params)

// 商品中心
export const getList = params =>
  Http.fetch(`${context}/api/goods/list`, params, {
    method: 'get'
  })

// 未完善商品列表 接口
export const getGoodsList = params =>
  Http.fetch(`${context}/api/samplegoods/list`, params, {
    method: 'get'
  })

// 【详情】 商品中心详情
export const getDetail = params =>
  Http.fetch(`${context}/api/goods`, params, {
    method: 'get'
  })

// 商品中心详情修改
export const updateDetail = params =>
  Http.fetch(`${context}/api/goods`, params, {
    method: 'put'
  })

// 查询商品sku列表
export const getSku = params =>
  Http.fetch(`${context}/api/sku/list`, params, {
    method: 'get'
  })

// 商品中心详情修改
export const deleteSku = params =>
  Http.fetch(`${context}/api/sku`, params, {
    method: 'detele'
  })

// 商品日志
export const getOperator = params =>
  Http.fetch(`${context}/api/operator/list`, params, {
    method: 'get'
  })

// 商品快照
export const getSnapshot = params =>
  Http.fetch(`${context}/api/snapshot/list`, params, {
    method: 'get'
  })

// 商品快照详情
export const getSnapshotDetail = params =>
  Http.fetch(`${context}/api/snapshot`, params, {
    method: 'get'
  })
