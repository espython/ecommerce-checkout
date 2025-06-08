'use client'

import { Card } from '@/shared/components/ui/card'
import { useAppDispatch } from '@/shared/hooks/redux'
import { ShippingAddressForm } from '@/features/shipping/components/ShippingAddressForm'
import { OrderSummarySidebar } from '@/features/cart/components/OrderSummarySidebar'
import { useCheckoutGuard } from '@/features/checkout/hooks/use-checkout-guard'
import { useEffect } from 'react'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import { CheckoutPageSkeleton } from '@/features/checkout/components/checkout-skeleton'

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

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout area */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <ShippingAddressForm />
          </Card>
        </div>

        {/* Order summary sidebar */}
        <OrderSummarySidebar />
      </div>
    </div>
  )
}
