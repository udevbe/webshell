import { CssBaseline } from '@material-ui/core'
import { createCompositorSession, initWasm } from 'greenfield-compositor'
import React from 'react'
import ReactDOM from 'react-dom'
import { Shell, RemoteApps } from './Shell'
import { Auth } from './Auth'
import { SupabaseContextProvider } from './SupaBaseContext'

async function main() {
  const remoteAppsResponse = await fetch('apps.json')
  const remoteApps: RemoteApps = await remoteAppsResponse.json()

  await initWasm()
  const compositorSession = createCompositorSession()

  ReactDOM.render(
    <React.StrictMode>
      <SupabaseContextProvider>
        <CssBaseline>
          <Auth>
            <Shell compositorSession={compositorSession} remoteApps={remoteApps} />
          </Auth>
        </CssBaseline>
      </SupabaseContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  )
}

main()
