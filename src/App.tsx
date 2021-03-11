import { CssBaseline } from '@material-ui/core'
import { CompositorSession } from 'greenfield-compositor'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ChangePasswordPage } from './pages/ChangePasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { WebShellPage } from './pages/WebShellPage'
import { PrivateRoute } from './PrivateRoute'
import { SupabaseContextProvider } from './SupaBaseContext'
import { RemoteApps } from './types/webshell'

export const App = ({
  compositorSession,
  remoteApps,
}: {
  compositorSession: CompositorSession
  remoteApps: RemoteApps
}) => {
  return (
    <React.StrictMode>
      <SupabaseContextProvider>
        <CssBaseline>
          <BrowserRouter>
            <Switch>
              <Route path='/login'>
                <LoginPage />
              </Route>
              <Route path='/resetpassword'>
                <ResetPasswordPage />
              </Route>
              <PrivateRoute path='/changepassword'>
                <ChangePasswordPage />
              </PrivateRoute>
              <PrivateRoute path='/'>
                <WebShellPage compositorSession={compositorSession} remoteApps={remoteApps} />
              </PrivateRoute>
            </Switch>
          </BrowserRouter>
        </CssBaseline>
      </SupabaseContextProvider>
    </React.StrictMode>
  )
}
