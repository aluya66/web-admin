import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON
// VUE_APP_LOCALHOST VUE_APP_CONSOLE_COMMON
// 添加商品
export const add = params =>
  Http.fetch(`${context}/api/goods`, params)

// 商品 修改商品为部分完善状态
export const setPartPerfectGoods = params =>
  Http.fetch(`${context}/api/goods/partperfect`, params, {
    method: 'put'
  })

// 商品 数据上传
export const exportGoods = params =>
  Http.fetch(`${context}/api/goods/export`, params, {
    method: 'get'
  })

// 商品 完善
export const setPerfectGoods = params =>
  Http.fetch(`${context}/api/goods/perfect`, params, {
    method: 'put'
  })
// 商品 编辑
export const editGoods = params =>
  Http.fetch(`${context}/api/goods/edit`, params, {
    method: 'put'
  })
// 商品已完善列表
export const getPerfectGoodsList = params =>
  Http.fetch(`${context}/api/goods/perfectlist`, params, {
    method: 'get'
  })

// 获取未完善商品 数量
export const getSampleGoodsSum = params =>
  Http.fetch(`${context}/api/goods/samplesum`, params, {
    method: 'get'
  })

// 商品未完善列表
export const getSampleGoodsList = params =>
  Http.fetch(`${context}/api/goods/samplelist`, params, {
    method: 'get'
  })

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

// 更新样衣
export const updateGoodsDetail = params =>
  Http.fetch(`${context}api/updatecloth`, params, {
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
