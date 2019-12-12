import Layout from '@/views/layout'

export default {
  path: '/finance',
  name: 'finance',
  component: Layout,
  redirect: '/finance/list',
  meta: {
    title: 'finance',
    icon: 'nested'
  },
  children: [{
    path: '/finance/list',
    name: 'financeList',
    component: () => import('@/views/finance/list'),
    meta: {
      title: 'financeList',
      icon: 'table'
    }
  },
  {
    path: '/finance/detail/:id?',
    name: 'financeDetail',
    hidden: true,
    component: () => import('@/views/finance/detail/index'),
    meta: {
      title: 'financeDetail',
      noCache: true,
      activeMenu: '/finance/list'
    }
  }
  ]
}
