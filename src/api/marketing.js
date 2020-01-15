import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 优惠券明细列表
export const getTicketDetailsList = params =>
  Http.fetch(`${context}/api/mks/user/coupon`, params, {
    method: 'get'
  })

// 星购卡 充值列表
export const starGoCardRechargeList = params =>
  Http.fetch(`${context}/api/mks/user/card`, params, {
    method: 'get'
  })

// 优惠券明细 核销
export const writeOffTicket = params =>
  Http.fetch(`${context}/api/mks/user/coupon/writeoff`, params, {
    method: 'post'
  })

// 发放星go券
export const addCouponAboutStarGo = params =>
  Http.fetch(`${context}/api/mks/coupon/stargo`, params, {
    method: 'post'
  })

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
  Http.fetch(`${context}/api/mks/coupon/rule/delete`, params, {
    method: 'put',
    mockFile: 'coupon-delete'
  })

// 优惠券 审核
export const applyCoupon = params =>
  Http.fetch(`${context}/api/mks/coupon/rule/apply/opt`, params, {
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
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })

// 星购卡 导出
export const exportStarGoCard = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })

// 查询星购发券列表数据
export const queryStarRuleList = params =>
  Http.fetch(`${context}/api/mks/coupon/stargo`, params, {
    method: 'get'
  })

// 导出星Go券码
export const exportStargoCard = params =>
  Http.fetch(`${context}/api/mks/coupon/card/stargo/report`, params, {
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })

// 添加券备注
export const addCouponRemark = params =>
  Http.fetch(`${context}/api/mks/coupon/remark`, params, {
    method: 'post'
  })

// 查询星卡购列表（财务中心）
export const queryCouponCard = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'get'
  })

// 【星购卡】兑换码列表中导出
export const exportRedeemCode = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'put'
  })

// 【星购卡】 兑换码列表
export const getRedeemCodeList = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'get'
  })

// 【星购卡】 新增兑换码
export const addRedeemCode = params =>
  Http.fetch(`${context}/api/mks/coupon/card`, params, {
    method: 'post'
  })

// 【星购卡】 导出记录中下载兑换码
export const exportExportRecord = params =>
  Http.fetch(`${context}/api/mks/coupon/card/store/report`, params, {
    method: 'get',
    responseType: 'arraybuffer',
    hasErrMsg: true
  })

// 【星购卡】 导出记录列表
export const getExportRecordList = params =>
  Http.fetch(`${context}/api/mks/coupon/card/report`, params, {
    method: 'get'
  })
