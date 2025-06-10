'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/shared/hooks/redux'
import { useCheckoutGuard } from '@/features/checkout/hooks/use-checkout-guard'
import { CheckoutPageSkeleton } from '@/features/checkout/components/checkout-skeleton'
import {
  setCurrentStep,
  completeCheckout,
  resetCheckout,
} from '@/features/checkout/store/checkout-slice'
import { clearCart } from '@/features/cart/store/cart-slice'
import { clearShippingData } from '@/features/shipping/store/shipping-slice'
import { Button } from '@/shared/components/ui/button'
import { OrderConfirmation } from './OrderConfirmation'

function Confirmation() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isValid } = useCheckoutGuard(4) // Step 4 - confirmation

  // Set current step and mark checkout as complete
  useEffect(() => {
    dispatch(setCurrentStep(4))
    dispatch(completeCheckout())
  }, [dispatch])

  // Show loading or placeholder while redirecting if needed
  if (!isValid) {
    return <CheckoutPageSkeleton />
  }

  const handleContinueShopping = () => {
    dispatch(clearCart())
    dispatch(clearShippingData())
    dispatch(resetCheckout())
    router.push('/checkout')
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <OrderConfirmation />
          <div className="mt-8 flex justify-center">
            <Button onClick={handleContinueShopping} size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
