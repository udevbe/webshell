import { createCompositorSession, initWasm } from 'greenfield-compositor'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { RemoteApp } from './app/types/webshell'

async function main() {
  const remoteAppsResponse = await fetch('apps.json')
  const remoteApps: RemoteApp[] = await remoteAppsResponse.json()

  await initWasm()
  const compositorSession = createCompositorSession()

  ReactDOM.render(
    <App compositorSession={compositorSession} remoteApps={remoteApps} />,
    document.getElementById('root'),
  )
}

main()
