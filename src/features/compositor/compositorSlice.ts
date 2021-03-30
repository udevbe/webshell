import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { RemoteApp } from '../../app/types/webshell'

interface CompositorState {
  scene: HTMLCanvasElement
  activeApp?: RemoteApp
  availableApps: RemoteApp[]
}

const initialState: CompositorState = {
  scene: document.createElement('canvas'),
  activeApp: undefined,
  availableApps: [],
}

export const compositorSlice = createSlice({
  name: 'compositor',
  initialState,
  reducers: {
    makeAppActive: (state, action: PayloadAction<{ app: RemoteApp }>) => {
      state.activeApp = action.payload.app
    },
    closeActiveApp: (state) => {
      state.activeApp = undefined
    },
  },
})

export const { makeAppActive, closeActiveApp } = compositorSlice.actions

export const selectActiveApp = (state: RootState) => state.compositor.activeApp

export default compositorSlice.reducer
