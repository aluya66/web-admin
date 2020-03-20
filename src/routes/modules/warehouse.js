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
    path: '/warehouse/platformStock/list',
    name: 'platformStockList',
    component: () => import('@/views/warehouse/platformStock/list'),
    meta: {
      title: 'platformStockList',
      icon: 'table',
      roles: ['admin']
    }
  }, {
    path: '/warehouse/platformOccupiedStock/list',
    name: 'platformOccupiedStockList',
    component: () => import('@/views/warehouse/platformOccupiedStock/list'),
    meta: {
      title: 'platformOccupiedStockList',
      icon: 'table',
      roles: ['admin']
    }
  }]
}
