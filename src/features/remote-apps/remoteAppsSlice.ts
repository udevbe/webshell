import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { RemoteApp, RemoteClient } from './types'

// TODO refactor using redux toolkit entity adapter

interface remoteAppsState {
  apps: RemoteApp[]
  appsLoading: boolean
  busyLaunches: RemoteApp[]
  lastSuccessLaunch?: RemoteApp
  lastFailedLaunch?: RemoteApp
}

const initialState: remoteAppsState = {
  apps: [],
  appsLoading: true,
  busyLaunches: [],
  lastSuccessLaunch: undefined,
  lastFailedLaunch: undefined,
}

export const remoteAppsSlice = createSlice({
  name: 'remoteApps',
  initialState,
  reducers: {
    addApps(state, action: PayloadAction<{ apps: RemoteApp[] }>) {
      state.apps = action.payload.apps
    },
    markAppsReady(state) {
      state.appsLoading = false
    },
    appStopped(state, action: PayloadAction<{ app: RemoteApp }>) {
      const foundApp = state.apps.find((app) => app.id === action.payload.app.id)
      if (foundApp) {
        foundApp.clientId = undefined
      }
    },
    appLaunchBusy(state, action: PayloadAction<{ app: RemoteApp }>) {
      state.busyLaunches.push(action.payload.app)
    },
    appLaunchSuccess(state, action: PayloadAction<{ app: RemoteApp; client: RemoteClient }>) {
      state.busyLaunches = state.busyLaunches.filter((app) => app.id !== action.payload.app.id)
      const foundApp = state.apps.find((app) => app.id === action.payload.app.id)
      if (foundApp) {
        foundApp.clientId = action.payload.client.id
      }
      state.lastSuccessLaunch = action.payload.app
    },
    appLaunchFailed(state, action: PayloadAction<{ app: RemoteApp; error: Error }>) {
      state.busyLaunches = state.busyLaunches.filter((app) => app.id !== action.payload.app.id)
      state.lastFailedLaunch = action.payload.app
    },
  },
})

export const { addApps, markAppsReady, appStopped, appLaunchBusy, appLaunchSuccess, appLaunchFailed } =
  remoteAppsSlice.actions

export const appLaunch = createAction<{ app: RemoteApp }, 'launcher/appLaunch'>('launcher/appLaunch')
export const refreshApps = createAction('launcher/refreshApps')

export const selectLastFailedLaunch = (state: RootState) => state.remoteApps.lastFailedLaunch
export const selectLastSuccessLaunch = (state: RootState) => state.remoteApps.lastSuccessLaunch
export const selectBusyAppLaunches = (state: RootState) => state.remoteApps.busyLaunches
export const selectAppByClientId =
  (clientId: string | undefined) =>
  (state: RootState): RemoteApp | undefined =>
    state.remoteApps.apps.find((app) => (clientId ? app.clientId === clientId : false))
export const selectAppByAppId =
  (appId: string | undefined) =>
  (state: RootState): RemoteApp | undefined =>
    state.remoteApps.apps.find((app) => (appId ? app.id === appId : false))
export const selectAllApps = (state: RootState): RemoteApp[] => state.remoteApps.apps
export const selectAppDisoveryLoading = (state: RootState): boolean => state.remoteApps.appsLoading

export default remoteAppsSlice.reducer
