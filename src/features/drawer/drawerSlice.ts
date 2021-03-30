import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface DrawerState {
  drawerVisible: boolean
}

const initialState: DrawerState = {
  drawerVisible: false,
}

export const drawer = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    showDrawer: (state) => {
      state.drawerVisible = true
    },
    hideDrawer: (state) => {
      state.drawerVisible = false
    },
  },
})

export const { showDrawer, hideDrawer } = drawer.actions

export const selectDrawerVisible = (state: RootState) => state.drawer.drawerVisible

export default drawer.reducer
