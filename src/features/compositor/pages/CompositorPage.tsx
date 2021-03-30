import { Box, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import {
  CompositorSession,
  CompositorSurface,
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createCompositorRemoteAppLauncher,
  createCompositorRemoteSocket,
  createKeyEventFromKeyboardEvent,
  nrmlvo,
} from 'greenfield-compositor'
import React, { useEffect, useRef, useState } from 'react'
import { RemoteApp } from '../../../app/types/webshell'
import { AppMenu } from '../components/AppMenu'
import { Scene } from '../components/Compositor'
import { FileUpload } from '../components/FileUpload'
import { ShellDrawer } from '../components/ShellDrawer'
import { UserMenu } from '../components/UserMenu'

function initializeCanvas(session: CompositorSession, canvas: HTMLCanvasElement, sceneId: string) {
  // register canvas with compositor session
  session.userShell.actions.initScene(sceneId, canvas)

  // make sure the canvas has focus and receives input inputs
  canvas.onmouseover = () => canvas.focus()
  canvas.tabIndex = 1
  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.onblur = () => session.userShell.actions.input.blur()

  const keymapJSON = window.localStorage.getItem('keymap')
  if (keymapJSON) {
    const keymap: nrmlvo = JSON.parse(keymapJSON)
    session.userShell.actions.setUserConfiguration({ keyboardLayoutName: keymap.name })
  }
  const scrollFactorJSON = window.localStorage.getItem('scrollFactor')
  if (scrollFactorJSON) {
    const scrollFactor: number = JSON.parse(scrollFactorJSON)
    session.userShell.actions.setUserConfiguration({ scrollFactor })
  }

  //wire up dom input events to compositor input events
  const pointerMoveHandler = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.pointerMove(createButtonEventFromMouseEvent(event, false, sceneId))
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (canvas.onpointerrawupdate) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.onpointerrawupdate = pointerMoveHandler
  } else {
    canvas.onpointermove = pointerMoveHandler
  }

  canvas.onpointerdown = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    session.userShell.actions.input.buttonDown(createButtonEventFromMouseEvent(event, false, sceneId))
  }
  canvas.onpointerup = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.buttonUp(createButtonEventFromMouseEvent(event, true, sceneId))
    canvas.releasePointerCapture(event.pointerId)
  }
  canvas.onwheel = (event: WheelEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.axis(createAxisEventFromWheelEvent(event, sceneId))
  }
  canvas.onkeydown = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, true)
    if (keyEvent) {
      session.userShell.actions.input.key(keyEvent)
    }
  }
  canvas.onkeyup = (event: KeyboardEvent) => {
    event.stopPropagation()
    event.preventDefault()
    const keyEvent = createKeyEventFromKeyboardEvent(event, false)
    if (keyEvent) {
      session.userShell.actions.input.key(keyEvent)
    }
  }
}

function linkUserShellEvents(session: CompositorSession, activeClient: (clientId: string) => void) {
  const userShell = session.userShell

  userShell.events.notify = (variant: string, message: string) => window.alert(message)
  userShell.events.createUserSurface = (compositorSurface: CompositorSurface) => {
    userShell.actions.createView(compositorSurface, 'myOutputId')
  }
  userShell.events.updateUserSurface = (compositorSurface, state) => {
    if (state.active) {
      activeClient(compositorSurface.clientId)
    }
  }
}

export const CompositorPage = ({
  compositorSession,
  remoteApps,
}: {
  compositorSession: CompositorSession
  remoteApps: RemoteApp[]
}) => {
  const canvasParent = useRef<HTMLDivElement>(null)
  const [activeApp, setActiveApp] = useState<RemoteApp | null>(null)
  const activeAppRef = useRef(activeApp)
  useEffect(() => {
    activeAppRef.current = activeApp
  }, [activeApp])

  const [remoteAppLauncher] = useState(() =>
    createCompositorRemoteAppLauncher(compositorSession, createCompositorRemoteSocket(compositorSession)),
  )

  const launchApp = (app: RemoteApp) => {
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const getSceneCanvas = () => {
    const instance = canvasRef.current
    if (instance !== null) {
      return instance
    }
    // Lazy init
    const canvas = document.createElement('canvas')
    canvas.style.flex = '1'
    canvas.style.outline = '0'
    initializeCanvas(compositorSession, canvas, 'myOutputId')
    linkUserShellEvents(compositorSession, activeClient)
    compositorSession.globals.register()

    canvasRef.current = canvas
    return canvas
  }

  return (
    <div
      ref={canvasParent}
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
          <ShellDrawer launchApp={launchApp} remoteApps={remoteApps} showSettings={() => setShowSettings(true)} />
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
      <Scene parentRef={canvasParent} getCanvas={getSceneCanvas} />
    </div>
  )
}
