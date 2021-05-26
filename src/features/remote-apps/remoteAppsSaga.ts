import {
  CompositorRemoteSocket,
  CompositorSession,
  createCompositorProxyConnector,
  createCompositorRemoteSocket,
} from 'greenfield-compositor'
import type RemoteAppLauncher from 'greenfield-compositor/types/RemoteAppLauncher'
import type { Client } from 'westfield-runtime-server'
import { call, delay, fork, getContext, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import { application } from '../../api'
import {
  InlineResponse200,
  InlineResponse2001,
  InlineResponse2001PhaseEnum,
  InlineResponse201,
} from '../../api/application'
import { PayloadActionFromCreator } from '../type-utils'
import {
  addApps,
  appLaunch,
  appLaunchBusy,
  appLaunchFailed,
  appLaunchSuccess,
  appStopped,
  markAppsReady,
  refreshApps,
  selectBusyAppLaunches,
} from './remoteAppsSlice'
import { RemoteApp } from './types'

function* handleAppLaunch(remoteAppLauncher: RemoteAppLauncher, action: PayloadActionFromCreator<typeof appLaunch>) {
  const app = action.payload.app

  // make sure we don't launch an app multiple times
  const busyAppLaunches: RemoteApp[] = yield select(selectBusyAppLaunches)
  if (busyAppLaunches.find((busyAppLaunch) => busyAppLaunch.id === app.id) !== undefined) {
    return
  }

  yield put(appLaunchBusy({ app }))
  const session: CompositorSession = yield getContext('session')

  const instance: InlineResponse201 = yield call([application, application.postApplicationInstances], {
    applicationname: app.id,
    inlineObject: {
      compositorid: session.compositorSessionId,
    },
  })

  let appInstance: InlineResponse2001
  do {
    appInstance = yield call([application, application.getApplicationInstance], { instanceid: instance.id })
    yield delay(500)
  } while (appInstance.phase === InlineResponse2001PhaseEnum.Pending)

  if (appInstance.phase !== InlineResponse2001PhaseEnum.Running || appInstance.websocketurl === undefined) {
    // TODO notify app launch failure
    console.error('failed to launch app.')
    return
  }

  try {
    const websocketProtocol = location.protocol === 'https:' ? 'wss' : 'ws'
    const url = new URL(`${websocketProtocol}://${appInstance.websocketurl}`)
    url.searchParams.append('compositorSessionId', session.compositorSessionId)

    const client: Client = yield call([remoteAppLauncher, remoteAppLauncher.connectTo], url)
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
    createCompositorProxyConnector,
    compositorSession,
    remoteSocket,
  )

  yield takeEvery(appLaunch.type, handleAppLaunch, remoteAppLauncher)
}

function* fetchJSONApps() {
  const { applications }: InlineResponse200 = yield call([application, application.getApplications])
  const apps: RemoteApp[] = applications.map((application) => {
    return {
      id: application.name,
      title: application.friendlyname,
      icon: application.icon,
    }
  })

  yield put(addApps({ apps }))
  yield put(markAppsReady())
}

function* watchRefreshAppsRequest() {
  yield takeLatest(refreshApps, fetchJSONApps)
}
export function* remoteAppsSaga(compositorSession: CompositorSession) {
  yield fork(watchRefreshAppsRequest)
  yield fork(initLauncher, compositorSession)
}
