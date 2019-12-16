import Layout from '@/views/layout'

export default {
  path: '/channel',
  name: 'channel',
  component: Layout,
  redirect: '/channel/list',
  meta: {
    title: 'channel',
    icon: 'nested'
  },
  children: [{
    path: '/channel/list',
    name: 'channelList',
    component: () => import('@/views/channel/list'),
    meta: {
      title: 'channelList',
      icon: 'table'
    }
  },
  {
    path: '/channel/detail/:shopId',
    name: 'channelDetail',
    hidden: true,
    component: () => import('@/views/channel/detail/index'),
    meta: {
      title: 'channelDetail',
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
  }]
}
