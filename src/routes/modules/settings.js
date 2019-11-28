import Layout from '@/views/layout'

export default {
  path: '/settings',
  name: 'settings',
  component: Layout,
  redirect: '/settings/dict',
  meta: {
    title: 'settings',
    icon: 'nested'
  },
  children: [{
    path: '/settings/dict',
    name: 'dictList',
    component: () => import('@/views/settings/dict/list'),
    meta: {
      title: 'dictList',
      icon: 'table',
      roles: ['admin']
    }
  }, {
    path: '/settings/label',
    name: 'settingsLabel',
    component: () => import('@/views/settings/label/index'),
    meta: {
      title: 'settingsLabel',
      icon: 'table',
      roles: ['review']
    }
  }, {
    path: '/settings/qrcode',
    name: 'settingsQrcode',
    component: () => import('@/views/settings/qrcode/list'),
    meta: {
      title: 'settingsQrcode',
      icon: 'table',
      roles: ['admin']
    }
  }, {
    path: '/settings/access',
    name: 'settingsAccess',
    component: () => import('@/views/common/index'),
    redirect: '/settings/access/list',
    meta: {
      title: 'settingsAccess',
      icon: 'nested'
    },
    children: [{
      path: '/settings/access/list',
      name: 'settingsAccessList',
      component: () => import('@/views/settings/access/list'),
      meta: {
        icon: 'table',
        title: 'settingsAccessList',
        roles: ['admin']
      }
    }, {
      path: '/settings/access/log',
      name: 'settingsAccessLog',
      component: () => import('@/views/settings/access/log/list'),
      meta: {
        icon: 'table',
        title: 'settingsAccessLog',
        roles: ['admin']
      }
    }]
  }]
}
