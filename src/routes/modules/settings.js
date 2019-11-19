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
  }]
}
