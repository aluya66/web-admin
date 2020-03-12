import Layout from '@/views/layout'

export default {
  path: '/channel',
  name: 'channel',
  component: Layout,
  redirect: '/channel/shop/list',
  meta: {
    title: 'channel',
    icon: 'nested'
  },
  children: [{
    path: '/channel/shop/list',
    name: 'channelList',
    component: () => import('@/views/channel/shop/list'),
    meta: {
      title: 'channelList',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/channel/shop/detail/:id?',
    name: 'shopDetail',
    hidden: true,
    component: () => import('@/views/channel/shop/detail/index'),
    meta: {
      title: 'shopDetail',
      icon: 'table',
      activeMenu: '/channel/shop/list'
    }
  },
  {
    path: '/channel/merchant',
    name: 'channelMerchant',
    component: () => import('@/views/channel/merchant/list'),
    meta: {
      title: 'channelMerchant',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/channel/merchant/detail/:id?',
    name: 'channelMerchantInfo',
    hidden: true,
    component: () => import('@/views/channel/merchant/add'),
    meta: {
      title: 'channelMerchantInfo',
      noCache: true,
      activeMenu: '/channel/merchant',
      roles: ['admin']
    }
  },
  {
    path: '/channel/manage',
    name: 'channelManage',
    component: () => import('@/views/channel/manage/list'),
    meta: {
      title: 'channelManage',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/channel/manage/price/:id?',
    name: 'channelManagePrice',
    hidden: true,
    component: () => import('@/views/channel/manage/price/index'),
    meta: {
      title: 'channelManagePrice',
      noCache: true,
      activeMenu: '/channel/manage',
      roles: ['admin']
    }
  },
  {
    path: '/channel/rule',
    name: 'channelRule',
    component: () => import('@/views/channel/rule/list'),
    meta: {
      title: 'channelRule',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/channel/operation/list',
    name: 'operationList',
    component: () => import('@/views/channel/operation/list'),
    meta: {
      title: 'operationCenter',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/channel/operation/add/:id?',
    name: 'operationAdd',
    hidden: true,
    component: () => import('@/views/channel/operation/add'),
    meta: {
      title: 'operationAdd',
      activeMenu: '/channel/operation/list'
    }
  }
  ]
}
