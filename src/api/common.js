import Http from '../utils/request'
// ipx服务相关接口
const context = process.env.VUE_APP_IPX

/**
 * mock模拟数据 示例
 * @param {*} params params数据对象
 * @param {Object} mockFile 接口名称对应的mock数据文件
 */
export const mockList = params =>
  Http.fetch(`${context}/mockList`, params, {
    mockFile: `list${params.type}`
  })

/**
 * 登录
 * @param {*} params
 */
export const login = params => Http.fetch(`${context}/login`, params)

/**
 *  登出
 * @param {*} params
 */
export const logout = params => Http.fetch(`${context}/out`, params, {
  method: 'get'
})

/**
 * 修改密码
 * @param {*} data
 */
export const updatePassWord = params => Http.fetch(`${context}/update/psw`, params, {
  method: 'post'
})

/**
 * 获取菜单列表
 * @param {*} params
 */
export const getMenuList = params => Http.fetch(`${context}/menu/list`, params, {
  method: 'get'
})

/**
 * 查询菜单 : 查询全局菜单
 */
export const getAllMenu = params => Http.fetch(`${context}/sysmenu`, params, {
  method: 'get'
})

/**
 * 添加菜单
 */
export const addMenu = params => Http.fetch(`${context}/sysmenu`, params, {
  method: 'post'
})

/**
 * 修改菜单
 */
export const updateMenu = params => Http.fetch(`${context}/sysmenu`, params, {
  method: 'put'
})

/**
 * 查询单个菜单详细信息
 */
export const getMenuInfo = params => Http.fetch(`${context}/sysmenu`, params, {
  method: 'get'
})

/**
 * 编辑单个菜单
 */
export const editMenu = params => Http.fetch(`${context}/sysmenu`, params, {
  method: 'put'
})

/**
 * 获取账号列表
 * @param {*} params
 */
export const getAccountList = params => Http.fetch(`${context}/sysuser`, params, {
  method: 'get'
})

/**
 * 新增账号信息
 */
export const addAccount = params => Http.fetch(`${context}/sysuser`, params)

/**
 * 编辑账号信息
 */
export const editAccount = params => Http.fetch(`${context}/sysuser`, params, {
  method: 'put'
})

/**
 * 查询账号角色（权限）列表
 */
export const getAccountRoleList = params => Http.fetch(`${context}/sysuser/role`, params, {
  method: 'get'
})

/**
 * 查询角色列表
 * @param {*} params
 */
export const getRole = params => Http.fetch(`${context}/sysrole`, params, {
  method: 'get'
})

/**
 * 添加角色
 * @param {*} params
 */
export const addRole = params => Http.fetch(`${context}/sysrole`, params, {
  method: 'post'
})

/**
 * 禁用角色
 * @param {*} params
 */
export const disabledRole = params => Http.fetch(`${context}/sysrole`, params, {
  method: 'put'
})

/**
 * 查角色下的菜单
 */
export const getRoleMenu = params => Http.fetch(`${context}/sysrole/menu`, params, {
  method: 'get'
})

/**
 * 给角色修改或者添加菜单
 */
export const updateRoleMenu = params => Http.fetch(`${context}/sysrole/menu`, params, {
  method: 'post'
})
