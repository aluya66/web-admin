import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_LOCALHOST

/**
 * 查询仓库列表
 * @param {*}
 */
export const queryWarehouseList = params =>
  Http.fetch(`${context}/api/warehouse/page`, params, {
    method: 'get'
  })

/**
 * 新增仓库
 * @param {*}
 */
export const addWarehouse = params =>
  Http.fetch(`${context}/api/warehouse/add`, params, {
    method: 'post'
  })

/**
 * 更新仓库
 * @param {*}
 */
export const editWarehouse = params =>
  Http.fetch(`${context}/api/warehouse/update`, params, {
    method: 'put'
  })

// /**
//  * 删除
//  * @param {*}
//  */
// export const deleteWarehouse = params =>
//   Http.fetch(`${context}/api`, params, {
//     method: 'delete'
//   })

/**
 * 查询仓库详情
 * @param {*}
 */
export const queryWarehouseDetail = params =>
  Http.fetch(`${context}/api/warehouse/get`, params, {
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

/**
 * 分页查询仓库库存
 * @param {*}
 */
export const queryWarehouseStock = params =>
  Http.fetch(`${context}/api/stock/page`, params, {
    method: 'get'
  })

/**
 * 平台库存查询
 * @param {*}
 */
export const queryWarehouseVirtualStock = params =>
  Http.fetch(`${context}/api/stock/page`, params, {
    method: 'get'
  })

/**
 * 出入库明细
 * @param {*}
 */
export const queryInOutStockLog = params =>
  Http.fetch(`${context}/api/stock/log/page`, params, {
    method: 'get'
  })
