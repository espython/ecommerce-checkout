'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { BackButton } from '@/shared/components/ui/back-button'
import { useAppSelector } from '@/shared/hooks/redux'
import {
  selectCartItems,
  selectIsCartEmpty,
  selectCartTotal,
} from '@/features/cart/store/cart-selectors'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { CartItemCompact } from '@/features/cart/components/CartItemCompact'
import { Steps } from '@/shared/components/ui/steps'
import { CreditCard } from 'lucide-react'
import Cookies from 'js-cookie'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

// PaymentForm component that uses Stripe hooks
function PaymentForm() {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // In a real app, you would:
      // 1. Send the card details to your server
      // 2. Create a payment intent on your server with the Stripe API
      // 3. Confirm the payment on the client side

      // For demo purposes, we'll just simulate a successful payment
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        throw error
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set a cookie to indicate order completion
      // Set expiry to 1 hour - adjust as needed
      Cookies.set('order_completed', 'true', {
        expires: 1 / 24,
        sameSite: 'strict',
      })

      // Navigate to confirmation page
      router.push('/checkout/confirmation')
    } catch (error) {
      if (error instanceof Error) {
        setPaymentError(error.message)
      } else {
        setPaymentError('An unknown error occurred')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    router.push('/checkout/shipping')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <BackButton
          onClick={handleBack}
          label="Back to shipping"
          className="mr-2"
        />
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Payment Details</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>

          {paymentError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {paymentError}
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function PaymentPage() {
  const router = useRouter()
  const cartItems = useAppSelector(selectCartItems)
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const cartTotal = useAppSelector(selectCartTotal)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If cart is empty, redirect back to cart
    if (isEmpty) {
      router.push('/checkout')
      return
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isEmpty, router])

  const steps = [
    { id: 1, name: 'Cart Review' },
    { id: 2, name: 'Shipping Information' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Confirmation' },
  ]

  // Return early if loading
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="mb-12">
          <Steps steps={steps} currentStep={3} />
        </div>

        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse">Loading payment form...</div>
        </div>
      </div>
    )
  }

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

      {/* Progress tracker */}
      <div className="mb-12">
        <Steps steps={steps} currentStep={3} />
      </div>

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
        <div className="lg:col-span-1">
          <Card className="p-6 mb-6">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="divide-y">
              {cartItems.map((item) => (
                <CartItemCompact key={item.product.id} item={item} />
              ))}
            </div>
          </Card>

          <CartSummary />
        </div>
      </div>
    </div>
  )
}
