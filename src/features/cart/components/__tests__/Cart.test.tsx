import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { Cart } from '../Cart'
import { useAppSelector } from '@/shared/hooks/redux'
import { useCartApi } from '../../hooks/use-cart'

// Mock the hooks
jest.mock('@/shared/hooks/redux')
jest.mock('../../hooks/use-cart')

const mockUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>
const mockUseCartApi = useCartApi as jest.MockedFunction<typeof useCartApi>

describe('Cart', () => {
  const mockValidateCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAppSelector.mockReturnValue({ error: null })
    mockUseCartApi.mockReturnValue({ validateCart: mockValidateCart })
  })

  it('renders loading skeleton when isLoading is true', () => {
    render(<Cart items={mockItems} isLoading={true} />)

    // CartSkeleton is mocked in jest.setup.js, but we can check that the component renders
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
  })

  it('renders error message when there is an error', () => {
    mockUseAppSelector.mockReturnValue({ error: 'Failed to load cart' })

    render(<Cart items={mockItems} />)

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
    mockUseAppSelector.mockReturnValue({ error: 'Failed to load cart' })

    render(<Cart items={mockItems} hideControls={true} />)

    expect(screen.getByText('Error loading cart')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /try again/i })
    ).not.toBeInTheDocument()
  })

  it('renders cart items when there are items', () => {
    render(<Cart items={mockItems} />)

    // This is a partial test as we're mocking CartItem component in real usage
    expect(
      screen.getByText(/order summary/i, { exact: false })
    ).toBeInTheDocument()
  })
})
