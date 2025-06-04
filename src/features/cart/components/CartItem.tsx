'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '../types/cart.types'
import { useCart } from '../hooks/use-cart'
import { formatCurrency } from '@/utils/format'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart()
  const { product, quantity } = item

  const handleIncreaseQuantity = () => {
    updateItemQuantity(product.id, quantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateItemQuantity(product.id, quantity - 1)
    } else {
      removeItem(product.id)
    }
  }

  const handleRemove = () => {
    removeItem(product.id)
  }

  const itemTotal = product.price * quantity

  return (
    <div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 96px, 96px"
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>

        {item.selectedVariant && (
          <div className="text-sm text-gray-500 space-x-2">
            {item.selectedVariant.size && (
              <span>Size: {item.selectedVariant.size}</span>
            )}
            {item.selectedVariant.color && (
              <span>Color: {item.selectedVariant.color}</span>
            )}
          </div>
        )}

        <div className="text-sm font-medium">
          {formatCurrency(product.price)}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecreaseQuantity}
          className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="w-6 text-center">{quantity}</span>

        <button
          onClick={handleIncreaseQuantity}
          className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Item Total & Remove */}
      <div className="flex flex-col items-end space-y-2">
        <div className="font-medium">{formatCurrency(itemTotal)}</div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
