import Layout from '@/views/layout'

export default {
  path: '/channel',
  name: 'shop',
  component: Layout,
  redirect: '/channel/list',
  meta: {
    title: 'shop',
    icon: 'nested'
  },
  children: [{
    path: '/channel/list',
    name: 'shopList',
    component: () => import('@/views/channel/list'),
    meta: {
      title: 'shopList',
      icon: 'table'
    }
  },
  {
    path: '/channel/detail/:shopId',
    name: 'shopDetail',
    hidden: true,
    component: () => import('@/views/channel/detail/index'),
    meta: {
      title: 'shopDetail',
      icon: 'table'
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
  },
  {
    path: '/channel/rule/ruleInfo/:id?',
    name: 'channelRuleDetail',
    hidden: true,
    component: () => import('@/views/channel/rule/detail/index'),
    meta: {
      title: 'channelRuleDetail',
      icon: 'table',
      activeMenu: '/channel/rule/detail'
    }
  }]
}
