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
