import { screen } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { CartContainer } from '../CartContainer'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import { setCartItems } from '../../store/cart-slice'
import { CartItem } from '../../types/cart.types'

// Mock the Redux hooks
jest.mock('@/shared/hooks/redux')
jest.mock('@/features/checkout/store/checkout-slice')
jest.mock('../../store/cart-slice')

const mockDispatch = jest.fn()
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>
const mockUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>
const mockSetCurrentStep = setCurrentStep as jest.MockedFunction<
  typeof setCurrentStep
>
const mockSetCartItems = setCartItems as jest.MockedFunction<
  typeof setCartItems
>

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
  })

  it('dispatches setCurrentStep and setCartItems on mount', () => {
    render(<CartContainer items={mockItems} />)

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockSetCurrentStep).toHaveBeenCalledWith(1)
    expect(mockSetCartItems).toHaveBeenCalledWith(mockItems)
  })

  it('passes items from Redux state to Cart component', () => {
    render(<CartContainer items={mockItems} />)

    expect(mockUseAppSelector).toHaveBeenCalled()
  })

  it('renders loading state when isLoading prop is true', () => {
    render(<CartContainer items={mockItems} isLoading={true} />)
  })
})
