import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_GOODS

// 添加商品
export const add = params =>
  Http.fetch(`${context}/v1/goods`, params)

// 商品中心
export const getList = params =>
  Http.fetch(`${context}/v1/goods/list`, params, {
    method: 'get',
    mockFile: 'goods-list'
  })

// 【详情】 商品中心详情
export const getDetail = params =>
  Http.fetch(`${context}/v1/goods`, params, {
    method: 'get',
    joinUrl: '/'
  })

// 商品中心详情修改
export const updateDetail = params =>
  Http.fetch(`${context}/v1/goods`, params, {
    method: 'put'
  })

// 查询商品sku列表
export const getSku = params =>
  Http.fetch(`${context}/v1/sku/list`, params, {
    method: 'get'
  })

// 商品中心详情修改
export const deleteSku = params =>
  Http.fetch(`${context}/v1/sku`, params, {
    method: 'detele'
  })

// 商品日志
export const getOperator = params =>
  Http.fetch(`${context}/v1/operator/list`, params, {
    method: 'get'
  })

// 商品快照
export const getSnapshot = params =>
  Http.fetch(`${context}/v1/snapshot/list`, params, {
    method: 'get'
  })

// 商品快照详情
export const getSnapshotDetail = params =>
  Http.fetch(`${context}/v1/snapshot`, params, {
    method: 'get',
    joinUrl: '/'
  })
