import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import AuthRoute, { PublicRoute } from './AuthRoute'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const isAuthenticated = localStorage.getItem('AccessToken') ? true : false

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route
            exact
            path="/login"
            name="Login Page"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="*"
            name="Home"
            element={
              <AuthRoute isAuthenticated={isAuthenticated}>
                <DefaultLayout />
              </AuthRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
