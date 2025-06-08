import { fireEvent, screen } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { CartItem } from '../CartItem'
import { useCart } from '../../hooks/use-cart'
import { mockCartItems } from '@/test-utils/test-data'

// Mock the useCart hook
jest.mock('../../hooks/use-cart')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

describe('CartItem', () => {
  const mockUpdateItemQuantity = jest.fn()
  const mockRemoveItem = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCart.mockReturnValue({
      updateItemQuantity: mockUpdateItemQuantity,
      removeItem: mockRemoveItem,
      addItem: jest.fn(),
      clearCart: jest.fn(),
      getCartTotal: jest.fn(() => 0),
    })
  })

  it('renders with correct product details', () => {
    render(<CartItem item={mockCartItems[0]} />)

    expect(screen.getByText('Test Product')).toBeTruthy()
    expect(screen.getByText('Size: M')).toBeTruthy()
    expect(screen.getByText('Color: Red')).toBeTruthy()
    expect(screen.getByText('$19.99')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
    expect(screen.getByAltText('Test Product')).toBeTruthy()
  })

  it('calls updateItemQuantity when increasing quantity', () => {
    render(<CartItem item={mockCartItems[0]} />)

    const increaseButton = screen.getByRole('button', { name: /plus/i })
    fireEvent.click(increaseButton)

    expect(mockUpdateItemQuantity).toHaveBeenCalledWith('123', 3)
  })

  it('calls updateItemQuantity when decreasing quantity if quantity > 1', () => {
    render(<CartItem item={mockCartItems[0]} />)

    const decreaseButton = screen.getByRole('button', { name: /minus/i })
    fireEvent.click(decreaseButton)

    expect(mockUpdateItemQuantity).toHaveBeenCalledWith('123', 1)
  })

  it('calls removeItem when decreasing quantity if quantity is 1', () => {
    const itemWithQuantityOne = {
      ...mockCartItems[0],
      quantity: 1,
    }

    render(<CartItem item={itemWithQuantityOne} />)

    const decreaseButton = screen.getByRole('button', { name: /minus/i })
    fireEvent.click(decreaseButton)

    expect(mockRemoveItem).toHaveBeenCalledWith('123')
    expect(mockUpdateItemQuantity).not.toHaveBeenCalled()
  })

  it('calls removeItem when remove button is clicked', () => {
    render(<CartItem item={mockCartItems[0]} />)

    const removeButton = screen.getByRole('button', { name: /trash/i })
    fireEvent.click(removeButton)

    expect(mockRemoveItem).toHaveBeenCalledWith('123')
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
