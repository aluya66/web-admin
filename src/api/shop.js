import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_SHOP

// 店铺列表
export const getShopList = params =>
  Http.fetch(`${context}/v1/shop/list`, params, {
    method: 'get'
  })

// 店铺详情
export const getShopDetail = params =>
  Http.fetch(`${context}/v1/shop`, params, {
    method: 'get',
    joinUrl: '/'
  })
