'use client'

import { Card } from '@/shared/components/ui/card'
import { Cart } from './Cart'
import { CartItem } from '../types/cart.types'
import { CartSkeleton } from './CartSkeleton'
import { Suspense, useEffect } from 'react'
import { setCurrentStep } from '@/features/checkout/store/checkout-slice'
import { useAppDispatch } from '@/shared/hooks/redux'
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

  return (
    <Suspense fallback={<CartSkeleton />}>
      <Card className="p-6 mb-6">
        <Cart items={items} isLoading={isLoading} />
      </Card>
    </Suspense>
  )
}
