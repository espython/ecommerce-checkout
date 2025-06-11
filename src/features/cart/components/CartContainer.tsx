'use client'

import { Cart } from './Cart'
import { CartItem } from '../types/cart.types'
import { CartSkeleton } from './CartSkeleton'
import { Suspense, useEffect } from 'react'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { setCartItems } from '../store/cart-slice'

interface CartContainerProps {
  items: CartItem[]
  isLoading?: boolean
}

export function CartContainer({
  items,
  isLoading = false,
}: CartContainerProps) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setCurrentStep(1))
    dispatch(setCartItems(items))
  }, [dispatch, items])

  const cartItems = useAppSelector((state) => state.cart.items)

  return (
    <Suspense fallback={<CartSkeleton />}>
      <Cart items={cartItems} isLoading={isLoading} />
    </Suspense>
  )
}
