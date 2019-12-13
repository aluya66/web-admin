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
}
]

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
  value: 2
}, {
  label: '采购退款',
  value: 3
}, {
  label: '提现',
  value: 4
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

const shopTypeList = [{
  label: '自营',
  value: 1
}, {
  label: '加盟',
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
}]

export default {
  pointTypeList,
  lobList,
  lobListAll,
  disStatus,
  categoryTypeList,
  auditStatus,
  genderSelect,
  salesTypeList,
  extractStatusList,
  shopTypeList,
  earningsTypeList,
  earningsStatusList
}
