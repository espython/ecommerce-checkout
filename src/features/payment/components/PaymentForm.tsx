'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/shared/components/ui/button'
import { BackButton } from '@/shared/components/ui/back-button'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { CreditCard } from 'lucide-react'
import {
  nextStep,
  prevStep,
  completeCheckout,
  selectPreviousStep,
} from '@/features/checkout/store/checkout-slice'

export function PaymentForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const previousStepInfo = useAppSelector(selectPreviousStep)
  const [cardComplete, setCardComplete] = useState(false)

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

      // Complete the checkout in Redux
      dispatch(completeCheckout())

      // Move to next step
      dispatch(nextStep())

      // Navigate to confirmation page
      router.push('/checkout/confirmation')
    } catch (error: any) {
      setPaymentError(error.message)
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
              onChange={(event) => {
                setCardComplete(event.complete)
                if (event.error) {
                  setPaymentError(event.error.message)
                } else {
                  setPaymentError(null)
                }
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
          <Button
            type="submit"
            disabled={!stripe || isProcessing || !cardComplete}
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
