import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { Cart } from '@/features/cart/components/Cart'
import { useAppSelector } from '@/shared/hooks/redux'
import { useCartApi, useCart } from '../hooks/use-cart'
import { mockCartItems } from '@/test-utils/test-data'
import { selectCartStatus } from '../store/cart-selectors'

// Mock the hooks
jest.mock('@/shared/hooks/redux')
jest.mock('../hooks/use-cart', () => ({
  useCartApi: jest.fn(),
  useCart: jest.fn(),
}))

const mockUseAppSelector = jest.mocked(useAppSelector)
const mockUseCartApi = jest.mocked(useCartApi)
const mockUseCart = jest.mocked(useCart)

// Helper function to create a selector implementation
const createSelectorMock = (errorValue: string | null = null) => {
  return (selector: any) => {
    // For selectCartStatus selector
    if (selector === selectCartStatus) {
      return { error: errorValue, isLoading: false }
    }
    // For selectCartItems and any other selector that expects an array
    return mockCartItems
  }
}

describe('Cart', () => {
  const mockValidateCart = jest.fn()
  const mockUpdateItemQuantity = jest.fn()
  const mockRemoveItem = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Default selector implementation
    mockUseAppSelector.mockImplementation(createSelectorMock(null))

    mockUseCartApi.mockReturnValue({
      clearCart: jest.fn(),
      validateCart: mockValidateCart,
      isLoading: false,
      isFetching: false,
      isClearing: false,
      isValidating: false,
      error: undefined,
      cartItemsFromApi: undefined,
    })

    // Mock useCart hook for CartItem component
    mockUseCart.mockReturnValue({
      cart: {
        items: mockCartItems,
        subtotal: 100,
        totalItems: 8,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      },
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      updateItemQuantity: mockUpdateItemQuantity,
      clearAllItems: jest.fn(),
      validateItems: jest.fn(),
      applyDiscountCoupon: jest.fn(),
      removeDiscountCoupon: jest.fn(),
    })
  })

  it('renders loading skeleton when isLoading is true', () => {
    render(<Cart items={mockCartItems} isLoading={true} />)

    // CartSkeleton is mocked in jest.setup.js, but we can check that the component renders
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
  })

  it('renders error message when there is an error', () => {
    // Override the mock for this test case only
    mockUseAppSelector.mockImplementation(
      createSelectorMock('Failed to load cart')
    )

    render(<Cart items={mockCartItems} />)

    expect(screen.getByText('Error loading cart')).toBeInTheDocument()
    expect(screen.getByText('Failed to load cart')).toBeInTheDocument()

    // Test retry button
    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)
    expect(mockValidateCart).toHaveBeenCalled()
  })

  it('renders empty cart message when there are no items', () => {
    render(<Cart items={[]} />)

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(
      screen.getByText(
        "Looks like you haven't added any items to your cart yet."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /continue shopping/i })
    ).toBeInTheDocument()
  })

  it('does not render continue shopping button when hideControls is true', () => {
    render(<Cart items={[]} hideControls={true} />)

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /continue shopping/i })
    ).not.toBeInTheDocument()
  })

  it('does not render retry button when hideControls is true and there is an error', () => {
    // Override the mock for this test case only
    mockUseAppSelector.mockImplementation(
      createSelectorMock('Failed to load cart')
    )

    render(<Cart items={mockCartItems} hideControls={true} />)

    expect(screen.getByText('Error loading cart')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /try again/i })
    ).not.toBeInTheDocument()
  })

  it('renders cart items when there are items', () => {
    // Ensure we have a proper array for any selectors that need it
    mockUseAppSelector.mockImplementation(createSelectorMock(null))

    render(<Cart items={mockCartItems} />)

    // This is a partial test as we're mocking CartItem component in real usage
    expect(
      screen.getByText(/order summary/i, { exact: false })
    ).toBeInTheDocument()
  })
})
