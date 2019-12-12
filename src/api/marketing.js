import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 新增券规则
export const addCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'post'
  })

// 新增券规则
export const updCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'put'
  })

// 券规则列表
export const getCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'get',
    mockFile: 'couponRule-list'
  })

// 查看券规则详情
export const getCouponRuleDetail = params =>
  Http.fetch(`${context}/api/mks/coupon/rule/detail`, params, {
    method: 'get'
  })

// 所有券规则
export const allCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon/rule/all`, params, {
    method: 'get'
  })

// 券规则作废
export const unableCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/rule/unable`, params, {
    method: 'put',
    mockFile: 'couponRule-unable'
  })

// 劵列表
export const getCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'get',
    mockFile: 'coupon-list'
  })

// 劵列表详情
export const couponDetail = params =>
  Http.fetch(`${context}/api/mks/coupon/detail`, params, {
    method: 'get',
    mockFile: 'coupon-list'
  })

// 劵新增
export const addCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'post',
    mockFile: 'coupon-add'
  })

// 劵编辑
export const updateCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'put'
  })

// 劵列表 删除劵
export const deleteCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/delete`, params, {
    method: 'put',
    mockFile: 'coupon-delete'
  })

// 劵审核
export const applyCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/apply/opt`, params, {
    method: 'put',
    mockFile: 'coupon-verify'
  })

// 用户劵
export const userCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/aftersales`, params, {
    method: 'get',
    mockFile: 'coupon-user'
  })

// 商品活动列表
export const getGoodsActivityList = params =>
  Http.fetch(`${context}/api/mks/activity/product`, params, {
    method: 'get'
  })

// 商品活动新增
export const addGoodsActivity = params =>
  Http.fetch(`${context}/api/mks/activity/product`, params, {
    method: 'post'
  })

// 商品活动编辑
export const updateGoodsActivity = params =>
  Http.fetch(`${context}/api/mks/activity/product`, params, {
    method: 'put'
  })

// 商品活动 删除
export const deleteGoodsActivity = params =>
  Http.fetch(`${context}/api/mks/activity/delete`, params, {
    method: 'put'
  })

// 商品活动 详情
export const getGoodsActivityDetail = params =>
  Http.fetch(`${context}/api/mks/activity/product/detail`, params, {
    method: 'get'
  })

// 商品活动 状态 禁用启用
export const changeGoodsActivityStatus = params =>
Http.fetch(`${context}/api/mks/activity/deatil/effect`, params, {
  method: 'put'
})
