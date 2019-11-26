import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 店铺列表
export const getOrder = params =>
  Http.fetch(`${context}/api/order/page`, params, {
    method: 'get',
    mockFile: 'order-list'
  })
