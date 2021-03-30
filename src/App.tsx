import { CssBaseline } from '@material-ui/core'
import { CompositorSession } from 'greenfield-compositor'
import React, { FunctionComponent } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './app/store'
import { RemoteApp } from './app/types/webshell'
import { LoginPage } from './features/auth/pages/LoginPage'
import { CompositorPage } from './features/compositor/pages/CompositorPage'
import { SettingsPage } from './features/settings/pages/SettingsPage'
import keycloak from './keycloak'
import { PrivateRoute } from './PrivateRoute'
import { ReactKeycloakProvider } from '@react-keycloak/web'

const Pages: FunctionComponent<{ compositorSession: CompositorSession; remoteApps: RemoteApp[] }> = ({
  compositorSession,
  remoteApps,
}) => {
  return (
    <Switch>
      <Route path='/login'>
        <LoginPage />
      </Route>
      <PrivateRoute path='/'>
        <CompositorPage compositorSession={compositorSession} remoteApps={remoteApps} />
      </PrivateRoute>
      <PrivateRoute path='/settings'>
        <SettingsPage compositorSession={compositorSession} />
      </PrivateRoute>
    </Switch>
  )
}

export const App: FunctionComponent<{
  compositorSession: CompositorSession
  remoteApps: RemoteApp[]
}> = ({ compositorSession, remoteApps }) => {
  return (
    <React.StrictMode>
      <ReactKeycloakProvider authClient={keycloak}>
        <Provider store={store}>
          <CssBaseline>
            <BrowserRouter>
              <Pages compositorSession={compositorSession} remoteApps={remoteApps} />
            </BrowserRouter>
          </CssBaseline>
        </Provider>
      </ReactKeycloakProvider>
    </React.StrictMode>
  )
}
