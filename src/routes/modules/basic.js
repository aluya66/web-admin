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
      icon: 'table',
      roles: ['review']
    }
  },
  {
    path: '/basic/area',
    name: 'areaInfo',
    component: () => import('@/views/basic/area'),
    meta: {
      title: 'area',
      icon: 'table',
      roles: ['review']
    }
  },
  {
    path: '/basic/version',
    name: 'version',
    component: () => import('@/views/basic/version'),
    meta: {
      title: 'version',
      icon: 'table',
      roles: ['review']
    }
  },
  {
    path: '/basic/category',
    name: 'category',
    component: () => import('@/views/basic/category'),
    meta: {
      title: 'category',
      icon: 'table',
      roles: ['review']
    }
  },
  {
    path: '/basic/brand',
    name: 'brand',
    component: () => import('@/views/basic/brand/list'),
    meta: {
      title: 'brand',
      icon: 'table',
      roles: ['edit']
    }
  },
  {
    path: '/basic/brandInfo/:id?',
    name: 'brandInfo',
    hidden: true,
    component: () => import('@/views/basic/brand/add'),
    meta: {
      title: 'brandInfo',
      icon: 'table',
      noCache: true,
      activeMenu: '/basic/brand'
    }
  },
  {
    path: '/basic/brandLabel/:id',
    name: 'brandLabel',
    hidden: true,
    component: () => import('@/views/basic/brand/addLabel'),
    meta: {
      title: 'brandLabel',
      icon: 'table',
      noCache: true,
      activeMenu: '/basic/brand'
    }
  },
  {
    path: '/basic/merchandise',
    name: 'merchandise',
    component: () => import('@/views/basic/merchandise'),
    meta: {
      title: 'merchandise',
      icon: 'table',
      roles: ['review']
    }
  },
  {
    path: '/basic/label',
    name: 'labelManage',
    component: () => import('@/views/basic/label'),
    meta: {
      title: 'label',
      icon: 'table',
      roles: ['review']
    }
  },
  {
    path: '/basic/logistics',
    name: 'logistics',
    component: () => import('@/views/basic/logistics'),
    meta: {
      title: 'logistics',
      icon: 'table',
      roles: ['review']
    }
  }
  ]
}
