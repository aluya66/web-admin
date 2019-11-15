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
