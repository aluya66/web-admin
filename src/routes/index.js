import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './modules'
import store from '../store'

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
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/

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
        if (from.meta.keepAlive) {
          from.meta.savedPosition = document.body.scrollTop
        }
        return {
          x: 0,
          y: to.meta.savedPosition || 0
        }
      }
    }
  })

const router = createRouter()

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (store.getters.userInfo && store.getters.userInfo.token) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
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
          utils.errFun(error || 'Has Error')
          next(`/?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/?redirect=${to.path}`) // 否则全部重定向到登录页
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
