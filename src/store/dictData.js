import utils from 'utils'

// 积分来源
const pointTypeList = [{
  label: '订单消费',
  value: 1
}, {
  label: '订单抵扣',
  value: 2
},
{
  label: '取消订单',
  value: 3
},
{
  label: '活动任务',
  value: 4
},
{
  label: '人工修改',
  value: 5
}
]
// 业务线
let lobList = utils.getStore('GLOBALAPPLIST')
lobList = lobList || [{
  label: 'IPX',
  value: 'ysdp'
},
{
  label: 'YOSHOP',
  value: 'yssp'
},
{
  label: '星GO',
  value: 'ysgo'
},
{
  label: '星助手',
  value: 'ysia'
},
{
  label: 'YOSHOPS',
  value: 'ysys'
}
]

// 含公共的业务线
const lobListAll = lobList.slice(0)
lobListAll.unshift({
  label: '公共',
  value: 'commons'
})

// 启用/禁用
const disStatus = [{
  label: '启用',
  value: 1
}, {
  label: '禁用',
  value: 0
}]

// 开启/关闭
const openStatus = [{
  label: '开启',
  value: 1
}, {
  label: '关闭',
  value: 0
}]

// 渠道价格应用范围
const channelAppliedType = [{
  label: '采购定价',
  value: 1
}, {
  label: '销售定价',
  value: 2
}]

// 渠道价格类型
const channelPriceType = [{
  label: '平台价格',
  value: 1
}, {
  label: '渠道价格',
  value: 2
}]

// 会员条件等级
const customLevelList = [{
  label: '普通会员',
  value: 0
}, {
  label: '白金会员',
  value: 1
}, {
  label: '钻石会员',
  value: 2
}, {
  label: '黑卡会员',
  value: 3
}]

// 同步状态
const syncStatusList = [{
  label: '不同步',
  value: 0
}, {
  label: '已同步',
  value: 1
}]

// 男1，女2
const genderSelect = [{
  label: '男',
  value: 1
}, {
  label: '女',
  value: 2
}]

// 审核状态 0：未审核  1：已审核
const auditStatus = [{
  label: '未审核',
  value: 0
}, {
  label: '已审核',
  value: 1
}]

// 标签分类类型
const categoryTypeList = [{
  label: '属性类',
  value: 0
}, {
  label: '用户类',
  value: 1
}, {
  label: '标签类',
  value: 2
}]

// 交易类型
const salesTypeList = [{
  label: '充值',
  value: 1
}, {
  label: '采购消费',
  value: 4
}, {
  label: '采购退款',
  value: 5
}, {
  label: '提现',
  value: 6
}]

// 提现审核 未审核 1：提现成功 2：提现驳回
const extractStatusList = [{
  label: '未审核',
  value: 0
}, {
  label: '提现成功',
  value: 1
}, {
  label: '提现驳回',
  value: 2
}]

/**
 * 商户类型
 */
const shopTypeList = [{
  label: '自营',
  value: 1
}, {
  label: '合作',
  value: 2
}]

/**
 * 商户分类
 */
const businessCategoryList = [{
  label: '企业',
  value: 1
}, {
  label: '个人',
  value: 2
}]

// 结算类型
const earningsTypeList = [{
  label: '邀请会员',
  value: 10
}, {
  label: '销售商品',
  value: 20
}]

// 结算状态
const earningsStatusList = [{
  label: '预结算',
  value: 10
}, {
  label: '已结算',
  value: 20
}, {
  label: '已关闭',
  value: 25
}]

// 权益类型  1.商品折扣 2.送券 3.积分 4.营销活动
const equityTypeList = [{
  label: '商品折扣',
  value: 1
}, {
  label: '送券',
  value: 2
}, {
  label: '积分',
  value: 3
}, {
  label: '营销活动',
  value: 4
}]
// 活动类型  1 满减 2 折扣 3 一口价
const activityTypeList = [{
  label: '满额减(商品满**元，减**元)',
  value: 1
}, {
  label: '满件折(商品满**件，享**折)',
  value: 2
}, {
  label: '一口价(一口价**元)',
  value: 3
}]

// 活动状态 1待开始 2活动中 3已结束
const activityStatusList = [{
  label: '待开始',
  value: 1
}, {
  label: '活动中',
  value: 2
}, {
  label: '已结束',
  value: 3
}]

// 卡券类型
const ticketTypeList = [{
  value: 5,
  label: '现金券'
},
{
  value: 1,
  label: '折扣券'
}
  // {
  //   value: 3,
  //   label: '兑换券'
  // }
]

// 价格类型  0 非会员零售价 1 会员价 2 供货价 3 散批价 4 大批价 5 成本价
const priceTypeList = [{
  value: 6,
  label: '零售价'
},
{
  value: 1,
  label: '会员价'
},
{
  value: 2,
  label: '供货价'
},
{
  value: 3,
  label: '散批价'
},
{
  value: 4,
  label: '大批价'
},
{
  value: 5,
  label: '成本价'
}
]

const couponStatusList = [ // 卡劵状态 0草稿 1审核中 2审核不通过 3审核通过 4未发布 5进行中 6未开始 7已下架 8已结束(失效)
  {
    value: 0,
    label: '草稿'
  },
  {
    value: 1,
    label: '审核中'
  },
  {
    value: 2,
    label: '审核不通过'
  },
  {
    value: 3,
    label: '审核通过'
  },
  {
    value: 4,
    label: '未发布'
  },
  {
    value: 5,
    label: '进行中'
  },
  {
    value: 6,
    label: '未开始'
  },
  {
    value: 7,
    label: '已下架'
  },
  {
    value: 8,
    label: '已结束(失效)'
  }
]
const ticketValidTypeArr = [{
  label: '指定日期',
  value: 1
},
{
  label: '自领券N日内有效',
  value: 2
},
{
  label: '自领券日当月有效',
  value: 4
}
]

// 券规则领券方式
const receiveTypeList = [{
  label: '系统发券',
  value: 1
},
{
  label: '手动领券',
  value: 2
}
]

// 结算状态
const settleStatusList = [{
  label: '待结算',
  value: 1
},
{
  label: '已结算',
  value: 2
},
{
  label: '已关闭',
  value: 3
}
]

// 付款状态
const payStatusList = [{
  label: '未支付',
  value: 1
},
{
  label: '部分支付',
  value: 2
},
{
  label: '已支付',
  value: 3
}
]

const orderTypeList = [{
  label: '销售订单',
  value: 1
},
{
  label: '售后订单',
  value: 2
}
]

// 订单状态
const orderStatusList = [{
  label: '待付款',
  value: 80
}, {
  label: '待发货',
  value: 81
}, {
  label: '待签收',
  value: 82
}, {
  label: '已取消',
  value: 50
}, {
  label: '已完成',
  value: 60
}, {
  label: '订单完结',
  value: 70
}
  // , {
  //   label: '未审核',
  //   value: 10
  // }, {
  //   label: '审核通过',
  //   value: 20
  // }, {
  //   label: '待复核',
  //   value: 30
  // }, {
  //   label: '审核不通过',
  //   value: 40
  // },
]

// 售后状态
const afterSaleStatusList = [{
  label: '未售后',
  value: -1
}, {
  label: '待审核',
  value: 1
}, {
  label: '待退货',
  value: 2
}, {
  label: '待确认（仓库）',
  value: 3
}, {
  label: '仓库待发货',
  value: 4
}, {
  label: '用户待确认',
  value: 5
}, {
  label: '已完成',
  value: 6
}, {
  label: '已取消',
  value: 7
}, {
  label: '已驳回',
  value: 8
}]

// 评价状态
const evaluateStatusList = [{
  label: '待评价',
  value: 1
}, {
  label: '已评价',
  value: 2
}]
// 订单支付类别
const payTypeList = [{
  label: '微信APP',
  value: 'WXAPP'
}, {
  label: '微信小程序',
  value: 'WXXCX'
}, {
  label: '微信二维码支付',
  value: 'WXEWM'
}, {
  label: '微信WAP',
  value: 'WXWAP'
}, {
  label: '支付宝APP',
  value: 'ZFBAPP'
}, {
  label: '支付宝PC',
  value: 'ZFBPC'
}, {
  label: '支付宝WAP',
  value: 'ZFBWAP'
}, {
  label: '银联',
  value: 'UPMP'
}, {
  label: '虚拟',
  value: 'XN'
}, {
  label: '拉卡拉',
  value: 'LKL'
}, {
  label: '钱包余额',
  value: 'QB'
}, {
  label: '线下',
  value: 'OFFLINE'
}, {
  label: '星购卡',
  value: 'XGK'
}, {
  label: '优惠券',
  value: 'YHQ'
}, {
  label: '代金券',
  value: 'DJQ'
}, {
  label: '积分',
  value: 'JF'
}, {
  label: '拉卡拉',
  value: 'LAKALA'
},{
  label:'通联pos',
  value:'TL'
}]

// 支付结算状态
const orderSettleStatusList = [{
  label: '预结算',
  value: 1
}, {
  label: '待结算',
  value: 2
}, {
  label: '已结算',
  value: 3
}, {
  label: '已关闭',
  value: 4
}]

// 订单配送类型
const deliveryTimeTypeList = [{
  label: '门店自提',
  value: 1
}, {
  label: '快递',
  value: 2
}]

// 发票类型列表
const invoiceTypeList = [{
  label: '普通发票',
  value: 1
}, {
  label: '电子发票',
  value: 2
}, {
  label: '增值税发票',
  value: 3
}]

// 订单业务类型，单据类型
const orderBusinessTypeList = [{
  label: '团购',
  value: 1
}, {
  label: '普通订单',
  value: 2
}, {
  label: '秒杀',
  value: 3
}, {
  label: '购券',
  value: 4
}, {
  label: '充值',
  value: 5
}, {
  label: 'VIP订单',
  value: 6
}, {
  label: '星购卡订单',
  value: 7
}]

// 仓库类型
const warehouseType = [{
  label: '云仓',
  value: 10
}, {
  label: '店仓',
  value: 20
}]

// 仓库属性  0:不可售; 1:可销售
const warehouseSaleType = [{
  label: '不可售',
  value: 0
}, {
  label: '可销售',
  value: 1
}]

// 售后单状态 状态 1:未审核 10:审核通过 11:审核拒绝 15:审核通过并发货
// 20:仓库审核通过, 21:仓库审核拒绝 30:等待买家发货 40：等待卖家收货 50：等待商家退款 80:售后完成, 90售后取消
const afterSalesStatus = [{
  label: '未审核',
  value: 1
}, {
  label: '审核通过',
  value: 10
}, {
  label: '审核拒绝',
  value: 11
}, {
  label: '审核通过并发货',
  value: 15
}, {
  label: '仓库审核通过',
  value: 20
}, {
  label: '仓库审核拒绝',
  value: 21
}, {
  label: '等待买家发货',
  value: 30
}, {
  label: '等待卖家收货',
  value: 40
}, {
  label: '等待商家退款',
  value: 50
}, {
  label: '售后完成',
  value: 80
}, {
  label: '售后取消',
  value: 90
}]
// 售后类型 1：只退款，2：退款退货，3:代金券退货
const afterSalesTypes = [{
  label: '只退款',
  value: 1
}, {
  label: '退款退货',
  value: 2
}, {
  label: '代金券退货',
  value: 3
}
]

// 业务类型(0:均不属于;1:其他入库; 2:采购入库; 3:销售退货入库;4:调拨入库;5:其他出库;
// 6:销售出库;7:调拨出库;8:挂版入库;9:挂版出库,10:退货出库,11#盘亏出库，12#盘盈入库，13#调货出库，14#调货入库)
const bussinessType = [{
  label: '其他入库',
  value: 1
}, {
  label: '采购入库',
  value: 2
}, {
  label: '销售退货入库',
  value: 3
}, {
  label: '调拨入库',
  value: 4
}, {
  label: '其他出库',
  value: 5
}, {
  label: '销售出库',
  value: 6
}, {
  label: '调拨出库',
  value: 7
}, {
  label: '挂版入库',
  value: 8
}, {
  label: '挂版出库',
  value: 9
}, {
  label: '退货出库',
  value: 10
}, {
  label: '盘亏出库',
  value: 11
}, {
  label: '盘盈入库',
  value: 12
}, {
  label: '调货出库',
  value: 13
}, {
  label: '调货入库',
  value: 14
}]

// 出入库 1 出库  2 入库
const inOutType = [{
  label: '出库',
  value: 1
}, {
  label: '入库',
  value: 2
}]

// 出入库管理状态 // 1,待确认, 2,已完成, 3,已取消, 4,临时保存',
const inOutStatusList = [{
  label: '待确认',
  value: 1
}, {
  label: '已完成',
  value: 2
}, {
  label: '已取消',
  value: 3
}, {
  label: '临时保存',
  value: 4
}]

export default {
  afterSalesTypes,
  afterSalesStatus,
  payStatusList,
  settleStatusList,
  pointTypeList,
  lobList,
  lobListAll,
  disStatus,
  openStatus,
  syncStatusList,
  customLevelList,
  channelPriceType,
  channelAppliedType,
  categoryTypeList,
  auditStatus,
  genderSelect,
  salesTypeList,
  extractStatusList,
  shopTypeList,
  businessCategoryList,
  earningsTypeList,
  earningsStatusList,
  equityTypeList,
  activityTypeList,
  activityStatusList,
  ticketTypeList,
  priceTypeList,
  couponStatusList,
  ticketValidTypeArr,
  receiveTypeList,
  orderTypeList,
  orderStatusList,
  afterSaleStatusList,
  evaluateStatusList,
  payTypeList,
  orderSettleStatusList,
  deliveryTimeTypeList,
  orderBusinessTypeList,
  invoiceTypeList,
  warehouseType,
  warehouseSaleType,
  bussinessType,
  inOutType,
  inOutStatusList
}
