import Layout from '@/views/layout'

export default {
  path: '/demo',
  component: Layout,
  // hidden: true,
  meta: {
    title: 'Demo',
    icon: 'eye'
  },
  redirect: '/demo/table',
  children: [
    {
      path: '/demo/goods/list',
      name: 'demoGoodsList',
      component: () => import('@/demos/list-dialog'),
      meta: {
        name: 'dialog-table',
        title: 'goodsList',
        icon: 'table'
      }
    },
    {
      path: 'table',
      name: 'Table',
      component: () => import('@/demos/table/index'),
      meta: {
        name: '单纯table',
        title: 'table',
        icon: 'table'
      }
    },
    {
      path: 'icon',
      name: 'icon',
      component: () => import('@/demos/icons/index'),
      meta: {
        title: 'icon',
        icon: 'icon'
      }
    },
    {
      path: 'tree',
      name: 'Tree',
      component: () => import('@/components/tree/tree-table.vue'),
      meta: {
        title: 'Tree',
        icon: 'tree'
      }
    },
    {
      path: 'form',
      name: 'form',
      component: () => import('@/demos/form'),
      meta: {
        title: 'form',
        icon: 'form'
      }
    },
    {
      path: 'list',
      name: 'list',
      component: () => import('@/demos/list'),
      meta: {
        title: 'List',
        icon: 'table'
      }
    },
    {
      path: 'nested',
      redirect: '/demo/nested/menu1',
      name: 'Nested',
      meta: {
        title: 'Nested',
        icon: 'nested'
      },
      children: [
        {
          path: 'menu1',
          component: () => import('@/demos/nested/menu1/index'), // Parent router-view
          name: 'Menu1',
          meta: {
            title: 'Menu1'
          },
          children: [
            {
              path: 'menu1-1',
              component: () => import('@/demos/nested/menu1/menu1-1'),
              name: 'Menu1-1',
              meta: {
                title: 'Menu1-1'
              }
            },
            {
              path: 'menu1-2',
              component: () => import('@/demos/nested/menu1/menu1-2'),
              name: 'Menu1-2',
              meta: {
                title: 'Menu1-2'
              },
              children: [
                {
                  path: 'menu1-2-1',
                  component: () =>
										import('@/demos/nested/menu1/menu1-2/menu1-2-1'),
                  name: 'Menu1-2-1',
                  meta: {
                    title: 'Menu1-2-1'
                  }
                },
                {
                  path: 'menu1-2-2',
                  component: () =>
										import('@/demos/nested/menu1/menu1-2/menu1-2-2'),
                  name: 'Menu1-2-2',
                  meta: {
                    title: 'Menu1-2-2'
                  }
                }
              ]
            },
            {
              path: 'menu1-3',
              component: () => import('@/demos/nested/menu1/menu1-3'),
              name: 'Menu1-3',
              meta: {
                title: 'Menu1-3'
              }
            }
          ]
        },
        {
          path: 'menu2',
          component: () => import('@/demos/nested/menu2/index'),
          meta: {
            title: 'menu2'
          }
        }
      ]
    }
  ]
}
