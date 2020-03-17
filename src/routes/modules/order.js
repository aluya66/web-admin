import Layout from '@/views/layout'

export default {
  path: '/order',
  name: 'order',
  component: Layout,
  meta: {
    title: 'order',
    icon: 'nested'
  },
  children: [
    {
      path: '/order/manage',
      name: 'orderManage',
      component: () => import('@/views/common/index'),
      redirect: '/order/manage/list',
      meta: {
        title: 'orderManage',
        icon: 'nested',
        roles: ['admin']
      },
      children: [{
        path: '/order/manage/list',
        name: 'orderManageList',
        component: () => import('@/views/order/manage/list/index'),
        meta: {
          title: 'orderManageList',
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: '/order/manage/detail/:id?',
        name: 'orderManageDetail',
        hidden: true,
        component: () => import('@/views/order/manage/detail/index'),
        meta: {
          title: 'orderManageDetail',
          noCache: true,
          activeMenu: '/order/manage/list',
          roles: ['admin']
        }
      },
      {
        path: '/order/manage/stargo',
        name: 'orderManageStargo',
        component: () => import('@/views/order/manage/stargo/list'),
        meta: {
          title: 'orderManageStargo',
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: '/order/manage/paylist',
        name: 'orderManagePay',
        component: () => import('@/views/order/manage/paylist/list'),
        meta: {
          title: 'orderManagePay',
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: '/order/manage/goodstatistics',
        name: 'orderManageStatistics',
        component: () => import('@/views/order/manage/goodstatistics/list'),
        meta: {
          title: 'orderManageStatistics',
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: '/order/manage/send',
        name: 'orderManageSend',
        component: () => import('@/views/order/manage/send/index'),
        meta: {
          title: 'orderManageSend',
          icon: 'table',
          roles: ['admin']
        }
      },
      {
        path: '/order/manage/viplist',
        name: 'orderManageVip',
        component: () => import('@/views/order/manage/viplist/index'),
        meta: {
          title: 'orderManageVip',
          icon: 'table',
          roles: ['admin']
        }
      }
      // {
      //   path: '/order/manage/sendDetail/:id?',
      //   name: 'orderManageSendDetail',
      //   hidden: true,
      //   component: () => import('@/views/order/manage/send/detail'),
      //   meta: {
      //     title: 'orderManageSendDetail',
      //     noCache: true,
      //     activeMenu: '/order/manage/send',
      //     roles: ['admin']
      //   }
      // },
      ]
    }, {
      path: '/order/afterSales',
      name: 'afterSales',
      component: () => import('@/views/common/index'),
      redirect: '/order/afterSales/afterSaleOrder',
      meta: {
        title: 'afterSales',
        icon: 'nested',
        roles: ['admin']
      },
      children: [{
        path: '/order/afterSales/afterSaleOrder',
        name: 'afterSalesList',
        component: () => import('@/views/order/afterSales/afterSaleOrder/index'),
        meta: {
          title: 'afterSalesList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/order/afterSales/afterSalesCostSettings',
        name: 'afterSalesCostSettingsList',
        component: () => import('@/views/order/afterSales/afterSalesCostSettings/index'),
        meta: {
          title: 'afterSalesCostSettingsList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/order/afterSales/refund',
        name: 'refundList',
        component: () => import('@/views/order/afterSales/refund/index'),
        meta: {
          title: 'refundList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/order/afterSales/reship',
        name: 'reshipList',
        component: () => import('@/views/order/afterSales/reship/index'),
        meta: {
          title: 'reshipList',
          icon: 'table',
          roles: ['admin']
        }
      }]
    }
  ]
}
