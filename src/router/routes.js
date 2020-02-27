
const routes = [
  {
    path: '/l',
    component: () => import('layouts/Outside.vue'),
    children: [
      {
        name: 'landing',
        path: '',
        component: () => import('pages/outside/Home.vue') 
      },
      {
        name: 'outside-notes',
        path: 'n',
        component: () => import('layouts/Empty.vue'),
        children: [
          {
            name: 'view-note',
            path: ':hash',
            component: () => import('pages/outside/ViewNote.vue'),
            props: true
          },
        ]
      }
    ]
  },
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
        name: 'profile',
        path: '/p/mine',
        component: () => import('pages/Profile.vue') 
      },
      {
        name: 'profile',
        path: '/p/:address',
        component: () => import('pages/Profile.vue'),
        props: true
      },
      {
        name: 'login',
        path: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        path: 'n',
        component: () => import('layouts/Notes.vue'),
        children: [
          {
            name: 'notes',
            path: '',
            component: () => import('pages/NotesDashboard.vue')
          },
          {
            name: 'edit-note',
            path: ':hash/edit',
            component: () => import('pages/EditNote.vue'),
            props: true
          },
          {
            path: 'new',
            name: 'new-note',
            component: () => import('pages/EditNote.vue'),
            props: true
          },
        ]
      },
      {
        path: 'f',
        component: () => import('layouts/Files.vue'),
        children: [
          {
            name: 'files',
            path: '',
            component: () => import('pages/FileBrowser.vue')
          },
          {
            name: 'folder',
            path: 'folder/:folder',
            component: () => import('pages/FileBrowser.vue'),
            props: true
          }
        ]
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
