import React, { ReactElement } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'

export const PrivateRoute = ({ children, path }: { children: ReactElement; path: string }) => {
  const { keycloak } = useKeycloak()
  return (
    <Route
      path={path}
      render={(props) =>
        keycloak?.authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              // eslint-disable-next-line react/prop-types
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}
