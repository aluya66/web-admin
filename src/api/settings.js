import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

// 新增字典
export const addDict = params =>
  Http.fetch(`${context}/api/dict`, params, {
    method: 'post'
  })

// 基于codes查询
export const queryDictByCodes = params =>
  Http.fetch(`${context}/api/dict/codes`, params, {
    method: 'get'
  })

// 更新字典
export const updateDict = params =>
  Http.fetch(`${context}/api/dict`, params, {
    method: 'put'
  })

// 删除字典byCode
export const deleteDictByCode = params =>
  Http.fetch(`${context}/api/dict/bycode`, params, {
    method: 'delete'
  })

// 查询字典列表
export const getDictList = params =>
  Http.fetch(`${context}/api/dict/list`, params, {
    method: 'get'
  })

// 批量删除字典列表
export const deleteDictbyCodes = params =>
  Http.fetch(`${context}/api/dict/codes`, params, {
    method: 'delete'
  })

// 标签类型
export const tagCate = (params, method) =>
  Http.fetch(`${context}/api/tag/cate`, params, {
    method
  })

// 新增标签类型
export const addTagCate = params => tagCate(params, 'post')
// 编辑标签类型
export const updateTagCate = params => tagCate(params, 'put')

// 获取标签分类列表
export const getTabTypeList = params =>
  Http.fetch(`${context}/api/tag/pagecate`, params, {
    method: 'get'
  })

// 获取商品标签类型
export const getGoodsTabType = params =>
  Http.fetch(`${context}/api/tag/catelist`, params, {
    method: 'get'
  })

// 标签管理
export const tagManage = (params, method) =>
  Http.fetch(`${context}/api/tag`, params, {
    method
  })

// 新增标签
export const addTag = params => tagManage(params, 'post')
// 编辑标签
export const updateTag = params => tagManage(params, 'put')
// 删除标签
export const deleteTag = params => tagManage(params, 'delete')

// 获取标签列表
export const getTabList = params =>
  Http.fetch(`${context}/api/tag/page`, params, {
    method: 'get'
  })

// 获取所有标签列表
export const getAllTab = params =>
  Http.fetch(`${context}/api/tag/all`, params, {
    method: 'get'
  })

// 给商品打标签
export const addTagrelate = params =>
  Http.fetch(`${context}/api/tagrelate`, params, {
    method: 'post'
  })

// 查询已打商品标签
export const getTagrelate = params =>
  Http.fetch(`${context}/api/tagrelate`, params, {
    method: 'get'
  })

// 给品牌打标签
export const addTagbrand = params =>
  Http.fetch(`${context}/api/tagbrand`, params, {
    method: 'post'
  })

// 查询已打品牌标签
export const getTagbrand = params =>
  Http.fetch(`${context}/api/tagbrand`, params, {
    method: 'get'
  })

// 二维码管理列表
export const getQrcodeList = params =>
  Http.fetch(`${context}/api/qrcode/list`, params, {
    method: 'get'
  })

// 二维码启用/禁用, 或者说已审核, 未审核状态的修改
export const changeStatus = params =>
  Http.fetch(`${context}/api/qrcode/updatestatus`, params, {
    method: 'put'
  })

// 新增, 异步校验是否存在相同的qrCode使用的接口
export const checkQrcode = params =>
  Http.fetch(`${context}/api/qrcode/checkqrcode`, params, {
    method: 'get',
    hasErrMsg: true
  })

// 新增二维码数据
export const saveQrcode = params =>
  Http.fetch(`${context}/api/qrcode/save`, params, {
    method: 'post'
  })

// 根据ID逻辑删除二维码数据
export const deleteQrcode = params =>
  Http.fetch(`${context}/api/qrcode/delete`, params, {
    method: 'delete'
  })

// 編輯二维码
export const updateQrcode = params =>
  Http.fetch(`${context}/api/qrcode/update`, params, {
    method: 'put'
  })

// 预览二维码
export const previewQrcode = params =>
  Http.fetch(`${context}/api/qrcode/preview`, params, {
    method: 'get'
  })

// 接入方列表
export const getAccessList = params =>
  Http.fetch(`${context}/api/openapi/config/list`, params, {
    method: 'get'
  })

// 接入方新增
export const saveAccess = params =>
  Http.fetch(`${context}/api/openapi/config/save`, params, {
    method: 'post'
  })

// 接入方编辑
export const updateAccess = params =>
  Http.fetch(`${context}/api/openapi/config/update`, params, {
    method: 'put'
  })

// 接入方删除
export const deleteAccess = params =>
  Http.fetch(`${context}/api/openapi/config/delete`, params, {
    method: 'delete'
  })

// 接入方 校验appKey是否可用接口
export const checkAppkey = params =>
  Http.fetch(`${context}/api/openapi/config/checkappkey`, params, {
    method: 'get',
    hasErrMsg: true
  })

// 接入方 日志列表
export const getAccessLogList = params =>
  Http.fetch(`${context}/api/openapi/log/list`, params, {
    method: 'get'
  })

// 接入方 日志重发机制
export const retryAccessLog = params =>
  Http.fetch(`${context}/api/openapi/log/retry`, params, {
    method: 'put'
  })
