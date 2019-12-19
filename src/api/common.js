import Http from '../utils/request'
// ipx服务相关接口
const ipxContext = process.env.VUE_APP_IPX
// 中台服务相关接口
const context = process.env.VUE_APP_UPLOAD

/**
 * mock模拟数据 示例
 * @param {*} params params数据对象
 * @param {Object} mockFile 接口名称对应的mock数据文件
 */
export const mockList = params =>
  Http.fetch(`${ipxContext}/mockList`, params, {
    mockFile: `list${params.type}`
  })

/* ==================    中台 服务接口      ==================== */

/**
 * 上传图片接口，支持多文件上传
 * @param {Array} params file
 */
export const uploadFile = params => Http.fetch(`${context}/api/upload/file`, params, {
  contentType: 'upload'
})

/* ==================    ipx 服务接口      ==================== */
/**
 * 登录
 * @param {*} params
 */
export const login = params => Http.fetch(`${ipxContext}/login`, params, { hasErrMsg: true })

/**
 *  登出
 * @param {*} params
 */
export const logout = params => Http.fetch(`${ipxContext}/out`, params, {
  method: 'get',
  hasErrMsg: true
})

/**
 * 修改密码
 * @param {*} data
 */
export const updatePassWord = params => Http.fetch(`${ipxContext}/update/psw`, params, {
  method: 'post'
})

/**
 * 获取菜单列表
 * @param {*} params
 */
export const getMenuList = params => Http.fetch(`${ipxContext}/menu/list`, params, {
  method: 'get'
})

/**
 * 查询菜单 : 查询全局菜单
 */
export const getAllMenu = params => Http.fetch(`${ipxContext}/sysmenu`, params, {
  method: 'get'
})

/**
 * 添加菜单
 */
export const addMenu = params => Http.fetch(`${ipxContext}/sysmenu`, params, {
  method: 'post'
})

/**
 * 修改菜单
 */
export const updateMenu = params => Http.fetch(`${ipxContext}/sysmenu`, params, {
  method: 'put'
})

/**
 * 查询单个菜单详细信息
 */
export const getMenuInfo = params => Http.fetch(`${ipxContext}/sysmenu`, params, {
  method: 'get'
})

/**
 * 编辑单个菜单
 */
export const editMenu = params => Http.fetch(`${ipxContext}/sysmenu`, params, {
  method: 'put'
})

/**
 * 获取账号列表
 * @param {*} params
 */
export const getAccountList = params => Http.fetch(`${ipxContext}/sysuser`, params, {
  method: 'get'
})

/**
 * 新增账号信息
 */
export const addAccount = params => Http.fetch(`${ipxContext}/sysuser`, params)

/**
 * 编辑账号信息
 */
export const editAccount = params => Http.fetch(`${ipxContext}/sysuser`, params, {
  method: 'put'
})

/**
 * 查询账号角色（权限）列表
 */
export const getAccountRoleList = params => Http.fetch(`${ipxContext}/sysuser/role`, params, {
  method: 'get'
})

/**
 * 查询角色列表
 * @param {*} params
 */
export const getRole = params => Http.fetch(`${ipxContext}/sysrole`, params, {
  method: 'get'
})

/**
 * 添加角色
 * @param {*} params
 */
export const addRole = params => Http.fetch(`${ipxContext}/sysrole`, params, {
  method: 'post'
})

/**
 * 禁用角色
 * @param {*} params
 */
export const disabledRole = params => Http.fetch(`${ipxContext}/sysrole`, params, {
  method: 'put'
})

/**
 * 查角色下的菜单
 */
export const getRoleMenu = params => Http.fetch(`${ipxContext}/sysrole/menu`, params, {
  method: 'get'
})

/**
 * 给角色修改或者添加菜单
 */
export const updateRoleMenu = params => Http.fetch(`${ipxContext}/sysrole/menu`, params, {
  method: 'post'
})
