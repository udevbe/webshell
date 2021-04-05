import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nrmlvo } from 'greenfield-compositor'
import type { RootState } from '../../app/store'

interface SettingsState {
  activeKeymap?: nrmlvo
  keymaps: nrmlvo[]
  scrollFactor: number
  loading: boolean
}

const initialState: SettingsState = {
  activeKeymap: undefined,
  scrollFactor: 1,
  keymaps: [],
  loading: true,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setKeymaps(state, action: PayloadAction<{ keymaps: nrmlvo[] }>) {
      state.keymaps = action.payload.keymaps
    },
    configureScrollFactor(state, action: PayloadAction<{ scrollFactor: number }>) {
      state.scrollFactor = action.payload.scrollFactor
    },
    configureKeymap(state, action: PayloadAction<{ keymap: nrmlvo }>) {
      state.activeKeymap = action.payload.keymap
    },
    settingsDone(state) {
      state.loading = false
    },
  },
})

export const { settingsDone, setKeymaps, configureKeymap, configureScrollFactor } = settingsSlice.actions

export const selectScrollFactor = (state: RootState): number => state.settings.scrollFactor
export const selectActiveKeymap = (state: RootState): nrmlvo | undefined => state.settings.activeKeymap
export const selectKeymaps = (state: RootState): nrmlvo[] => state.settings.keymaps
export const selectSettingsLoading = (state: RootState): boolean => state.settings.loading

export default settingsSlice.reducer
