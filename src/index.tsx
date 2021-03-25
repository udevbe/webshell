import { createCompositorSession, initWasm } from 'greenfield-compositor'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppNoLogin } from './AppNoLogin'
import { RemoteApps } from './types/webshell'

async function main() {
  const remoteAppsResponse = await fetch('apps.json')
  const remoteApps: RemoteApps = await remoteAppsResponse.json()

  await initWasm()
  const compositorSession = createCompositorSession()

  ReactDOM.render(
    <AppNoLogin compositorSession={compositorSession} remoteApps={remoteApps} />,
    document.getElementById('root'),
  )
}

main()
