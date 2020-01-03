import Layout from '@/views/layout'

export default {
  path: '/order',
  name: 'order',
  component: Layout,
  redirect: '/order/list',
  meta: {
    title: 'order',
    icon: 'nested'
  },
  children: [{
    path: '/order/list',
    name: 'orderList',
    component: () => import('@/views/order/list/index'),
    meta: {
      title: 'orderList',
      icon: 'table'
    }
  },
  {
    path: '/order/detail/:id?',
    name: 'orderDetail',
    hidden: true,
    component: () => import('@/views/order/detail/index'),
    meta: {
      title: 'orderDetail',
      noCache: true,
      activeMenu: '/order/list'
    }
  }
  ]
}
