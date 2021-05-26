import {
  CompositorClient,
  CompositorSession,
  CompositorSurface,
  CompositorSurfaceState,
  createAxisEventFromWheelEvent,
  createButtonEventFromMouseEvent,
  createCompositorSession,
  createKeyEventFromKeyboardEvent,
  initWasm,
  nrmlvo,
} from 'greenfield-compositor'
import { call, fork, getContext, put, setContext, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { remoteAppsSaga } from '../remote-apps/remoteAppsSaga'
import { settingsSaga } from '../settings/settingsSaga'
import { PayloadActionFromCreator } from '../type-utils'
import {
  clearActiveClient,
  closeApp,
  forceSceneRedraw,
  markClientActive,
  markCompositorReady,
  scene,
} from './compositorSlice'

type CompositorSurfaceEvent = {
  surface: CompositorSurface
  state: CompositorSurfaceState
}

function* initializeScene(session: CompositorSession, canvas: HTMLCanvasElement, sceneId: string) {
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

function* handleUpdateUserSurfaceEvent(updateEvent: CompositorSurfaceEvent) {
  if (updateEvent.state.active) {
    const client = { id: updateEvent.surface.clientId }
    yield setContext({ activeClient: client })
    yield put(markClientActive({ client: { id: updateEvent.surface.clientId } }))
  }
}

function* watchUpdateUserSurface(session: CompositorSession) {
  const userShell = session.userShell

  const updateUserSurfaceChannel = eventChannel<CompositorSurfaceEvent>((cb) => {
    userShell.events.updateUserSurface = (surface, state) => cb({ surface, state })
    return () => (userShell.events.updateUserSurface = undefined)
  })
  while (true) {
    const updateEvent: CompositorSurfaceEvent = yield take(updateUserSurfaceChannel)
    yield call(handleUpdateUserSurfaceEvent, updateEvent)
  }
}

function* handleDestroyApplicationClient(destroyedClient: CompositorClient) {
  const client: { id: string } | undefined = yield getContext('activeClient')
  if (client?.id === destroyedClient.id) {
    yield put(clearActiveClient)
  }
}

function* watchDestroyApplicationClient(session: CompositorSession) {
  const userShell = session.userShell

  const destroyApplicationClientChannel = eventChannel<CompositorClient>((cb) => {
    userShell.events.destroyApplicationClient = (client) => cb(client)
    return () => (userShell.events.destroyApplicationClient = undefined)
  })
  while (true) {
    const destroyedClient: CompositorClient = yield take(destroyApplicationClientChannel)
    yield call(handleDestroyApplicationClient, destroyedClient)
  }
}

function* watchUserShellEvents(session: CompositorSession) {
  const userShell = session.userShell

  userShell.events.notify = (variant: string, message: string) => window.alert(message)
  userShell.events.createUserSurface = (compositorSurface: CompositorSurface) =>
    userShell.actions.createView(compositorSurface, 'default')

  yield fork(watchUpdateUserSurface, session)
  yield fork(watchDestroyApplicationClient, session)
}

function* handleCloseApp(session: CompositorSession, action: PayloadActionFromCreator<typeof closeApp>) {
  const id = action.payload.app.clientId
  if (id) {
    yield call(session.userShell.actions.closeClient, { id })
  }
}

function* handleForceSceneRedraw(session: CompositorSession) {
  yield call(session.userShell.actions.refreshScene, 'default')
}

function* watchAllEvents(session: CompositorSession) {
  yield fork(watchUserShellEvents, session)
  yield takeEvery(closeApp.type, handleCloseApp, session)
  yield takeLatest(forceSceneRedraw.type, handleForceSceneRedraw, session)
}

function* done(session: CompositorSession) {
  session.globals.register()
  yield put(markCompositorReady())
}

export function* compositorSaga(): any {
  yield call(initWasm)
  const session: CompositorSession = yield call(createCompositorSession)
  yield setContext({ session })
  yield fork(remoteAppsSaga, session)
  yield fork(settingsSaga, session)
  yield fork(watchAllEvents, session)
  yield call(initializeScene, session, scene, 'default')
  yield call(done, session)
}
