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
    }, {
      path: '/marketing/discount',
      name: 'discount',
      component: () => import('@/views/common/index'),
      meta: {
        title: 'discount',
        icon: 'nested'
      },
      children: [{
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
      }]
    }, {
      path: '/marketing/rule',
      name: 'rule',
      component: () => import('@/views/common/index'),
      meta: {
        title: 'rule',
        icon: 'nested'
      },
      children: [{
        path: '/marketing/rule/list',
        name: 'ruleList',
        component: () => import('@/views/marketing/rule/list'),
        meta: {
          title: 'ruleList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/marketing/rule/ruleInfo/:id?',
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
      }]
    }, {
      path: '/marketing/starGoCard',
      name: 'starGoCard',
      component: () => import('@/views/common/index'),
      meta: {
        title: 'starGoCard',
        icon: 'nested'
      },
      children: [{
        path: '/marketing/starGoCard/list',
        name: 'starGoCardList',
        component: () => import('@/views/marketing/starGoCard/list'),
        meta: {
          title: 'starGoCardList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/marketing/starGoCard/export/list',
        name: 'starGoCardExportList',
        component: () => import('@/views/marketing/starGoCard/export/list'),
        meta: {
          icon: 'table',
          noCache: true,
          title: 'starGoCardExportList',
          activeMenu: '/marketing/starGoCard/export/list',
          roles: ['admin']
        }
      }, {
        path: '/marketing/starGoCard/redeemCode/list',
        name: 'starGoCardRedeemCodeList',
        component: () => import('@/views/marketing/starGoCard/redeemCode/list'),
        meta: {
          icon: 'table',
          noCache: true,
          title: 'starGoCardRedeemCodeList',
          activeMenu: '/marketing/starGoCard/redeemCode/list',
          roles: ['admin']
        }
      }]
    }]
}
