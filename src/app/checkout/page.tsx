'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectIsCartEmpty } from '@/features/cart/store/cart-selectors'
import { populateCartWithMockData } from '@/features/cart/utils/mock-cart-data'
import { Steps } from '@/shared/components/ui/steps'
import { Cart } from '@/features/cart/components/Cart'

export default function CheckoutPage() {
  const router = useRouter()
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const [currentStep, setCurrentStep] = useState(1)

  // If cart is empty, populate with mock data on first render
  useEffect(() => {
    if (isEmpty) {
      populateCartWithMockData(2)
    }
  }, [isEmpty])

  const handleContinue = () => {
    router.push('/checkout/shipping')
  }

  const steps = [
    { id: 1, name: 'Cart Review' },
    { id: 2, name: 'Shipping Information' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Confirmation' },
  ]

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Progress tracker */}
      <div className="mb-8">
        <Steps steps={steps} currentStep={currentStep} />
      </div>

      {/* Cart Section */}
      <Card className="p-6 mb-6">
        <Cart />
      </Card>

      {/* Continue Button */}
      {!isEmpty && (
        <div className="flex justify-end">
          <Button size="lg" onClick={handleContinue}>
            Continue to Shipping
          </Button>
        </div>
      )}
    </div>
  )
}
