import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { RemoteApp } from '../remote-apps/types'

interface CompositorState {
  activeClient?: { id: string }
  loading: boolean
}

export const scene: HTMLCanvasElement = document.createElement('canvas')

const initialState: CompositorState = {
  activeClient: undefined,
  loading: true,
}

export const compositorSlice = createSlice({
  name: 'compositor',
  initialState,
  reducers: {
    markClientActive(state, action: PayloadAction<{ client: { id: string } }>) {
      state.activeClient = action.payload.client
    },
    clearActiveClient(state) {
      state.activeClient = undefined
    },
    markCompositorReady(state) {
      state.loading = false
    },
  },
})

export const { markClientActive, clearActiveClient, markCompositorReady } = compositorSlice.actions
export const closeApp = createAction<{ app: RemoteApp }, 'compositor/closeApp'>('compositor/closeApp')
export const forceSceneRedraw = createAction('compositor/forceSceneRedraw')

export const selectActiveClient = (state: RootState) => state.compositor.activeClient
export const selectCompositorLoading = (state: RootState) => state.compositor.loading

export default compositorSlice.reducer
