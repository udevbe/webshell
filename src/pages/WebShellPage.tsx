import { Box, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import {
  CompositorSession,
  createCompositorRemoteAppLauncher,
  createCompositorRemoteSocket,
} from 'greenfield-compositor'
import React, { useEffect, useRef, useState } from 'react'
import { AppMenu } from '../components/AppMenu'
import { CompositorScene } from '../components/Compositor'
import { FileUpload } from '../components/FileUpload'
import { ShellDrawer } from '../components/ShellDrawer'
import { RemoteApps } from '../types/webshell'
import { UserMenu } from '../components/UserMenu'

export const WebShellPage = ({
  compositorSession,
  remoteApps,
}: {
  compositorSession: CompositorSession
  remoteApps: RemoteApps
}) => {
  const [activeApp, setActiveApp] = useState<RemoteApps[keyof RemoteApps] | null>(null)
  const activeAppRef = useRef(activeApp)
  useEffect(() => {
    activeAppRef.current = activeApp
  }, [activeApp])

  const [remoteAppLauncher] = useState(() =>
    createCompositorRemoteAppLauncher(compositorSession, createCompositorRemoteSocket(compositorSession)),
  )

  const launchApp = (appId: keyof RemoteApps) => {
    const app = remoteApps[appId]
    if (app.client) {
      return
    }

    remoteAppLauncher.launchURL(new URL(app.url)).then((client) => {
      app.client = client
      client.onClose().then(() => {
        if (activeAppRef.current?.client === client) {
          setActiveApp(null)
        }
        app.client = undefined
      })
    })
  }

  const activeClient = (clientId: string) => {
    const result = Object.entries(remoteApps).find(([, value]) => value.client?.id === clientId)
    if (result) {
      const [, app] = result
      setActiveApp(app)
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url("./background_pattern.png")',
        backgroundRepeat: 'repeat',
      }}
    >
      <AppBar position='static' color='default' variant='outlined'>
        <Toolbar variant='dense'>
          <ShellDrawer launchApp={launchApp} remoteApps={remoteApps} />
          <FileUpload />
          <Box
            mt={0.25}
            mr={2}
            pr={1}
            pl={1}
            width={186}
            height={48}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {activeApp ? (
              <AppMenu activeApp={activeApp} />
            ) : (
              <Typography color='textSecondary' variant='caption'>
                No Application active
              </Typography>
            )}
          </Box>
          <Box
            mr={4}
            display='flex'
            flex={1}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <Box
            mt={0.25}
            pr={1}
            pl={1}
            height={48}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <CompositorScene compositorSession={compositorSession} onActiveClient={activeClient} />
    </div>
  )
}
