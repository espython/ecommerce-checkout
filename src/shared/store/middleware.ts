import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { apiSlice } from './api-slice'

/**
 * Log any rejected RTK Query actions for debugging
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood
    // so we can detect unsuccessful requests by checking for rejected actions
    if (isRejectedWithValue(action)) {
      console.error('API error:', action.payload)
      // Here you could also dispatch an action to show an error toast notification
      // dispatch(showErrorToast(action.payload))
    }

    return next(action)
  }

// Export all middleware
export const middleware = [apiSlice.middleware, rtkQueryErrorLogger]
