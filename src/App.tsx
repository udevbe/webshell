import { CssBaseline } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { store } from './app/store'
import { LoginPage } from './features/auth/pages/LoginPage'
import { CompositorPage } from './features/compositor/pages/CompositorPage'
import { SettingsPage } from './features/settings/pages/SettingsPage'
import keycloak from './keycloak'
import { PrivateRoute } from './PrivateRoute'
import { ReactKeycloakProvider } from '@react-keycloak/web'

const Pages: FunctionComponent = () => {
  return (
    <Switch>
      <Route path='/login'>
        <LoginPage />
      </Route>
      <Route path='/'>
        <CompositorPage />
      </Route>
      <PrivateRoute path='/settings'>
        <SettingsPage />
      </PrivateRoute>
    </Switch>
  )
}

export const App: FunctionComponent = () => {
  return (
    <React.StrictMode>
      <ReactKeycloakProvider authClient={keycloak}>
        <Provider store={store}>
          <CssBaseline>
            <BrowserRouter>
              <Pages />
            </BrowserRouter>
          </CssBaseline>
        </Provider>
      </ReactKeycloakProvider>
    </React.StrictMode>
  )
}
