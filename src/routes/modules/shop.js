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
  }]
}
