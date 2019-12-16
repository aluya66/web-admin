import Layout from '@/views/layout'

export default {
  path: '/shop',
  name: 'shop',
  component: Layout,
  redirect: '/shop/list',
  meta: {
    title: 'shop',
    icon: 'nested'
  },
  children: [{
    path: '/shop/list',
    name: 'shopList',
    component: () => import('@/views/shop/list'),
    meta: {
      title: 'shopList',
      icon: 'table'
    }
  },
  {
    path: '/shop/detail/:id?',
    name: 'shopDetail',
    hidden: true,
    component: () => import('@/views/shop/detail/index'),
    meta: {
      title: 'shopDetail',
      icon: 'table'
    }
  },
  {
    path: '/shop/merchant',
    name: 'shopMerchant',
    component: () => import('@/views/shop/merchant/list'),
    meta: {
      title: 'shopMerchant',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/shop/merchant/detail/:id?',
    name: 'shopMerchantInfo',
    hidden: true,
    component: () => import('@/views/shop/merchant/add'),
    meta: {
      title: 'shopMerchantInfo',
      noCache: true,
      activeMenu: '/shop/merchant',
      roles: ['admin']
    }
  }]
}
