// src/features/cart/store/cartSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'

import type {
  CartItem,
  CartState,
  Product,
  ValidatedCartItem,
} from '../types/cart.types'
import { calculateCartTotals } from '../utils/cart-calculation'

// Async thunks for cart operations
export const validateCartItems = createAsyncThunk(
  'cart/validateItems',
  async (items: CartItem[]) => {
    const response = await fetch('/api/cart/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    return response.json()
  }
)

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async ({ code, cartTotal }: { code: string; cartTotal: number }) => {
    const response = await fetch('/api/cart/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal }),
    })
    if (!response.ok) {
      throw new Error('Invalid coupon code')
    }
    return response.json()
  }
)

export const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
  lastUpdated: new Date().toISOString(),
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      const totals = calculateCartTotals(state.items)
      state.subtotal = totals.subtotal
      state.totalItems = totals.totalItems
      state.lastUpdated = new Date().toISOString()
    },

    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          id: product.id,
          product,
          quantity,
          addedAt: new Date().toISOString(),
        })
      }

      const totals = calculateCartTotals(state.items)
      state.subtotal = totals.subtotal
      state.totalItems = totals.totalItems
      state.lastUpdated = new Date().toISOString()
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      )

      const totals = calculateCartTotals(state.items)
      state.subtotal = totals.subtotal
      state.totalItems = totals.totalItems
      state.lastUpdated = new Date().toISOString()
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.product.id === productId)

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== productId
          )
        } else {
          item.quantity = quantity
        }

        const totals = calculateCartTotals(state.items)
        state.subtotal = totals.subtotal
        state.totalItems = totals.totalItems
        state.lastUpdated = new Date().toISOString()
      }
    },

    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.totalItems = 0
      state.appliedCoupon = undefined
      state.lastUpdated = new Date().toISOString()
    },

    removeCoupon: (state) => {
      state.appliedCoupon = undefined
      state.lastUpdated = new Date().toISOString()
    },

    // Set global loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      // Validate cart items
      .addCase(validateCartItems.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(validateCartItems.fulfilled, (state, action) => {
        state.isLoading = false
        // Update items with validated stock levels
        action.payload.validatedItems.forEach(
          (validatedItem: ValidatedCartItem) => {
            const item = state.items.find(
              (item) => item.product.id === validatedItem.id
            )
            if (item && validatedItem.availableQuantity < item.quantity) {
              item.quantity = validatedItem.availableQuantity
            }
          }
        )
      })
      .addCase(validateCartItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to validate cart items'
      })

      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false
        state.appliedCoupon = action.payload.coupon
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to apply coupon'
      })
  },
})

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  removeCoupon,
  setLoading,
  setError,
} = cartSlice.actions

export default cartSlice.reducer
