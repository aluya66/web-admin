import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './modules'
import store from '../store'
import errFun from 'utils/err'

import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import utils from 'utils'
import Layout from '@/views/layout'

Vue.use(VueRouter)
/** note: Submenu only appear when children.length>=1
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: [roleId]                   will control the page roles (you can set multiple roles)['admin','editor']
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    affix: true                  if set true, the tag will affix in the tags-view
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
**/

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const demos = utils.isDebug ? require('../demos/routes').modules : {}

export const constantRoutes = [{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/401'),
  hidden: true
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: 'home',
  children: [{
    path: 'home',
    component: () => import('@/views/home'),
    name: 'home',
    meta: {
      title: 'home',
      icon: 'dashboard',
      noCache: true,
      affix: true
    }
  }]
},
...Object.values(demos)
]

export const asyncRoutes = [{
  path: '*',
  redirect: '/404',
  hidden: true
},
...Object.values(routes)
]

const whiteList = ['/login'] // 不重定向白名单

const createRouter = () =>
  new VueRouter({
    routes: [...constantRoutes],
    mode: !utils.isDebug ? process.env.VUE_APP_ROUTEMODEL : 'hash',
    base: !utils.isDebug ? process.env.VUE_APP_BASEURLPATH : '',
    strict: utils.isDebug,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        if (to.meta.keepAlive) {
          to.meta.savedPosition = document.body.scrollTop
        }
        return {
          x: 0,
          y: to.meta.savedPosition || 0
        }
      }
    }
  })

// 嵌入别的系统时，从url截取token // http://pillar-console.yosar.develop
const token = utils.getUrlParam('token')
if (token) {
  const id = utils.getUrlParam('parentId')
  const userName = utils.getUrlParam('userName')
  utils.setStore('SET_USERINFO', {
    token,
    userName,
    id
  })
}

const router = createRouter()
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (token || (store.getters.userInfo && store.getters.userInfo.token)) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles
      if (hasRoles || hasRoles === 0) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          if (!roles) {
            throw new Error('菜单数据异常,请重新登录')
          }
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          router.addRoutes(accessRoutes)
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          await store.dispatch('user/resetToken')
          errFun(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (!token) {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    } else {
      next(`/401?redirect=${to.path}`) // 无权限页面
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
