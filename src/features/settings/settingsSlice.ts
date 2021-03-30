import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nrmlvo } from 'greenfield-compositor'
import type { RootState } from '../../app/store'

interface SettingsState {
  keymap?: nrmlvo
  availableKeymaps: nrmlvo[]
  scrollFactor: number
}

const initialState: SettingsState = {
  keymap: undefined,
  scrollFactor: 1,
  availableKeymaps: [],
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    configureScrollFactor: (state, action: PayloadAction<{ scrollFactor: number }>) => {
      state.scrollFactor = action.payload.scrollFactor
    },
    configureKeymap: (state, action: PayloadAction<{ keymap: nrmlvo }>) => {
      state.keymap = action.payload.keymap
    },
  },
})

export const { configureKeymap, configureScrollFactor } = settingsSlice.actions

export const selectScrollFactor = (state: RootState) => state.settings.scrollFactor
export const selectKeymap = (state: RootState) => state.settings.keymap
export const selectAvailableKeymaps = (state: RootState) => state.settings.availableKeymaps

export default settingsSlice.reducer
