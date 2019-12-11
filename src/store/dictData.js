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
}]

// 业务线
const lobList = [{
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
}]

// 含公共的业务线
const lobListAll = lobList.slice(0)
lobListAll.unshift({
  label: '公共',
  value: 'commons'
})

// 启用禁用
const disStatus = [{
  label: '启用',
  value: 1
}, {
  label: '禁用',
  value: 0
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
},
{
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

// 活动类型  1 满减 2 折扣 3 一口价
const activityTypeList = [{
  label: '满件折(商品满**件，享**折)',
  value: 1
}, {
  label: '满额减(商品满**元，减**元)',
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
const ticketTypeList = [ 
  {
    value: 1,
    label: '现金券'
  },
  {
    value: 2,
    label: '折扣券'
  },
  {
    value: 3,
    label: '兑换券'
  }
]

// 价格类型  0 非会员零售价 1 会员价 2 供货价 3 散批价 4 大批价 5 成本价
const priceTypeList = [
  {
    value: 0,
    label: '非会员零售价'
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

export default {
  pointTypeList,
  lobList,
  lobListAll,
  disStatus,
  categoryTypeList,
  auditStatus,
  genderSelect,
  activityTypeList,
  activityStatusList,
  ticketTypeList,
  priceTypeList
}
