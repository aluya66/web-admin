import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_MARKETING

// 券规则列表
export const getCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'get',
    mockFile: 'couponRule-list'
  })

// 券规则作废
export const unableCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/rule/unable`, params, {
    method: 'get',
    mockFile: 'couponRule-unable'
  })

// 劵列表
export const getCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'get',
    mockFile: 'coupon-list'
  })

// 劵新增
export const addCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'get',
    mockFile: 'coupon-add'
  })

// 劵列表 删除劵
export const deleteCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/delete`, params, {
    method: 'get',
    mockFile: 'coupon-delete'
  })

// 劵审核
export const applyCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/apply/opt`, params, {
    method: 'get',
    mockFile: 'coupon-verify'
  })

// 用户劵
export const userCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/aftersales`, params, {
    method: 'get',
    mockFile: 'coupon-user'
  })
