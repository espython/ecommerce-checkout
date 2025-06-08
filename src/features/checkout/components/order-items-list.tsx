'use client'

import { CartItem } from '@/features/cart/types/cart.types'
import { formatCurrency } from '@/utils/format'
import { Separator } from '@/shared/components/ui/separator'
import { useAppSelector } from '@/shared/hooks/redux'
import {
  selectSubtotal,
  selectShipping,
  selectTax,
  selectCartTotal,
} from '@/features/cart/store/cart-selectors'

interface OrderItemsListProps {
  items: CartItem[]
  showTotal?: boolean
}

export function OrderItemsList({
  items,
  showTotal = true,
}: OrderItemsListProps) {
  // Get calculated values from Redux store
  const subtotal = useAppSelector(selectSubtotal)
  const shipping = useAppSelector(selectShipping)
  const tax = useAppSelector(selectTax)
  const total = useAppSelector(selectCartTotal)

  return (
    <div className="p-6 ">
      <div className="divide-y">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="py-4 flex justify-between gap-2"
          >
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <span className="font-medium">
              {formatCurrency(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {showTotal && (
        <>
          <Separator className="my-4" />
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              {shipping > 0 ? (
                <span>{formatCurrency(shipping)}</span>
              ) : (
                <span className="text-green-600">Free</span>
              )}
            </div>
            <div className="flex justify-between ">
              <span className="text-gray-500">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
