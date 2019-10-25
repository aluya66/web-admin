import Layout from '@/views/layout'

export default {
  path: '/coupon',
  name: 'coupon',
  component: Layout,
  redirect: '/coupon/ruleList',
  meta: {
    title: 'coupon',
    icon: 'nested'
  },
  children: [{
    path: '/coupon/ruleList',
    name: 'ruleList',
    component: () => import('@/views/coupon/ruleList'),
    meta: {
      title: 'list',
      icon: 'table'
    }
  }]
}
