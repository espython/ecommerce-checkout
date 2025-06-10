'use client'

import { Card } from '@/shared/components/ui/card'
import { useAppSelector } from '@/shared/hooks/redux'
import { CheckCircle } from 'lucide-react'
import { OrderItemsList } from '@/features/checkout/components/order-items-list'
import { selectCartItems } from '@/features/cart/store/cart-selectors'
import { ConfirmationItems } from './confirmation-items'

export function OrderConfirmation() {
  const cartItems = useAppSelector(selectCartItems)
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      <ConfirmationItems orderNumber={orderNumber} orderDate={orderDate} />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Order Details</h3>
        <div className="border rounded-md overflow-hidden">
          <div className="border-b px-4 py-3 bg-gray-50 flex justify-between font-medium">
            <span>Item</span>
            <span>Total</span>
          </div>
          <OrderItemsList items={cartItems} />
        </div>
      </div>
    </Card>
  )
}
