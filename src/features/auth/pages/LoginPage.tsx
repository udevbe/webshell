import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Redirect, useLocation } from 'react-router-dom'

export const LoginPage = () => {
  const location = useLocation<{ [key: string]: unknown }>()
  const currentLocationState = location.state || {
    from: { pathname: '/' },
  }

  const { keycloak } = useKeycloak()

  if (keycloak?.authenticated) {
    return <Redirect to={currentLocationState?.from as string} />
  } else {
    // TODO check return state for errors
    keycloak?.login()
  }

  return null
}
