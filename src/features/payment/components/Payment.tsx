'use client'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Card } from '@/shared/components/ui/card'
import { OrderSummarySidebar } from '@/features/cart/components/OrderSummarySidebar'
import { PaymentForm } from './PaymentForm'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

export function Payment() {
  // Stripe Elements appearance options
  const stripeOptions = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
      },
    ],
    appearance: {
      theme: 'stripe',
    },
  } as StripeElementsOptions

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout area */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>

            <Elements stripe={stripePromise} options={stripeOptions}>
              <PaymentForm />
            </Elements>
          </Card>
        </div>

        {/* Order summary sidebar */}
        <OrderSummarySidebar />
      </div>
    </div>
  )
}
