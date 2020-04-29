import Layout from '@/views/layout'

export default {
  path: '/operation/manage',
  name: 'operationManage',
  component: Layout,
  redirect: '/operation/intent/list',
  meta: {
    title: 'operationManage',
    icon: 'nested'
  },
  children: [{
    path: '/operation/intent/list',
    name: 'intentList',
    component: () => import('@/views/operationManage/intention/list'),
    meta: {
      title: 'intentList',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/operation/manage/detail/:id?',
    name: 'intentDetail',
    hidden: true,
    component: () => import('@/views/operationManage/intention/detail/index'),
    meta: {
      title: 'intentDetail',
      noCache: true,
      activeMenu: '/operation/manage/list'
    }
  }
  ]
}
