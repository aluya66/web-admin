import Layout from '@/views/layout'

export default {
  path: '/basic',
  name: 'basic',
  component: Layout,
  redirect: '/basic/bussiness',
  meta: {
    title: 'basic',
    icon: 'nested'
  },
  children: [{
    path: '/basic/bussiness',
    name: 'bussiness',
    component: () => import('@/views/basic/bussinessLine'),
    meta: {
      title: 'bussiness',
      icon: 'table'
    }
  },
  {
    path: '/basic/area',
    name: 'areaInfo',
    component: () => import('@/views/basic/area'),
    meta: {
      title: 'area',
      icon: 'table'
    }
  },
  {
    path: '/basic/version',
    name: 'version',
    component: () => import('@/views/basic/version'),
    meta: {
      title: 'version',
      icon: 'table'
    }
  },
  {
    path: '/basic/category',
    name: 'category',
    component: () => import('@/views/basic/category'),
    meta: {
      title: 'category',
      icon: 'table'
    }
  },
  {
    path: '/basic/brand',
    name: 'brand',
    component: () => import('@/views/basic/brand'),
    meta: {
      title: 'brand',
      icon: 'table'
    }
  },
  {
    path: '/basic/merchandise',
    name: 'merchandise',
    component: () => import('@/views/basic/merchandise'),
    meta: {
      title: 'merchandise',
      icon: 'table'
    }
  },
  {
    path: '/basic/label',
    name: 'labelManage',
    component: () => import('@/views/basic/label'),
    meta: {
      title: 'label',
      icon: 'table'
    }
  },
  {
    path: '/basic/logistics',
    name: 'logistics',
    component: () => import('@/views/basic/logistics'),
    meta: {
      title: 'logistics',
      icon: 'table'
    }
  }
  ]
}
