'use client'

import { useAppSelector } from '@/shared/hooks/redux'
import { selectCartItems } from '@/features/cart/store/cart-selectors'
import { CartItemCompact } from '@/features/cart/components/CartItemCompact'
import { Card } from '@/shared/components/ui/card'

export function OrderSummaryCard() {
  const cartItems = useAppSelector(selectCartItems)

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-medium mb-3">Order Summary</h3>
      <div className="divide-y">
        {cartItems.map((item) => (
          <CartItemCompact key={item.product.id} item={item} />
        ))}
      </div>
    </Card>
  )
}
