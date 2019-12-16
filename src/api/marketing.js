import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 券规则 新增
export const addCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'post'
  })
// 券规则 详情
export const getCouponRuleDetail = params =>
  Http.fetch(`${context}/api/mks/coupon/detail`, params, {
    method: 'get'
  })

// 券规则 编辑
export const updateCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'put'
  })

// 券规则 列表
export const getCouponRuleList = params =>
  Http.fetch(`${context}/api/mks/coupon`, params, {
    method: 'get'
  })

// 券规则 删除
export const deleteCouponRule = params =>
  Http.fetch(`${context}/api/mks/coupon/delete`, params, {
    method: 'get'
  })

// 优惠券 列表
export const getCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'get',
    mockFile: 'coupon-list'
  })

// 优惠券 详情
export const couponDetail = params =>
  Http.fetch(`${context}/api/mks/coupon/rule/detail`, params, {
    method: 'get',
    mockFile: 'coupon-list'
  })

// 优惠券 新增
export const addCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'post',
    mockFile: 'coupon-add'
  })

// 优惠券 编辑
export const updateCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/rule`, params, {
    method: 'put'
  })

// 优惠券 删除
export const deleteCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/delete`, params, {
    method: 'put',
    mockFile: 'coupon-delete'
  })

// 优惠券 审核
export const applyCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/apply/opt`, params, {
    method: 'put',
    mockFile: 'coupon-verify'
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
  Http.fetch(`${context}/api/mks/activity/effect`, params, {
    method: 'put'
  })

// 星购卡列表
export const getStarGoCardList = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'get'
  })

// 星购卡 新增
export const addStarGoCard = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'post'
  })

// 星购卡 导出的列表
export const starGoCardExportList = params =>
  Http.fetch(`${context}/api/mks/coupon/card/report`, params, {
    method: 'get'
  })

// 星购卡 记录导出
export const exportStarGoCardRecord = params =>
  Http.fetch(`${context}/api/mks/coupon/card/store/report`, params, {
    method: 'get'
  })

// 星购卡 导出
export const exportStarGoCard = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'put'
  })

