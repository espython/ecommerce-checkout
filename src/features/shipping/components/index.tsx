'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/shared/hooks/redux'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import { useCheckoutGuard } from '@/features/checkout/hooks/use-checkout-guard'
import { CheckoutPageSkeleton } from '@/features/checkout/components/checkout-skeleton'
import { Shipping } from './Shipping'

export default function ShippingPage() {
  const dispatch = useAppDispatch()
  const { isValid } = useCheckoutGuard(2) // Step 2 - shipping

  // Set current step when landing on this page
  useEffect(() => {
    dispatch(setCurrentStep(2))
  }, [dispatch])

  // Show loading or placeholder while redirecting if needed
  if (!isValid) {
    return <CheckoutPageSkeleton />
  }

  return <Shipping />
}
