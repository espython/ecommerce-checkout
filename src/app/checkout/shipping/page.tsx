'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/shared/components/ui/card'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectIsCartEmpty } from '@/features/cart/store/cart-selectors'
import { Steps } from '@/shared/components/ui/steps'
import { ShippingAddressForm } from '@/features/shipping/components/ShippingAddressForm'
import { OrderSummarySidebar } from '@/features/cart/components/OrderSummarySidebar'

export default function ShippingPage() {
  const router = useRouter()
  const isEmpty = useAppSelector(selectIsCartEmpty)

  // If cart is empty, redirect back to cart
  if (isEmpty) {
    router.push('/checkout')
  }

  const handleBack = () => {
    router.push('/checkout')
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
