// src/features/cart/hooks/useCart.ts
import { useCallback, useEffect } from 'react'
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
  setLoading,
  setError,
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
    (productId: number) => {
      dispatch(removeFromCart(productId))
    },
    [dispatch]
  )

  const updateItemQuantity = useCallback(
    (productId: number, quantity: number) => {
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
    isLoading: isFetching,
    error: fetchError,
  } = useGetCartQuery()
  const [clearCartMutation, { isLoading: isClearing }] = useClearCartMutation()
  const [validateCartMutation, { isLoading: isValidating }] =
    useValidateCartMutation()
  const cart = useAppSelector((state) => state.cart)

  // Effect to sync loading states with global state
  useEffect(() => {
    // Set global loading state based on any operation in progress
    const isAnyLoading = isFetching || isClearing || isValidating
    dispatch(setLoading(isAnyLoading))

    // Set global error state
    if (fetchError) {
      dispatch(setError((fetchError as any).message || 'Error fetching cart'))
    }
  }, [isFetching, isClearing, isValidating, fetchError, dispatch])

  // Update Redux store with data from API when it loads

  const clearCart = useCallback(async () => {
    try {
      await clearCartMutation().unwrap()
      dispatch(clearCartAction())
      dispatch(setError(null))
    } catch (error) {
      console.error('Failed to clear cart:', error)
      dispatch(setError('Failed to clear cart'))
    }
  }, [clearCartMutation, dispatch])

  const validateCart = useCallback(async () => {
    try {
      const result = await validateCartMutation({ items: cart.items }).unwrap()
      dispatch(setError(null))
      return result
    } catch (error) {
      dispatch(setError('Failed to validate cart'))
      return null
    }
  }, [validateCartMutation, cart.items, dispatch])

  // Combined loading state for any cart operation
  const isLoading = isFetching || isClearing || isValidating

  return {
    clearCart,
    validateCart,
    isLoading,
    isFetching,
    isClearing,
    isValidating,
    error: fetchError,
    cartItemsFromApi,
  }
}
