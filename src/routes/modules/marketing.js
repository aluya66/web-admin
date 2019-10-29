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
    component: () => import('@/views/marketing/index'),
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
        noCache: true,
        title: 'couponRuleList'
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
      path: '/marketing/coupon/list',
      name: 'couponList',
      component: () => import('@/views/marketing/coupon/list'),
      meta: {
        title: 'couponList',
        icon: 'table'
      }
    },
    // {
    //   path: '/marketing/coupon/detail/:id',
    //   name: 'couponListDetail',
    //   component: () => import('@/views/marketing/coupon/detail'),
    //   hidden: true,
    //   meta: {
    //     title: 'couponListDetail',
    //     icon: 'table'
    //   }
    // },
    {
      path: '/marketing/coupon/audit',
      name: 'couponAudit',
      component: () => import('@/views/marketing/coupon/audit'),
      meta: {
        title: 'couponAudit',
        icon: 'table'
      }
    }
    ]
  }]
}
