import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_GOODS

// 商品中心
export const getGoodsList = params =>
  Http.fetch(`${context}/v1/goods/list`, params)

// 商品中心详情
export const getGoodsBnsDel = params =>
  Http.fetch(`${context}/v1/goods/goodsdetailbyid`, params)

// 商品中心详情修改
export const updateGoodsBnsDel = params =>
  Http.fetch(`${context}/v1/goods/update`, params)

// 商品日志
export const getGoodsoperator = params =>
  Http.fetch(`${context}/v1/goodsoperator/list`, params)

// 商品快照
export const getGoodssnapshot = params =>
  Http.fetch(`${context}/v1/goodssnapshot/list`, params)

// 商品快照
export const getGoodssnapshotDel = params =>
  Http.fetch(`${context}/v1/goodssnapshot/getbyid`, params)
