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
import { BackButton } from '@/shared/components/ui/back-button'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { CreditCard } from 'lucide-react'
import {
  setCurrentStep,
  nextStep,
  prevStep,
  completeCheckout,
  selectPreviousStep,
} from '@/features/checkout/store/checkout-slice'
import { useCheckoutGuard } from '@/features/checkout/hooks/use-checkout-guard'
import { CheckoutPageSkeleton } from '@/features/checkout/components/checkout-skeleton'
import { OrderSummarySidebar } from '@/features/cart/components/OrderSummarySidebar'
import { Card } from '@/shared/components/ui'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

// PaymentForm component that uses Stripe hooks
function PaymentForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const previousStepInfo = useAppSelector(selectPreviousStep)

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

      // Set a cookie to indicate order completion - expires in 1 hour
      // const expiryDate = new Date()
      // expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000) // 1 hour
      // document.cookie = `order_completed=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`

      // Complete the checkout in Redux
      dispatch(completeCheckout())

      // Move to next step
      dispatch(nextStep())

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
    if (previousStepInfo) {
      dispatch(prevStep())
      router.push(previousStepInfo.path)
    }
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
  const dispatch = useAppDispatch()

  // Set current step when landing on this page
  useEffect(() => {
    dispatch(setCurrentStep(3))
  }, [dispatch])

  const { isValid } = useCheckoutGuard(3) // Step 3 - payment

  // Set current step when landing on this page
  useEffect(() => {
    dispatch(setCurrentStep(3))
  }, [dispatch])

  // Show loading or placeholder while redirecting if needed
  if (!isValid) {
    return <CheckoutPageSkeleton />
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
