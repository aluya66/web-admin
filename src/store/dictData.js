// 积分来源
const pointTypeList = [{
  label: '订单消费',
  value: 1
}, {
  label: '订单折扣',
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
  label: '公共',
  value: 'commons'
}, {
  label: 'ipx',
  value: 'ysdp'
},
{
  label: 'yoshop',
  value: 'yssp'
},
{
  label: '星go',
  value: 'ysgo'
}]

// 启用禁用
const disStatus = [{
  label: '禁用',
  value: 0
},
{
  label: '启用',
  value: 1
}
]

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

export default {
  pointTypeList,
  lobList,
  disStatus,
  categoryTypeList,
  auditStatus
}
