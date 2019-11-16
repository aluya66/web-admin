import Layout from '@/views/layout'

export default {
  path: '/member',
  name: 'memberCenter',
  component: Layout,
  redirect: '/member/manage/list',
  meta: {
    title: 'memberCenter',
    icon: 'nested'
  },
  children: [{
    path: '/member/manage',
    name: 'memberManage',
    component: () => import('@/views/common/index'),
    redirect: '/member/manage/list',
    meta: {
      title: 'memberManage',
      icon: 'nested'
    },
    children: [{
      path: '/member/manage/list',
      name: 'memberManageList',
      component: () => import('@/views/member/manage/list/index'),
      meta: {
        icon: 'table',
        title: 'memberManageList',
        roles: ['edit']
      }
    }, {
      path: '/member/manage/detail/:id?',
      name: 'memberManageListDetail',
      hidden: true,
      component: () => import('@/views/member/manage/detail/index'),
      meta: {
        icon: 'table',
        title: 'memberManageListDetail',
        noCache: true,
        activeMenu: '/member/manage/list'
      }
    }, {
      path: '/member/manage/point',
      name: 'memberManagePoint',
      component: () => import('@/views/member/manage/point'),
      meta: {
        icon: 'table',
        title: 'memberManagePoint',
        roles: ['edit']
      }
    }, {
      path: '/member/manage/equity',
      name: 'memberManageEquity',
      component: () => import('@/views/member/manage/equity'),
      meta: {
        icon: 'table',
        title: 'memberManageEquity',
        roles: ['edit']
      }
    }]
  },
  {
    path: '/member/user',
    name: 'memberUser',
    component: () => import('@/views/common/index'),
    redirect: '/member/user/list',
    meta: {
      title: 'memberUser',
      icon: 'nested'
    },
    children: [{
      path: '/member/user/list',
      name: 'memberUserList',
      component: () => import('@/views/member/user/list'),
      meta: {
        icon: 'table',
        title: 'memberUserList',
        roles: ['edit']
      }
    }]
  },
  {
    path: '/member/config',
    name: 'memberConfig',
    component: () => import('@/views/common/index'),
    redirect: '/member/config/type',
    meta: {
      title: 'memberConfig',
      icon: 'nested'
    },
    children: [{
      path: '/member/config/type',
      name: 'memberConfigType',
      component: () => import('@/views/member/config/type/list'),
      meta: {
        icon: 'table',
        title: 'memberConfigType',
        roles: ['edit']
      }
    }, {
      path: '/member/config/rule',
      name: 'memberConfigRule',
      component: () => import('@/views/member/config/rule/list'),
      meta: {
        icon: 'table',
        title: 'memberConfigRule',
        roles: ['edit']
      }
    }, {
      path: '/member/config/point',
      name: 'memberConfigPoint',
      component: () => import('@/views/member/config/point/list'),
      meta: {
        icon: 'table',
        title: 'memberConfigPoint',
        roles: ['edit']
      }
    }]
  },
  {
    path: '/member/wallet',
    name: 'memberWallet',
    component: () => import('@/views/common/index'),
    redirect: '/member/wallet/list',
    meta: {
      title: 'memberWallet',
      icon: 'nested'
    },
    children: [{
      path: '/member/wallet/list',
      name: 'memberWalletList',
      component: () => import('@/views/member/wallet/list'),
      meta: {
        icon: 'table',
        title: 'memberWalletList',
        roles: ['edit']
      }
    }]
  }
  ]
}
