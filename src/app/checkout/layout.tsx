'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectCurrentStep } from '@/features/checkout/store/checkout-slice'
import { Steps } from '@/shared/components/ui/steps'

const steps = [
  { id: 1, name: 'Cart Review', path: '/checkout' },
  { id: 2, name: 'Shipping Information', path: '/checkout/shipping' },
  { id: 3, name: 'Payment', path: '/checkout/payment' },
  { id: 4, name: 'Confirmation', path: '/checkout/confirmation' },
]

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const currentStep = useAppSelector(selectCurrentStep)
  const stepIndex = steps.findIndex((step) => step.id === currentStep?.id) + 1

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
