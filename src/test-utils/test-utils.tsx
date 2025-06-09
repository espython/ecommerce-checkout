import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { AppStore } from '@/shared/store'
import cartSlice, {
  initialState as cartInitialState,
} from '@/features/cart/store/cart-slice'
import shippingSlice from '@/features/shipping/store/shipping-slice'
import checkoutSlice from '@/features/checkout/store/checkout-slice'
import { apiSlice } from '@/shared/store/api-slice'

// Create a custom render function that includes Redux provider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

// Create a test store with proper initial state
function createTestStore(preloadedState: Partial<RootState> = {}) {
  const rootReducer = {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSlice,
    shipping: shippingSlice,
    checkout: checkoutSlice,
  }

  return configureStore({
    reducer: rootReducer as any,
    preloadedState: {
      cart: cartInitialState,
      shipping: { address: null, saveAddress: false },
      checkout: {
        steps: [
          { id: 1, name: 'Cart Review', path: '/checkout', completed: false },
          {
            id: 2,
            name: 'Shipping Information',
            path: '/checkout/shipping',
            completed: false,
          },
          {
            id: 3,
            name: 'Payment',
            path: '/checkout/payment',
            completed: false,
          },
          {
            id: 4,
            name: 'Confirmation',
            path: '/checkout/confirmation',
            completed: false,
          },
        ],
        currentStepId: 1,
        isComplete: false,
      },
      ...preloadedState,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [apiSlice.util.resetApiState.type],
        },
      }).concat(apiSlice.middleware),
  })
}

export function renderWithProviders(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = createTestStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Make sure your AppStore definition includes the API slice
export type RootState = {
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>
  cart: ReturnType<typeof cartSlice>
  shipping: ReturnType<typeof shippingSlice>
  checkout: ReturnType<typeof checkoutSlice>
}

// Export everything from React Testing Library
export * from '@testing-library/react'
export { renderWithProviders as render }
