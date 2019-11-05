import Layout from '@/views/layout'

export default {
  path: '/pay',
  name: 'payCenter',
  component: Layout,
  redirect: '/pay/manage/list',
  meta: {
    title: 'payCenter',
    icon: 'nested'
  },
  children: [{
    path: '/pay/manage',
    name: 'payManage',
    component: () => import('@/views/common/index'),
    redirect: '/pay/manage/list',
    meta: {
      title: 'payManage',
      icon: 'nested'
    },
    children: [{
      path: '/pay/manage/channel',
      name: 'payManageChannel',
      component: () => import('@/views/pay/manage/channel/list'),
      meta: {
        icon: 'table',
        title: 'payManageChannel'
      }
    }, {
      path: '/pay/manage/account',
      name: 'payManageAccount',
      component: () => import('@/views/pay/manage/account/list'),
      meta: {
        icon: 'table',
        title: 'payManageAccount'
      }
    }, {
      path: '/pay/manage/list',
      name: 'payManageList',
      component: () => import('@/views/pay/manage/list'),
      meta: {
        icon: 'table',
        title: 'payManageList'
      }
    }]
  }]
}
