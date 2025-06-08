import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { CartItem } from '../CartItem'
import { useCart } from '../../hooks/use-cart'
import { mockCartItems } from '@/test-utils/test-data'

// Mock the useCart hook
jest.mock('../../hooks/use-cart')
const mockUseCart = jest.mocked(useCart)

describe('CartItem', () => {
  const mockUpdateItemQuantity = jest.fn()
  const mockRemoveItem = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCart.mockReturnValue({
      cart: {
        items: [],
        subtotal: 0,
        totalItems: 0,
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

  it('renders with correct product details', () => {
    render(<CartItem item={mockCartItems[0]} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Size: M')).toBeInTheDocument()
    expect(screen.getByText('Color: Red')).toBeInTheDocument()
    expect(screen.getByText('$19.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('calls updateItemQuantity when increasing quantity', () => {
    render(<CartItem item={mockCartItems[0]} />)

    const increaseButton = screen.getByRole('button', {
      name: /increase quantity/i,
    })
    fireEvent.click(increaseButton)

    expect(mockUpdateItemQuantity).toHaveBeenCalledWith(1, 3)
  })

  it('calls updateItemQuantity when decreasing quantity if quantity > 1', () => {
    render(<CartItem item={mockCartItems[0]} />)

    const decreaseButton = screen.getByRole('button', {
      name: /decrease quantity/i,
    })
    fireEvent.click(decreaseButton)

    expect(mockUpdateItemQuantity).toHaveBeenCalledWith(1, 1)
  })

  it('calls removeItem when decreasing quantity if quantity is 1', () => {
    const itemWithQuantityOne = {
      ...mockCartItems[0],
      quantity: 1,
    }

    render(<CartItem item={itemWithQuantityOne} />)

    const decreaseButton = screen.getByRole('button', {
      name: /decrease quantity/i,
    })
    fireEvent.click(decreaseButton)

    expect(mockRemoveItem).toHaveBeenCalledWith(1)
    expect(mockUpdateItemQuantity).not.toHaveBeenCalled()
  })

  it('calls removeItem when remove button is clicked', () => {
    render(<CartItem item={mockCartItems[0]} />)

    // Find by SVG path that's unique to the trash icon
    // This is more reliable than looking for aria-label or text
    const removeButton =
      document.querySelector('.lucide-trash2') ||
      document.querySelector('.lucide-trash-2')
    if (!removeButton) {
      throw new Error('Trash button not found in the document')
    }

    // Click the parent button element
    const buttonElement = removeButton.closest('button')
    if (!buttonElement) {
      throw new Error('Button element containing trash icon not found')
    }

    fireEvent.click(buttonElement)

    expect(mockRemoveItem).toHaveBeenCalledWith(1)
  })

  it('renders without variant information when not provided', () => {
    const itemWithoutVariant = {
      ...mockCartItems[0],
      selectedVariant: undefined,
    }

    render(<CartItem item={itemWithoutVariant} />)

    expect(screen.queryByText('Size:')).not.toBeTruthy()
    expect(screen.queryByText('Color:')).not.toBeTruthy()
  })
})
