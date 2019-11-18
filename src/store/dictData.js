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
}]

export default {
  pointTypeList,
  lobList,
  disStatus
}
