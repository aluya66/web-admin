import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COUPON

// 券规则列表
export const getCoupon = params =>
  Http.fetch(`${context}/v1/mks/coupon/user/list`, params, {
    method: 'get',
    mockFile: 'couponRule-list'
  })

// 券规则作废
export const unableCoupon = params =>
  Http.fetch(`${context}/v1/mks/coupon/rule/unable`, params, {
    method: 'get',
    mockFile: 'couponRule-unable'
  })
