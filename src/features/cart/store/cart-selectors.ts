import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/shared/store/index'
import { CartItem } from '../types/cart.types'

// Base selectors
export const selectCartState = (state: RootState) => state.cart
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.length
export const selectIsCartEmpty = (state: RootState) =>
  state.cart.items.length === 0

// Calculate total quantity of items in cart
export const selectTotalQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
)

// Calculate subtotal (sum of all items prices * quantities)
export const selectSubtotal = createSelector([selectCartItems], (items) => {
  return items.reduce(
    (subtotal, item) => subtotal + item.product.price * item.quantity,
    0
  )
})

// Calculate shipping cost
export const selectShipping = createSelector(
  [selectSubtotal, selectTotalQuantity],
  (subtotal, totalQuantity) => {
    // Free shipping for orders over $100
    if (subtotal >= 100) {
      return 0
    }

    // Base shipping rate + additional fee per item
    const baseShipping = 5.99
    const perItemShipping = 1.5 * Math.max(0, totalQuantity - 1) // First item included in base shipping

    return baseShipping + perItemShipping
  }
)

// Calculate tax (simplified as percentage of subtotal)
export const selectTax = createSelector([selectSubtotal], (subtotal) => {
  // Approximate tax rate of 8.5%
  const taxRate = 0.085
  return subtotal * taxRate
})

// Calculate total
export const selectCartTotal = createSelector(
  [selectSubtotal, selectShipping, selectTax],
  (subtotal, shipping, tax) => {
    return subtotal + shipping + tax
  }
)

// Select a single cart item by product ID
export const selectCartItemById = (productId: string) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.product.id === productId)
  )

// Calculate cart status for UI display
export const selectCartStatus = createSelector([selectCartState], (cart) => ({
  isLoading: cart.isLoading,
  error: cart.error,
}))
