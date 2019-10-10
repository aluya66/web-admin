import Http from '../utils/request'

const context = process.env.VUE_APP_CONSOLE_COMMON

/**
 * mock模拟数据 示例
 * @param {*} params params数据对象
 * @param {Object} mockFile 接口名称对应的mock数据文件
 */
export const mockList = params =>
  Http.fetch(`${context}/mockList`, params, {
    mockFile: `list${params.type}`
  })

// /**
//  * 登录
//  * @param {*} params
//  */
// export const login = params => Http.fetch(`${context}/login`, params)

// /**
//  *  登出
//  * @param {*} params
//  */
// export const logout = params =>
//   Http.fetch(`${context}/logout`, params, {
//     method: 'get'
//   })
