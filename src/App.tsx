import { CssBaseline } from '@material-ui/core'
import { CompositorSession } from 'greenfield-compositor'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import keycloak from './keycloak'
import { LoginPage } from './pages/LoginPage'
import { WebShellPage } from './pages/WebShellPage'
import { PrivateRoute } from './PrivateRoute'
import { RemoteApps } from './types/webshell'
import { ReactKeycloakProvider } from '@react-keycloak/web'

const Pages = ({ compositorSession, remoteApps }: { compositorSession: CompositorSession; remoteApps: RemoteApps }) => {
  return (
    <Switch>
      <Route path='/login'>
        <LoginPage />
      </Route>
      <PrivateRoute path='/'>
        <WebShellPage compositorSession={compositorSession} remoteApps={remoteApps} />
      </PrivateRoute>
    </Switch>
  )
}

export const App = ({
  compositorSession,
  remoteApps,
}: {
  compositorSession: CompositorSession
  remoteApps: RemoteApps
}) => {
  return (
    <React.StrictMode>
      <ReactKeycloakProvider authClient={keycloak}>
        <CssBaseline>
          <BrowserRouter>
            <Pages compositorSession={compositorSession} remoteApps={remoteApps} />
          </BrowserRouter>
        </CssBaseline>
      </ReactKeycloakProvider>
    </React.StrictMode>
  )
}
