// src/shared/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'

import { rootReducer } from './rootReducer'
import { rtkQueryErrorLogger } from './middleware'

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
          ignoredPaths: ['items.dates'],
        },
      }).concat(rtkQueryErrorLogger),
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const store = makeStore()
export const persistor = persistStore(store)
