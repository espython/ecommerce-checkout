// src/features/cart/hooks/useCart.ts
import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'

import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart as clearCartAction,
  validateCartItems,
  applyCoupon,
  removeCoupon,
} from '../store/cart-slice'
import {
  useGetCartQuery,
  useClearCartMutation,
  useValidateCartMutation,
} from '../store/cart-api'
import type { Product } from '../types/cart.types'

export const useCart = () => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart)

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      dispatch(addToCart({ product, quantity }))
    },
    [dispatch]
  )

  const removeItem = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId))
    },
    [dispatch]
  )

  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }))
    },
    [dispatch]
  )

  const clearAllItems = useCallback(() => {
    dispatch(clearCartAction())
  }, [dispatch])

  const validateItems = useCallback(() => {
    dispatch(validateCartItems(cart.items))
  }, [dispatch, cart.items])

  const applyDiscountCoupon = useCallback(
    (code: string) => {
      dispatch(applyCoupon({ code, cartTotal: cart.subtotal }))
    },
    [dispatch, cart.subtotal]
  )

  const removeDiscountCoupon = useCallback(() => {
    dispatch(removeCoupon())
  }, [dispatch])

  return {
    cart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    validateItems,
    applyDiscountCoupon,
    removeDiscountCoupon,
  }
}

// New hook to wrap the RTK Query API hooks
export const useCartApi = () => {
  const { refetch: fetchCart } = useGetCartQuery()
  const [clearCartMutation] = useClearCartMutation()
  const [validateCartMutation] = useValidateCartMutation()
  const cart = useAppSelector((state) => state.cart)

  const clearCart = useCallback(() => {
    return clearCartMutation()
  }, [clearCartMutation])

  const validateCart = useCallback(() => {
    return validateCartMutation({ items: cart.items })
  }, [validateCartMutation, cart.items])

  return {
    fetchCart,
    clearCart,
    validateCart,
  }
}
