import Layout from '@/views/layout'

export default {
  path: '/goods',
  name: 'goods',
  component: Layout,
  redirect: '/goods/manage/list',
  meta: {
    title: 'goods',
    icon: 'nested'
  },
  children: [{
    path: '/goods/manage/list',
    name: 'goodsManage',
    component: () => import('@/views/goods/manage/list/index'),
    meta: {
      title: 'goodsManage',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/goods/manage/detail/:id/:type',
    name: 'goodsDetail',
    component: () => import('@/views/goods/manage/detail/index'),
    hidden: true,
    meta: {
      title: 'goodsDetail',
      noCache: true,
      activeMenu: '/goods/manage',
      roles: ['admin']
    }
  },

  {
    path: '/goods/manage/label/:id',
    name: 'goodsLabelDetail',
    component: () => import('@/views/goods/manage/label/index'),
    hidden: true,
    meta: {
      title: 'goodsLabelDetail',
      noCache: true,
      activeMenu: '/goods/manage',
      roles: ['admin']
    }
  },
  {
    path: '/goods/manage/logs',
    name: 'goodsLogs',
    component: () => import('@/views/goods/manage/logs/list'),
    meta: {
      title: 'goodsLogs',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/goods/manage/snapshoot',
    name: 'goodsSnapshoot',
    component: () => import('@/views/goods/manage/snapshoot/list'),
    meta: {
      title: 'goodsSnapshoot',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/goods/manage/snapshootDetail/:id',
    name: 'goodsSnapshootDetail',
    hidden: true,
    component: () => import('@/views/goods/manage/detail/index'),
    meta: {
      noCache: true,
      activeMenu: '/goods/manage/snapshoot',
      title: 'goodsSnapshootDetail'
    }
  }]
}
