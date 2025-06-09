import { screen } from '@testing-library/react'
import { render } from '@/test-utils/test-utils'
import { OrderSummarySidebar } from '../components'
import { usePathname } from 'next/navigation'

// Mock the Next.js hook
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: jest.fn(),
}))

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

// Mock child components
jest.mock('../components/CartSummary', () => ({
  CartSummary: () => <div data-testid="cart-summary">Cart Summary</div>,
}))

jest.mock('../components/OrderSummaryCard', () => ({
  OrderSummaryCard: () => (
    <div data-testid="order-summary-card">Order Summary Card</div>
  ),
}))

describe('OrderSummarySidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders both CartSummary and OrderSummaryCard when not on checkout page', () => {
    mockUsePathname.mockReturnValue('/cart')

    render(<OrderSummarySidebar />)

    expect(screen.getByTestId('cart-summary')).toBeTruthy()
    expect(screen.getByTestId('order-summary-card')).toBeTruthy()
  })
})
