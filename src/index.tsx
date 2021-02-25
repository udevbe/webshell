import { createCompositorSession, initWasm } from 'greenfield-compositor'
import React from 'react'
import ReactDOM from 'react-dom'
import { ShellAuth } from './Auth'
import reportWebVitals from './reportWebVitals'

async function main() {
  // TODO loading screen
  // load web assembly libraries
  await initWasm()
  const session = createCompositorSession()

  ReactDOM.render(
    <React.StrictMode>
      <ShellAuth compositorSession={session}></ShellAuth>
    </React.StrictMode>,
    document.getElementById('root'),
  )
}

main()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
