// src/shared/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'

import { persistedReducer } from './root-reducer'
import { apiSlice } from './api-slice'
import { middleware } from './middleware'

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
          ignoredPaths: ['items.dates'],
        },
      }).concat(apiSlice.middleware, ...middleware),
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const store = makeStore()
export const persistor = persistStore(store)
