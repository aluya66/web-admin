import Layout from '@/views/layout'

export default {
  path: '/order',
  name: 'order',
  component: Layout,
  redirect: '/order/manage',
  meta: {
    title: 'order',
    icon: 'nested'
  },
  children: [{
    path: '/order/manage',
    name: 'orderManage',
    component: () => import('@/views/common/index'),
    redirect: '/member/manage/list',
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
    //   component: () => import('@/views/order/manage/send/detail/index'),
    //   meta: {
    //     title: 'orderManageSendDetail',
    //     noCache: true,
    //     activeMenu: '/order/manage/send',
    //     roles: ['admin']
    //   }
    // }
    ]
  }]
}
