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
      icon: 'table'
    }
  },
  {
    path: '/channel/shop/detail/:id?',
    name: 'shopDetail',
    hidden: true,
    component: () => import('@/views/channel/shop/detail/index'),
    meta: {
      title: 'shopDetail',
      icon: 'table'
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
    path: '/channel/rule',
    name: 'channelRule',
    component: () => import('@/views/channel/rule/list'),
    meta: {
      title: 'channelRule',
      icon: 'table',
      roles: ['admin']
    }
  }]
}
