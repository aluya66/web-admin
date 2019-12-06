import Layout from '@/views/layout'

export default {
  path: '/marketing',
  name: 'marketing',
  component: Layout,
  meta: {
    title: 'marketing',
    icon: 'nested'
  },
  children: [{
    path: '/marketing/coupon',
    name: 'coupon',
    component: () => import('@/views/common/index'),
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
  }, {
    path: '/marketing/ticket',
    name: 'ticket',
    component: () => import('@/views/common/index'),
    meta: {
      title: 'ticket',
      icon: 'nested'
    },
    children: [{
      path: '/marketing/ticket/list',
      name: 'ticketList',
      component: () => import('@/views/marketing/ticket/list'),
      meta: {
        title: 'ticketList',
        icon: 'table',
        roles: ['admin']
      }
    }, {
      path: '/marketing/ticket/ticketInfo/:id?',
      name: 'ticketInfo',
      component: () => import('@/views/marketing/ticket/detail/index'),
      hidden: true,
      meta: {
        icon: 'table',
        noCache: true,
        title: 'ticketInfo',
        activeMenu: '/marketing/ticket/list',
        roles: ['admin']
      }
    }]
  }]
}
