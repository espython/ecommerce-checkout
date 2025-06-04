import storage from 'redux-persist/lib/storage'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import { PersistConfig } from 'redux-persist/es/types'
import { RootState } from './index'
import { apiSlice } from './api-slice'

/**
 * Configuration for Redux Persist
 * - Whitelist specifies which reducers to persist (only include what's necessary)
 * - Blacklist specifies which reducers to exclude from persistence
 */
export const persistConfig: PersistConfig<RootState> = {
  key: 'ecommerce-checkout-root',
  version: 1,
  storage,
  whitelist: ['cart'], // Only persist the cart for now
  blacklist: ['api'], // Never persist API cache
}

/**
 * Contains all actions that should be ignored by the serializability middleware
 * because Redux Persist actions aren't serializable
 */
export const persistActions = [
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
]

/**
 * Helper for creating serializableCheck configuration
 */
export const getSerializableCheckConfig = () => ({
  ignoredActions: [
    ...persistActions.map((action) => action.toString()),
    // Add any other non-serializable actions here
  ],
  ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
  ignoredPaths: [
    // Ignore specific non-serializable paths in the state
    'items.dates',
  ],
})
