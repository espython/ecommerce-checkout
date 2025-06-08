'use client'

import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { selectCurrentStep } from '@/features/checkout/store/checkout-slice'
import { Steps } from '@/shared/components/ui/steps'
import { useEffect } from 'react'
import { resetCheckout } from '@/features/checkout/store/checkout-slice'

const steps = [
  { id: 1, name: 'Cart Review', path: '/checkout' },
  { id: 2, name: 'Shipping Information', path: '/checkout/shipping' },
  { id: 3, name: 'Payment', path: '/checkout/payment' },
  { id: 4, name: 'Confirmation', path: '/checkout/confirmation' },
]

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const currentStep = useAppSelector(selectCurrentStep)
  const stepIndex = steps.findIndex((step) => step.id === currentStep?.id) + 1

  // In your checkout layout or main component
  useEffect(() => {
    // Only run this cleanup effect when unmounting the entire checkout flow
    return () => {
      // Clean up checkout state when navigating away from checkout flow
      if (typeof window !== 'undefined') {
        // Only access localStorage on the client
        localStorage.removeItem('checkout_step')
      }
      dispatch(resetCheckout())
    }
  }, [dispatch])

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Progress tracker */}
      <div className="mb-12">
        <Steps
          steps={steps.map((s) => ({ id: s.id, name: s.name }))}
          currentStep={stepIndex}
        />
      </div>

      {children}
    </div>
  )
}
