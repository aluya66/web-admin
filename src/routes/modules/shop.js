import Layout from '@/views/layout'

export default {
  path: '/shop',
  name: 'shop',
  component: Layout,
  redirect: '/shop/list',
  meta: {
    title: 'shop',
    icon: 'nested'
  },
  children: [{
    path: '/shop/list',
    name: 'shopList',
    component: () => import('@/views/shop/list'),
    meta: {
      title: 'shopList',
      icon: 'table'
    }
  },
  {
    path: '/shop/detail/:shopId',
    name: 'shopDetail',
    hidden: true,
    component: () => import('@/views/shop/detail/index'),
    meta: {
      title: 'shopDetail',
      icon: 'table'
    }
  },
  {
    path: '/shop/channel',
    name: 'channel',
    component: () => import('@/views/shop/channel/list'),
    meta: {
      title: 'channel',
      icon: 'table'
    }
  },
  {
    path: '/shop/channel/channelInfo/:id?',
    name: 'channelDetail',
    hidden: true,
    component: () => import('@/views/shop/channel/detail/index'),
    meta: {
      title: 'channelDetail',
      icon: 'table',
      activeMenu: '/shop/channel/detail'
    }
  },
  {
    path: '/shop/rule',
    name: 'channelRule',
    component: () => import('@/views/shop/rule/list'),
    meta: {
      title: 'channelRule',
      icon: 'table'
    }
  },
  {
    path: '/shop/rule/ruleInfo/:id?',
    name: 'channelRuleDetail',
    hidden: true,
    component: () => import('@/views/shop/rule/detail/index'),
    meta: {
      title: 'channelRuleDetail',
      icon: 'table',
      activeMenu: '/shop/rule/detail'
    }
  }]
}
