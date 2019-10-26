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
    component: () => import('@/views/order/list'),
    meta: {
      title: 'orderList',
      icon: 'table'
    }
  }]
}
