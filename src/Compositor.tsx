import {
  CompositorSession,
  CompositorSurface,
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createKeyEventFromKeyboardEvent,
} from 'greenfield-compositor'
import React, { useEffect, useRef } from 'react'

function initializeCanvas(session: CompositorSession, canvas: HTMLCanvasElement, sceneId: string) {
  // register canvas with compositor session
  session.userShell.actions.initScene(sceneId, canvas)

  // make sure the canvas has focus and receives input inputs
  canvas.onmouseover = () => canvas.focus()
  canvas.tabIndex = 1
  // don't show browser context menu on right click
  canvas.oncontextmenu = (event: MouseEvent) => event.preventDefault()
  canvas.onblur = () => session.userShell.actions.input.blur()

  //wire up dom input events to compositor input events
  canvas.onpointermove = (event: PointerEvent) => {
    event.stopPropagation()
    event.preventDefault()
    session.userShell.actions.input.pointerMove(createButtonEventFromMouseEvent(event, false, sceneId))
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

export const CompositorScene = (props: {
  compositorSession: CompositorSession
  onActiveClient: (clientId: string) => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      initializeCanvas(props.compositorSession, canvas, 'myOutputId')
      linkUserShellEvents(props.compositorSession, props.onActiveClient)
      props.compositorSession.globals.register()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        flex: 1,
        outline: 0,
      }}
    />
  )
}
