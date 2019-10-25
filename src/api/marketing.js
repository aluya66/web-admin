import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_MARKETING

// 店铺列表
export const getCoupon = params =>
  Http.fetch(`${context}/v1/mks/coupon/user/list`, params, {
    method: 'get',
    mockFile: 'coupon-list'
  })
