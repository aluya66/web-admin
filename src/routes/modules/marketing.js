import Layout from '@/views/layout'

export default {
  path: '/marketing',
  name: 'marketing',
  component: Layout,
  redirect: '/marketing/coupon/ruleList',
  meta: {
    title: 'marketing',
    icon: 'nested'
  },
  children: [{
    path: '/marketing/coupon',
    name: 'coupon',
    component: () => import('@/views/common/index'),
    redirect: '/marketing/coupon/ruleList',
    meta: {
      title: 'coupon',
      icon: 'nested'
    },
    children: [{
      path: '/marketing/coupon/ruleList',
      name: 'couponRuleList',
      component: () => import('@/views/marketing/coupon/rule/list'),
      meta: {
        icon: 'table',
        title: 'couponRuleList',
        roles: ['admin']
      }
    }, {
      path: '/marketing/coupon/ruleInfo/:id?',
      name: 'couponRuleInfo',
      component: () => import('@/views/marketing/coupon/rule/detail/index'),
      hidden: true,
      meta: {
        icon: 'table',
        noCache: true,
        title: 'couponRuleInfo',
        activeMenu: '/marketing/coupon/ruleList'
      }
    },
    {
      path: '/marketing/coupon/ruleView/:id?',
      name: 'couponRuleView',
      component: () => import('@/views/marketing/coupon/rule/detail/index'),
      hidden: true,
      meta: {
        icon: 'table',
        noCache: true,
        title: 'couponRuleView',
        activeMenu: '/marketing/coupon/list'
      }
    },
    {
      path: '/marketing/coupon/list',
      name: 'couponList',
      component: () => import('@/views/marketing/coupon/list'),
      meta: {
        title: 'couponList',
        icon: 'table',
        roles: ['admin']
      }
    }]
  }]
}
