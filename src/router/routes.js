
const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutMain.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/Home.vue'),
        meta: { title: 'FAW Monitor', mode: 'root' }
      },
      {
        name: 'auth',
        path: 'auth',
        component: () => import('pages/Auth.vue'),
        meta: { title: 'Login', mode: 'root' }
      }
    ]
  },
  {
    path: '/data/',
    component: () => import('layouts/LayoutData.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'data-charts' }
      },
      {
        name: 'data-charts',
        path: 'charts',
        component: () => import('pages/Charts.vue'),
        meta: { title: 'Charts', mode: 'data' }
      }
      // {
      //   name: 'data-bubble-plot',
      //   path: 'bubble-plot',
      //   component: () => import('pages/Charts.vue'),
      //   meta: { title: 'Bubble Plot', mode: 'data' }
      // }
      // { name: 'data-table', path: 'table', component: () => import('pages/DataTable.vue'), meta: { title: 'Data Table' } }
    ]
  },
  {
    path: '/dashboard/',
    component: () => import('layouts/LayoutDashboard.vue'),
    children: [
      {
        name: 'dashboard-home',
        path: '',
        component: () => import('pages/DashboardHome.vue'),
        meta: { authRequired: true, title: 'FAW Monitor', mode: 'user' }
      },
      {
        name: 'dashboard-charts',
        path: 'charts',
        component: () => import('pages/Charts.vue'),
        meta: { authRequired: true, title: 'Charts', mode: 'user' }
      },
      // {
      //   name: 'dashboard-bubble-plot',
      //   path: 'bubble-plot',
      //   component: () => import('pages/Charts.vue'),
      //   meta: { authRequired: true, title: 'Bubble Plot', mode: 'user' }
      // },
      {
        name: 'form-trap',
        path: 'trap-registration',
        component: () => import('pages/FormTrap.vue'),
        meta: { authRequired: true, title: 'Trap Registration', mode: 'user' }
      },
      {
        name: 'form-scouting',
        path: 'scouting-data',
        component: () => import('pages/FormScouting.vue'),
        meta: { authRequired: true, title: 'Scouting', mode: 'user' }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
