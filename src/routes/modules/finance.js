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
      activeMenu: '/finance/account',
      roles: ['admin']
    }
  },
  {
    path: '/finance/coping',
    name: 'financeCoping',
    component: () => import('@/views/common/index'),
    meta: {
      title: 'financeCoping',
      icon: 'table',
      roles: ['admin']
    },
    children: [{
      path: '/finance/coping/extract',
      name: 'financeExtract',
      component: () => import('@/views/finance/coping/extract/list'),
      meta: {
        title: 'financeExtract',
        icon: 'table',
        roles: ['admin']
      }
    }, {
      path: '/finance/coping/settlement',
      name: 'financeSettlement',
      component: () => import('@/views/finance/coping/settlement/list'),
      meta: {
        title: 'financeSettlement',
        icon: 'table',
        roles: ['admin']
      }
    }, {
      path: '/finance/coping/settlement/detail/:id?',
      name: 'financeSettlementDetail',
      component: () => import('@/views/finance/coping/settlement/detail/index'),
      hidden: true,
      meta: {
        title: 'financeSettlementDetail',
        noCache: true,
        activeMenu: '/finance/coping/settlement',
        roles: ['admin']
      }
    }]
  },
  {
    path: '/finance/distribution',
    name: 'financeDistribution',
    component: () => import('@/views/finance/distribution/list'),
    meta: {
      title: 'financeDistribution',
      icon: 'table',
      roles: ['admin']
    }
  }]
}
