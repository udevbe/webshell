import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Redirect, useLocation } from 'react-router-dom'

export const LoginPage = () => {
  const location = useLocation<{ [key: string]: unknown }>()
  const currentLocationState = location.state || {
    from: { pathname: '/' },
  }

  const { keycloak, initialized } = useKeycloak()
  if (!initialized) {
    return null
  }

  if (keycloak?.authenticated) {
    return <Redirect to={currentLocationState?.from as string} />
  } else {
    keycloak?.login()
  }

  return null
}
