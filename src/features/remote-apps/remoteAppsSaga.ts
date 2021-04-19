import {
  CompositorRemoteAppLauncher,
  CompositorRemoteSocket,
  CompositorSession,
  createCompositorRemoteAppLauncher,
  createCompositorRemoteSocket,
} from 'greenfield-compositor'
import type { Client } from 'westfield-runtime-server'
import RemoteAppLauncher from 'greenfield-compositor/types/RemoteAppLauncher'
import { call, fork, put, select, takeEvery } from 'redux-saga/effects'
import { PayloadActionFromCreator } from '../type-utils'
import {
  addApps,
  appLaunch,
  appLaunchBusy,
  appLaunchFailed,
  appLaunchSuccess,
  appStopped,
  markAppsReady,
  selectBusyAppLaunches,
} from './remoteAppsSlice'
import { RemoteApp } from './types'

function* handleAppLaunch(
  remoteAppLauncher: CompositorRemoteAppLauncher,
  action: PayloadActionFromCreator<typeof appLaunch>,
) {
  const app = action.payload.app

  // make sure we don't launch an app multiple times
  const busyAppLaunches: RemoteApp[] = yield select(selectBusyAppLaunches)
  if (busyAppLaunches.find((busyAppLaunch) => busyAppLaunch.id === app.id) !== undefined) {
    return
  }

  yield put(appLaunchBusy({ app }))
  const { url, id } = app
  try {
    const client: Client = yield call([remoteAppLauncher, remoteAppLauncher.launch], new URL(url), id)
    yield put(appLaunchSuccess({ app, client: { id: client.id } }))
    yield call([client, client.onClose])
    yield put(appStopped({ app }))
  } catch (error) {
    yield put(appLaunchFailed({ app, error }))
  }
}

function* initLauncher(compositorSession: CompositorSession) {
  const remoteSocket: CompositorRemoteSocket = yield call(createCompositorRemoteSocket, compositorSession)
  const remoteAppLauncher: RemoteAppLauncher = yield call(
    createCompositorRemoteAppLauncher,
    compositorSession,
    remoteSocket,
  )

  yield takeEvery(appLaunch.type, handleAppLaunch, remoteAppLauncher)
}

function* fetchJSONApps() {
  const remoteAppsResponse: Response = yield call(fetch, 'apps.json')
  const apps: RemoteApp[] = yield call([remoteAppsResponse, 'json'])
  yield put(addApps({ apps }))
  yield put(markAppsReady())
}

export function* remoteAppsSaga(compositorSession: CompositorSession): any {
  yield fork(fetchJSONApps)
  yield fork(initLauncher, compositorSession)
}
