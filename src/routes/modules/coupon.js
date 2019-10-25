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
    name: 'couponRuleList',
    component: () => import('@/views/coupon/rule/list'),
    meta: {
      title: 'couponRuleList',
      icon: 'table'
    }
  }, {
    path: '/coupon/rule/:id',
    name: 'couponRuleInfo',
    component: () => import('@/views/coupon/rule/info'),
    hidden: true,
    meta: {
      icon: 'table',
      noCache: true
    }
  }, {
    path: '/coupon/list',
    name: 'couponList',
    component: () => import('@/views/coupon/list'),
    meta: {
      title: 'couponList',
      icon: 'table'
    }
  }, {
    path: '/coupon/audit',
    name: 'couponAudit',
    component: () => import('@/views/coupon/audit'),
    meta: {
      title: 'couponAudit',
      icon: 'table'
    }
  }]
}
