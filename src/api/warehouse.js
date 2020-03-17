import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * 查询仓库列表
 * @param {*}
 */
export const queryWarehouseList = params =>
  Http.fetch(`${context}/api/warehouse/page`, params, {
    method: 'get'
  })

/**
 * 新增
 * @param {*}
 */
export const addWarehouse = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'post'
  })

/**
 * 编辑
 * @param {*}
 */
export const editWarehouse = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'put'
  })

/**
 * 删除
 * @param {*}
 */
export const deleteWarehouse = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'delete'
  })

/**
 * 查看详情
 * @param {*}
 */
export const queryWarehouseDetail = params =>
  Http.fetch(`${context}/api`, params, {
    method: 'get'
  })

/**
 * 仓库库存预占查询
 * @param {*}
 */
export const queryWarehousePreoccupation = params =>
  Http.fetch(`${context}/api/stock/occupied/page`, params, {
    method: 'get'
  })
