'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { FormField } from '@/shared/components/forms/FormField'
import { useAppSelector } from '@/shared/hooks/redux'
import {
  selectCartItems,
  selectIsCartEmpty,
} from '@/features/cart/store/cart-selectors'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { CartItemCompact } from '@/features/cart/components/CartItemCompact'
import { Steps } from '@/shared/components/ui/steps'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

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

type ShippingFormValues = z.infer<typeof shippingFormSchema>

export default function ShippingPage() {
  const router = useRouter()
  const cartItems = useAppSelector(selectCartItems)
  const isEmpty = useAppSelector(selectIsCartEmpty)

  // Setup form with zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  })

  // If cart is empty, redirect back to cart
  if (isEmpty) {
    router.push('/checkout')
    return null
  }

  const steps = [
    { id: 1, name: 'Cart Review' },
    { id: 2, name: 'Shipping Information' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Confirmation' },
  ]

  const onSubmit = (data: ShippingFormValues) => {
    console.log('Shipping form data:', data)
    // In a real app, you would save this data to your state
    // and then navigate to the payment page
    router.push('/checkout/payment')
  }

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="fullName"
                  label="Full Name"
                  required
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="John Doe"
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="email"
                    label="Email Address"
                    required
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <FormField
                    control={control}
                    name="phone"
                    label="Phone Number"
                    required
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="(123) 456-7890"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="address"
                  label="Street Address"
                  required
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="123 Main St"
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="city"
                    label="City"
                    required
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="New York"
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <FormField
                    control={control}
                    name="state"
                    label="State / Province"
                    required
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="NY"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="zipCode"
                    label="Zip / Postal Code"
                    required
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="10001"
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <FormField
                    control={control}
                    name="country"
                    label="Country"
                    required
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back to Cart
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </div>
            </form>
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
