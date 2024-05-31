import React from 'react'
import { Navigate } from 'react-router-dom'

const AuthRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return children
}

export const PublicRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }
  return children
}

export default AuthRoute
