import React from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'

interface PrivateRouteParams extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}

export function PrivateRoute({ component: Component, ...rest }: PrivateRouteParams) {
  const { keycloak } = useKeycloak()

  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak?.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}
