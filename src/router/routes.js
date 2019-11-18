
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/Index.vue') 
      },
      {
        name: 'login',
        path: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        name: 'notes',
        path: 'notes',
        component: () => import('pages/Notes.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
