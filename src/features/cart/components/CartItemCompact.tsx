'use client'

import Image from 'next/image'
import { CartItem as CartItemType } from '../types/cart.types'

interface CartItemCompactProps {
  item: CartItemType
}

export function CartItemCompact({ item }: CartItemCompactProps) {
  const { product, quantity } = item

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="relative w-16 h-16 rounded bg-gray-100 ">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-[70%]">
        <p className="font-medium truncate">{product.name}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Qty: {quantity}</span>
          <span className="mx-2">•</span>
          <span>${(product.price * quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
