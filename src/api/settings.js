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
