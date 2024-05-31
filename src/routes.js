import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/pages/AllUsers'))
const RegeneratedImages = React.lazy(() => import('./views/pages/RegeneratedImages'))
const OriginalImages = React.lazy(() => import('./views/pages/OriginalImages'))
const ViewImage = React.lazy(() => import('./views/pages/ViewImage'))
const ViewUser = React.lazy(() => import('./views/pages/ViewUser'))




const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'All Users', element: Users },
  { path: '/regenerated-images', name: 'Regenerated Images', element: RegeneratedImages },
  { path: '/original-images', name: 'Original Images', element: OriginalImages },
  { path: '/view-image', name: 'View Image', element: ViewImage },
  { path: '/user/:id', name: 'View User', element: ViewUser },



  
]

export default routes
