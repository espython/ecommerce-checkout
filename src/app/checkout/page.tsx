'use client'
export const dynamic = 'force-dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { selectIsCartEmpty } from '@/features/cart/store/cart-selectors'
import { Cart } from '@/features/cart/components/Cart'
import { Steps } from '@/shared/components/ui/steps'
import {
  setCurrentStep,
  nextStep,
  selectNextStep,
} from '@/features/checkout/store/checkout-slice'

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const nextStepData = useAppSelector(selectNextStep)
  const isLoading = useAppSelector((state) => state.api)

  // Set current step when landing on this page
  useEffect(() => {
    dispatch(setCurrentStep(1))
  }, [dispatch])

  // Redirect to home if cart is empty
  useEffect(() => {
    if (!isLoading && isEmpty) {
      router.push('/')
    }
  }, [isEmpty, router, isLoading])

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Cart Section */}
      <Card className="p-6 mb-6">
        <Cart />
      </Card>
    </div>
  )
}
