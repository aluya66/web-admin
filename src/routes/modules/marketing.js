import Layout from '@/views/layout'

export default {
  path: '/marketing',
  name: 'marketing',
  component: Layout,
  meta: {
    title: 'marketing',
    icon: 'nested'
  },
  children: [{
    path: '/marketing/ticket',
    name: 'marketingTicket',
    component: () => import('@/views/common/index'),
    redirect: '/marketing/ticket/list',
    meta: {
      title: 'marketingTicket',
      icon: 'nested'
    },
    children: [
      {
        path: '/marketing/ticket/list',
        name: 'ticketList',
        component: () => import('@/views/marketing/ticket/list/index'),
        meta: {
          title: 'ticketList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/marketing/ticket/list/details',
        name: 'ticketDetailsList',
        component: () => import('@/views/marketing/ticket/list/details'),
        meta: {
          title: 'ticketDetailsList',
          icon: 'table',
          roles: ['admin']
        }
      }]
  }, {
    path: '/marketing/ticket/ticketInfo/:id?',
    name: 'ticketInfo',
    component: () => import('@/views/marketing/ticket/detail/index'),
    hidden: true,
    meta: {
      icon: 'table',
      noCache: true,
      title: 'ticketInfo',
      activeMenu: '/marketing/ticket/list/index',
      roles: ['admin']
    }
  }, {
    path: '/marketing/discount/list',
    name: 'discountList',
    component: () => import('@/views/marketing/discount/list'),
    meta: {
      title: 'discountList',
      icon: 'table',
      roles: ['admin']
    }
  }, {
    path: '/marketing/discount/discountInfo/:id?',
    name: 'discountInfo',
    component: () => import('@/views/marketing/discount/detail/index'),
    hidden: true,
    meta: {
      icon: 'table',
      noCache: true,
      title: 'discountInfo',
      activeMenu: '/marketing/discount/list',
      roles: ['admin']
    }

  }, {
    path: '/marketing/rule/list',
    name: 'ruleList',
    component: () => import('@/views/marketing/rule/list/index'),
    meta: {
      title: 'ruleList',
      icon: 'table',
      roles: ['admin']
    }
  }, {
    path: '/marketing/rule/ruleInfo/:type/:id?',
    name: 'ruleInfo',
    component: () => import('@/views/marketing/rule/detail/index'),
    hidden: true,
    meta: {
      icon: 'table',
      noCache: true,
      title: 'ruleInfo',
      activeMenu: '/marketing/rule/list',
      roles: ['admin']
    }
  }, {
    path: '/marketing/starGoCard',
    name: 'starGoCard',
    component: () => import('@/views/common/index'),
    redirect: '/marketing/starGoCard/list',
    meta: {
      title: 'starGoCard',
      icon: 'nested'
    },
    children: [
      {
        path: '/marketing/starGoCard/list',
        name: 'starGoCardList',
        component: () => import('@/views/marketing/starGoCard/list/index'),
        meta: {
          title: 'starGoCardList',
          icon: 'table',
          roles: ['admin']
        }
      }, {
        path: '/marketing/starGoCard/list/recharge',
        name: 'starGoCardRechargeList',
        component: () => import('@/views/marketing/starGoCard/list/recharge'),
        meta: {
          title: 'starGoCardRechargeList',
          icon: 'table',
          roles: ['admin']
        }
      }]
  }]
}
