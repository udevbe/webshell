import { createCompositorSession, initWasm } from 'greenfield-compositor'
import React from 'react'
import ReactDOM from 'react-dom'
import { App, RemoteApps } from './App'

async function main() {
  const remoteAppsResponse = await fetch('apps.json')
  const remoteApps: RemoteApps = await remoteAppsResponse.json()

  await initWasm()
  const compositorSession = createCompositorSession()

  ReactDOM.render(
    <React.StrictMode>
      <App compositorSession={compositorSession} remoteApps={remoteApps} />
    </React.StrictMode>,
    document.getElementById('root'),
  )
}

main()
