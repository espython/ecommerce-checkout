'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { useAppSelector, useAppDispatch } from '@/shared/hooks/redux'
import {
  selectCartItems,
  selectIsCartEmpty,
  selectCartTotal,
} from '@/features/cart/store/cart-selectors'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { CartItemCompact } from '@/features/cart/components/CartItemCompact'
import { Steps } from '@/shared/components/ui/steps'
import { clearCart } from '@/features/cart/store/cart-slice'
import { CheckCircle } from 'lucide-react'

export default function ConfirmationPage() {
  const router = useRouter()
  const cartItems = useAppSelector(selectCartItems)
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const dispatch = useAppDispatch()
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // If cart is empty and not a recent order, redirect back to cart
  useEffect(() => {
    if (isEmpty) {
      router.push('/checkout')
    }
  }, [isEmpty, router])

  const steps = [
    { id: 1, name: 'Cart Review' },
    { id: 2, name: 'Shipping Information' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Confirmation' },
  ]

  const handleContinueShopping = () => {
    dispatch(clearCart())
    router.push('/checkout')
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Progress tracker */}
      <div className="mb-12">
        <Steps steps={steps} currentStep={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={handleContinueShopping} size="lg">
                Continue Shopping
              </Button>
            </div>
          </Card>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 mb-6">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="divide-y">
              {cartItems.map((item) => (
                <CartItemCompact key={item.product.id} item={item} />
              ))}
            </div>
          </Card>

          <CartSummary />

          <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-sm text-blue-700">
              A confirmation email has been sent to your email address with all
              the details of your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
