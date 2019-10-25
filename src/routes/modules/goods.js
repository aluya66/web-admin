import Layout from '@/views/layout'

export default {
  path: '/goods',
  name: 'goods',
  component: Layout,
  redirect: '/goods/list',
  meta: {
    title: 'goods',
    icon: 'nested'
  },
  children: [{
    path: '/goods/list',
    name: 'goodsList',
    component: () => import('@/views/goods/list'),
    meta: {
      title: 'goodsList',
      icon: 'table'
    }
  },
  {
    path: '/goods/detail/:id',
    name: 'goodsDetail',
    component: () => import('@/views/goods/detail/index'),
    hidden: true,
    meta: {
      title: 'goodsDetail',
      noCache: true,
      activeMenu: '/goods/list'
    }
  },
  {
    path: '/goods/logs',
    name: 'goodsLogs',
    component: () => import('@/views/goods/logs/list'),
    meta: {
      title: 'goodsLogs',
      icon: 'table'
    }
  },
  {
    path: '/goods/snapshoot',
    name: 'goodsSnapshoot',
    component: () => import('@/views/goods/snapshoot/list'),
    meta: {
      title: 'goodsSnapshoot',
      icon: 'table'
    }
  },
  {
    path: '/goods/snapshootDetail/:id',
    name: 'goodsSnapshootDetail',
    hidden: true,
    component: () => import('@/views/goods/detail/index'),
    meta: {
      noCache: true,
      activeMenu: '/goods/snapshoot',
      title: 'goodsSnapshootDetail'
    }
  }]
}
