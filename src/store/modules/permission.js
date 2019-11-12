import { asyncRoutes, constantRoutes } from '@/routes'
import { getMenuList } from 'api/ipx'
import utils from 'utils'

const state = {
  routes: [],
  addRoutes: [],
  roleList: [] // api获取的权限列表，预设置权限在路由roles里面
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes.slice()
    state.routes = constantRoutes.concat(routes).slice()
  }
}

const actions = {
  generateRoutes(store, menuId) {
    return new Promise(resolve => {
      getMenuList({
        parentId: menuId
      }).then(res => {
        let accessedRoutes = utils.isDebug ? asyncRoutes : filterAsyncRoutes(asyncRoutes, res)
        store.commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param curRoutes
 * @param localRoute
 */
function hasPermission(curRoutes, localRoute) {
  if (localRoute.path) {
    if (localRoute.hidden && localRoute.hidden === true) {
      return true
    }
    return curRoutes.some(val => localRoute.path === val.path)
  }
  return false
}

/**
 * 递归过滤异步路由表，返回符合用户路由表
 * @param routes asyncRoutes
 * @param curRoutes
 */
export function filterAsyncRoutes(localroutes, resRoutes) {
  const res = []
  localroutes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(resRoutes, tmp)) {
      const filterRoute = resRoutes.filter(res => tmp.path === res.path)
      if (filterRoute.length && tmp.meta) {
        tmp.meta.name = filterRoute[0].title
      }
      const matchRoute = resRoutes.find(item => item.path === route.path)
      if (tmp.children && matchRoute) {
        tmp.children = filterAsyncRoutes(tmp.children, matchRoute.children)
      }
      res.push(tmp)
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
