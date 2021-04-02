import { configureStore } from '@reduxjs/toolkit'
import { compositorSaga } from '../features/compositor/compositorSaga'
import settings from '../features/settings/settingsSlice'
import compositor from '../features/compositor/compositorSlice'
import remoteApps from '../features/remote-apps/remoteAppsSlice'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    settings,
    compositor,
    remoteApps,
  },
  middleware: (getDefaultMiddleware) => {
    // the first middleware is always thunk, which we do not want
    const [, ...rest] = getDefaultMiddleware().concat(sagaMiddleware)
    return rest
  },
})

sagaMiddleware.run(compositorSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
