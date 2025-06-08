import { screen } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { CartContainer } from '../components'
import { CartItem } from '../types/cart.types'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import {
  setCartItems,
  setLoading,
  setError,
} from '@/features/cart/store/cart-slice'

// Mock Redux hooks
jest.mock('@/shared/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}))

// Mock action creators
jest.mock('@/features/checkout/store/checkout-slice', () => ({
  setCurrentStep: jest.fn(),
}))

jest.mock('@/features/cart/store/cart-slice', () => ({
  setCartItems: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
}))

// Create mock variables
const mockDispatch = jest.fn()
const mockUseAppDispatch = useAppDispatch as jest.Mock
const mockUseAppSelector = useAppSelector as jest.Mock
const mockSetCurrentStep = setCurrentStep as unknown as jest.Mock
const mockSetCartItems = setCartItems as unknown as jest.Mock
const mockSetLoading = setLoading as unknown as jest.Mock

describe('CartContainer', () => {
  const mockItems: CartItem[] = [
    {
      product: {
        id: 1,
        name: 'Product 1',
        price: 19.99,
        image: '/product1.jpg',
        description: 'Description 1',
        category: 'Category 1',
        inStock: 1,
        weight: 1,
        dimensions: {
          length: 1,
          width: 1,
          height: 1,
        },
      },
      quantity: 1,
      id: 1,
      addedAt: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAppDispatch.mockReturnValue(mockDispatch)
    mockUseAppSelector.mockReturnValue(mockItems)
    mockSetCurrentStep.mockReturnValue({
      type: 'checkout/setCurrentStep',
      payload: 1,
    } as any)
    mockSetCartItems.mockReturnValue({
      type: 'cart/setCartItems',
      payload: mockItems,
    } as any)
    mockSetLoading.mockReturnValue({
      type: 'cart/setLoading',
      payload: false,
    } as any)
  })

  it('dispatches setCurrentStep and setCartItems on mount', () => {
    render(<CartContainer items={mockItems} />)

    // Check that dispatch is called with the expected actions
    expect(mockSetCurrentStep).toHaveBeenCalledWith(1)
    expect(mockSetCartItems).toHaveBeenCalledWith(mockItems)

    // There may be additional dispatches from other components or effects
    // Verify only that our expected actions were dispatched
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetCurrentStep.mock.results[0].value
    )
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetCartItems.mock.results[0].value
    )
  })

  it('passes items from Redux state to Cart component', () => {
    render(<CartContainer items={mockItems} />)

    expect(mockUseAppSelector).toHaveBeenCalled()
  })

  it('renders loading state when isLoading prop is true', () => {
    render(<CartContainer items={mockItems} isLoading={true} />)
  })
})
