'use client'

import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { selectCurrentStep } from '@/features/checkout/store/checkout-slice'
import { Steps } from '@/shared/components/ui/steps'
import { useEffect } from 'react'
import { resetCheckout } from '@/features/checkout/store/checkout-slice'
import { CHECKOUT_STEPS as steps } from '@/shared/constants/checkout-steps'

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const currentStep = useAppSelector(selectCurrentStep)
  const stepIndex = steps.findIndex((step) => step.id === currentStep?.id) + 1

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('checkout_step')
      }
      dispatch(resetCheckout())
    }
  }, [dispatch])

  return (
    <div className="container max-w-6xl mx-auto px-4 md:px-10 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="mb-12">
        <Steps steps={steps} currentStep={stepIndex} />
      </div>

      {children}
    </div>
  )
}
