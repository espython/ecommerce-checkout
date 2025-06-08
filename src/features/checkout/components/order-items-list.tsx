'use client'

import { CartItem } from '@/features/cart/types/cart.types'

interface OrderItemsListProps {
  items: CartItem[]
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="divide-y">
      {items.map((item) => (
        <div key={item.product.id} className="p-4 flex justify-between">
          <div>
            <p className="font-medium">{item.product.name}</p>
            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          </div>
          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}
