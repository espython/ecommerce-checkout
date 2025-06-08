import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { AppStore, makeStore, RootState } from '@/shared/store'

// Create a custom render function that includes Redux provider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}
export function renderWithProviders(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore(),
    ...renderOptions
  } = extendedRenderOptions
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Mock cart hooks to avoid actual API calls in tests
jest.mock('../features/cart/hooks/use-cart', () => ({
  useCart: () => ({
    updateItemQuantity: jest.fn(),
    removeItem: jest.fn(),
    addItem: jest.fn(),
    clearCart: jest.fn(),
    getCartTotal: jest.fn(() => 0),
  }),
  useCartApi: () => ({
    validateCart: jest.fn(),
    fetchCart: jest.fn(),
  }),
}))

// Export everything from React Testing Library
export * from '@testing-library/react'
export { renderWithProviders as render }
