import Layout from '@/views/layout'

export default {
  path: '/goods',
  name: 'goods',
  component: Layout,
  redirect: '/goods/shopCenter',
  meta: {
    title: 'goods',
    icon: 'nested'
  },
  children: [{
    path: '/goods/shopCenter',
    name: 'shopCenter',
    component: () => import('@/views/goods/shopCenter'),
    meta: {
      title: 'shopCenter',
      icon: 'table'
    }
  },
  {
    path: '/goods/shopCenterLog',
    name: 'shopCenterLog',
    component: () => import('@/views/goods/shopCenterLog'),
    meta: {
      title: 'shopCenterLog',
      icon: 'table'
    }
  },
  {
    path: '/goods/shopCenterDel/:id',
    name: 'shopCenterDel',
    component: () => import('@/views/goods/shopCenterDel'),
    hidden: true,
    meta: {
      title: 'shopCenterDel',
      icon: 'table'
    }
  },
  {
    path: '/goods/snapshoot',
    name: 'snapshoot',
    component: () => import('@/views/goods/snapshoot'),
    meta: {
      title: 'snapshoot',
      icon: 'table'
    }
  },
  {
    path: '/goods/snapshootDel',
    name: 'snapshootDel',
    hidden: true,
    component: () => import('@/views/goods/snapshootDel'),
    meta: {
      title: 'snapshootDel',
      icon: 'table'
    }
  }]
}
