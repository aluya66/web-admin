import Layout from '@/views/layout'

export default {
  path: '/marketing',
  name: 'marketing',
  component: Layout,
  meta: {
    title: 'marketing',
    icon: 'nested'
  },
  children: [
    // {
    //   path: '/marketing/coupon',
    //   name: 'coupon',
    //   component: () => import('@/views/common/index'),
    //   meta: {
    //     title: 'coupon',
    //     icon: 'nested'
    //   },
    //   children: [{
    //     path: '/marketing/coupon/ruleList',
    //     name: 'couponRuleList',
    //     component: () => import('@/views/marketing/coupon/rule/list'),
    //     meta: {
    //       icon: 'table',
    //       title: 'couponRuleList',
    //       roles: ['admin']
    //     }
    //   }, {
    //     path: '/marketing/coupon/ruleInfo/:id?',
    //     name: 'couponRuleInfo',
    //     component: () => import('@/views/marketing/coupon/rule/detail/index'),
    //     hidden: true,
    //     meta: {
    //       icon: 'table',
    //       noCache: true,
    //       title: 'couponRuleInfo',
    //       activeMenu: '/marketing/coupon/ruleList'
    //     }
    //   },
    //   {
    //     path: '/marketing/coupon/ruleView/:id?',
    //     name: 'couponRuleView',
    //     component: () => import('@/views/marketing/coupon/rule/detail/index'),
    //     hidden: true,
    //     meta: {
    //       icon: 'table',
    //       noCache: true,
    //       title: 'couponRuleView',
    //       activeMenu: '/marketing/coupon/list'
    //     }
    //   },
    //   {
    //     path: '/marketing/coupon/list',
    //     name: 'couponList',
    //     component: () => import('@/views/marketing/coupon/list'),
    //     meta: {
    //       title: 'couponList',
    //       icon: 'table',
    //       roles: ['admin']
    //     }
    //   }]
    // },
    {
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
    },
    {
      path: '/marketing/discount/list',
      name: 'discountList',
      component: () => import('@/views/marketing/discount/list'),
      meta: {
        title: 'discountList',
        icon: 'table',
        roles: ['admin']
      }
    }, {
      path: '/marketing/discount/discountInfo/:id?',
      name: 'discountInfo',
      component: () => import('@/views/marketing/discount/detail/index'),
      hidden: true,
      meta: {
        icon: 'table',
        noCache: true,
        title: 'discountInfo',
        activeMenu: '/marketing/discount/list',
        roles: ['admin']
      }

    }, {
      path: '/marketing/rule/list',
      name: 'ruleList',
      component: () => import('@/views/marketing/rule/list/index'),
      meta: {
        title: 'ruleList',
        icon: 'table',
        roles: ['admin']
      }
    }, {
      path: '/marketing/rule/ruleInfo/:type/:id?',
      name: 'ruleInfo',
      component: () => import('@/views/marketing/rule/detail/index'),
      hidden: true,
      meta: {
        icon: 'table',
        noCache: true,
        title: 'ruleInfo',
        activeMenu: '/marketing/rule/list',
        roles: ['admin']
      }
    }, {
      path: '/marketing/starGoCard/list',
      name: 'starGoCard',
      component: () => import('@/views/marketing/starGoCard/list'),
      meta: {
        title: 'starGoCard',
        icon: 'table',
        roles: ['admin']
      }
    }
  ]
}
