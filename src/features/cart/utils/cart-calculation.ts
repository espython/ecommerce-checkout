// src/features/cart/utils/cartCalculations.ts
import type { CartItem } from '../types/cart.types'

export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalWeight = items.reduce(
    (sum, item) => sum + item.product.weight * item.quantity,
    0
  )

  return {
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    totalItems,
    totalWeight,
  }
}

export const calculateDiscount = (
  subtotal: number,
  coupon?: { discount: number; type: 'percentage' | 'fixed' }
) => {
  if (!coupon) return 0

  if (coupon.type === 'percentage') {
    return Math.round(subtotal * (coupon.discount / 100) * 100) / 100
  }

  return Math.min(coupon.discount, subtotal)
}

export const calculateTax = (subtotal: number, taxRate: number = 0.08) => {
  return Math.round(subtotal * taxRate * 100) / 100
}
