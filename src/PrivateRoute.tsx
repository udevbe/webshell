import React, { ReactElement } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { Location } from 'history'
import { useSupabase } from './SupaBaseContext'

const PrivateRouteRender = ({ children, location }: { children: ReactElement; location: Location }) => {
  const { authChange, supabase } = useSupabase()

  if (supabase.auth.user()) {
    if (authChange === 'PASSWORD_RECOVERY') {
      return (
        <Redirect
          to={{
            pathname: '/changepassword',
            state: { from: location },
          }}
        />
      )
    }
    return children
  } else {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    )
  }
}

export const PrivateRoute = ({ children, path }: { children: ReactElement; path: RouteProps['path'] }) => {
  return (
    <Route
      path={path}
      render={({ location }) => <PrivateRouteRender location={location}>{children}</PrivateRouteRender>}
    />
  )
}
