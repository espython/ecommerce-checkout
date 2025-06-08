'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { CheckCircle } from 'lucide-react'
import {
  setCurrentStep,
  resetCheckout,
  completeCheckout,
} from '@/features/checkout/store/checkout-slice'
import { useCheckoutGuard } from '@/features/checkout/hooks/use-checkout-guard'
import { CheckoutPageSkeleton } from '@/features/checkout/components/checkout-skeleton'
import { clearCart } from '@/features/cart/store/cart-slice'
import { OrderItemsList } from '@/features/checkout/components/order-items-list'
import { selectCartItems } from '@/features/cart/store/cart-selectors'

export default function ConfirmationPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Set current step and mark checkout as complete
  useEffect(() => {
    dispatch(setCurrentStep(4))
    dispatch(completeCheckout())
  }, [dispatch])

  // If cart is empty and not a recent order, redirect back to cart
  const { isValid } = useCheckoutGuard(4) // Step 3 - payment

  const cartItems = useAppSelector(selectCartItems)
  // Set current step when landing on this page
  useEffect(() => {
    dispatch(setCurrentStep(4))
  }, [dispatch])

  // Show loading or placeholder while redirecting if needed
  if (!isValid) {
    return <CheckoutPageSkeleton />
  }

  const handleContinueShopping = () => {
    dispatch(clearCart())
    dispatch(resetCheckout())
    router.push('/checkout')
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main confirmation area */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex flex-col items-center mb-8">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been received and is
                being processed.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Order Number:</span>
                <span>{orderNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Order Date:</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Payment Status:</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Order Details</h3>
              <div className="border rounded-md overflow-hidden">
                <div className="border-b px-4 py-3 bg-gray-50 flex justify-between font-medium">
                  <span>Item</span>
                  <span>Total</span>
                </div>
                <OrderItemsList items={cartItems} />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={handleContinueShopping} size="lg">
                Continue Shopping
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
