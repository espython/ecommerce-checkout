// src/features/checkout/hooks/useCheckoutGuard.ts
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/shared/hooks/redux'
import {
  selectIsCartEmpty,
  selectCartItems,
} from '@/features/cart/store/cart-selectors'

export function useCheckoutGuard(requiredStep: number) {
  const router = useRouter()
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const cartItems = useAppSelector(selectCartItems)
  const currentStep = useAppSelector((state) => state.checkout.currentStepId)

  useEffect(() => {
    // Case 1: Empty cart - redirect to main checkout
    if (isEmpty) {
      router.replace('/checkout')
      return
    }

    // Case 2: Trying to skip steps (e.g., going to payment before shipping)
    if (currentStep < requiredStep - 1) {
      const previousRequiredStep = `/checkout${requiredStep === 3 ? '/shipping' : ''}`
      router.replace(previousRequiredStep)
      return
    }
  }, [isEmpty, cartItems, currentStep, requiredStep, router])

  // Return whether the page should be rendered
  return { isValid: !isEmpty && currentStep >= requiredStep - 1 }
}
