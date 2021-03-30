import { configureStore } from '@reduxjs/toolkit'
import settings from '../features/settings/settingsSlice'
import compositor from '../features/compositor/compositorSlice'
import drawer from '../features/drawer/drawerSlice'

// TODO hydrate with initialized compositor scene
// TODO hydrate with available apps
const store = configureStore({
  reducer: {
    settings,
    compositor,
    drawer,
  },
  preloadedState: {},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const createStore = () => {
  return store
}
