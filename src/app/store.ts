import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistCombineReducers, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { compositorSaga } from '../features/compositor/compositorSaga'
import settings from '../features/settings/settingsSlice'
import compositor from '../features/compositor/compositorSlice'
import remoteApps from '../features/remote-apps/remoteAppsSlice'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()

const allReducers = {
  settings,
  compositor,
  remoteApps,
} as const
const persistingReducer = persistCombineReducers(
  {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['settings'],
  },
  allReducers,
)

export const store = configureStore({
  reducer: persistingReducer,
  middleware: (getDefaultMiddleware) => {
    // the first middleware is always thunk, which we do not want
    const [, ...rest] = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware)
    return rest
  },
})

export const persistor = persistStore(store, undefined, () => {
  sagaMiddleware.run(compositorSaga)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
