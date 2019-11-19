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
}
]

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
  lobList,
  disStatus,
  categoryTypeList
}
