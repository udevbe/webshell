import { CircularProgress, Container, CssBaseline } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { store } from './app/store'
import { LoginPage } from './features/auth/pages/LoginPage'
import { CompositorPage } from './features/compositor/pages/CompositorPage'
import { FileManagerPage } from './features/file-manager/pages/FileManagerPage'
import { NotFound } from './features/page-not-found/pages/NotFoundPage'
import { SettingsPage } from './features/settings/pages/SettingsPage'
import keycloak from './keycloak'
import { PrivateRoute } from './PrivateRoute'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'

const Pages: FunctionComponent = () => {
  const { initialized } = useKeycloak()

  // FIXME check keycloak init errors
  if (!initialized) {
    return (
      <Container
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Switch>
      <Route exact path='/login' component={LoginPage} />
      <PrivateRoute exact path='/' component={CompositorPage} />
      <PrivateRoute exact path='/files' component={FileManagerPage} />
      <PrivateRoute exact path='/settings' component={SettingsPage} />
      <Route path='*' component={NotFound} />
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
