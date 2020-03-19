import Layout from '@/views/layout'

export default {
  path: '/warehouse',
  name: 'warehouse',
  component: Layout,
  redirect: '/warehouse/list',
  meta: {
    title: 'warehouse',
    icon: 'nested'
  },
  children: [{
    path: '/warehouse/list',
    name: 'warehouseList',
    component: () => import('@/views/warehouse/list'),
    meta: {
      title: 'warehouseList',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/warehouse/preoccupation/list',
    name: 'warehousePreoccupationList',
    component: () => import('@/views/warehouse/preoccupation/list'),
    meta: {
      title: 'warehousePreoccupationList',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/warehouse/stockVirtual/list',
    name: 'warehouseVirtualList',
    component: () => import('@/views/warehouse/stockVirtual/list'),
    meta: {
      title: 'warehouseVirtualList',
      icon: 'table',
      roles: ['admin']
    }
  }, {
    path: '/warehouse/inOutLog/list',
    name: 'inOutLogList',
    component: () => import('@/views/warehouse/inOutLog/list'),
    meta: {
      title: 'inOutLogList',
      icon: 'table',
      roles: ['admin']
    }
  }]
}
