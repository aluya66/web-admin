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
    path: '/finance/account',
    name: 'financeAccount',
    component: () => import('@/views/finance/account/list'),
    meta: {
      title: 'financeAccount',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/finance/accountDetail/:id?',
    name: 'financeAccountDetail',
    hidden: true,
    component: () => import('@/views/finance/account/detail/index'),
    meta: {
      title: 'financeAccountDetail',
      noCache: true,
      activeMenu: '/finance/account'
    }
  },
  {
    path: '/finance/extract',
    name: 'financeExtract',
    component: () => import('@/views/finance/extract/list'),
    meta: {
      title: 'financeExtract',
      icon: 'table',
      roles: ['admin']
    }
  },
  {
    path: '/finance/settlement',
    name: 'financeSettlement',
    component: () => import('@/views/finance/settlement/list'),
    meta: {
      title: 'financeSettlement',
      icon: 'table',
      roles: ['admin']
    }
  }]
}
