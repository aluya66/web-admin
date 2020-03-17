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
      icon: 'table'
    }
  },
  {
    path: '/warehouse/preoccupation/list',
    name: 'warehousePreoccupationList',
    component: () => import('@/views/warehouse/preoccupation/list'),
    meta: {
      title: 'warehousePreoccupationList',
      icon: 'table'
    }
  }]
}
