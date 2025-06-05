'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Card } from '@/shared/components/ui/card'
import { useAppSelector } from '@/shared/hooks/redux'
import {
  selectCartItems,
  selectIsCartEmpty,
} from '@/features/cart/store/cart-selectors'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { CartItemCompact } from '@/features/cart/components/CartItemCompact'
import { Steps } from '@/shared/components/ui/steps'

import { ShippingAddressForm } from '@/features/shipping/components/ShippingAddressForm'

// Define the shipping form schema
const shippingFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Please enter your address' }),
  city: z.string().min(2, { message: 'Please enter your city' }),
  state: z.string().min(2, { message: 'Please select your state' }),
  zipCode: z.string().min(5, { message: 'Please enter a valid zip code' }),
  country: z.string().min(2, { message: 'Please select your country' }),
})

export default function ShippingPage() {
  const router = useRouter()
  const cartItems = useAppSelector(selectCartItems)
  const isEmpty = useAppSelector(selectIsCartEmpty)

  // If cart is empty, redirect back to cart
  if (isEmpty) {
    router.push('/checkout')
  }

  const steps = [
    { id: 1, name: 'Cart Review' },
    { id: 2, name: 'Shipping Information' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Confirmation' },
  ]

  const handleBack = () => {
    router.push('/checkout')
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Progress tracker */}
      <div className="mb-12">
        <Steps steps={steps} currentStep={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout area */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <ShippingAddressForm />
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
        </div>
      </div>
    </div>
  )
}
