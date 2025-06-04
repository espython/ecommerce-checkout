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
  setCartItems,
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

// Hook to wrap the RTK Query API hooks
export const useCartApi = () => {
  const dispatch = useAppDispatch()
  const {
    data: cartItemsFromApi,
    refetch: fetchCart,
    isLoading,
    error,
  } = useGetCartQuery()
  const [clearCartMutation] = useClearCartMutation()
  const [validateCartMutation] = useValidateCartMutation()
  const cart = useAppSelector((state) => state.cart)

  // Update Redux store with data from API when it loads
  const fetchAndSetCart = useCallback(async () => {
    try {
      const result = await fetchCart().unwrap()
      if (result) {
        dispatch(setCartItems(result))
        return result
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }, [fetchCart, dispatch])

  const clearCart = useCallback(() => {
    clearCartMutation()
    dispatch(clearCartAction())
  }, [clearCartMutation, dispatch])

  const validateCart = useCallback(() => {
    return validateCartMutation({ items: cart.items })
  }, [validateCartMutation, cart.items])

  return {
    fetchCart: fetchAndSetCart,
    clearCart,
    validateCart,
    isLoading,
    error,
  }
}
