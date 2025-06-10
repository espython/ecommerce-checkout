'use client'

import { Card } from '@/shared/components/ui/card'
import { ShippingAddressForm } from './ShippingAddressForm'
import { OrderSummarySidebar } from '@/features/cart/components/OrderSummarySidebar'

export function Shipping() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
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
