'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/shared/hooks/redux'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import { useCheckoutGuard } from '@/features/checkout/hooks/use-checkout-guard'
import { CheckoutPageSkeleton } from '@/features/checkout/components/checkout-skeleton'
import { Payment } from './Payment'

export default function PaymentPage() {
  const dispatch = useAppDispatch()
  const { isValid } = useCheckoutGuard(3) // Step 3 - payment

  // Set current step when landing on this page
  useEffect(() => {
    dispatch(setCurrentStep(3))
  }, [dispatch])

  // Show loading or placeholder while redirecting if needed
  if (!isValid) {
    return <CheckoutPageSkeleton />
  }

  return <Payment />
}
