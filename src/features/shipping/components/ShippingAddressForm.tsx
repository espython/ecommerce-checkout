'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { FormGenerator, FormFieldSchema } from '@/components/forms'
import { MapPin, User, Mail, Phone, Home } from 'lucide-react'
import { generateValidationSchema } from '@/shared/components/forms/form-schema-helpers'
import { saveShippingAddress } from '../store/shipping-slice'
import { BackButton } from '@/shared/components/ui/back-button'
import { useAppSelector } from '@/shared/hooks/redux'
import {
  selectShippingAddress,
  selectSaveAddress,
} from '../store/shipping-selectors'

// Define the shipping address form schema
const shippingFormSchema: FormFieldSchema[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    icon: <User className="h-4 w-4" />,
    autoComplete: 'name',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'example@email.com',
    required: true,
    icon: <Mail className="h-4 w-4" />,
    autoComplete: 'email',
  },
  {
    name: 'phone',
    type: 'tel',
    label: 'Phone Number',
    placeholder: '(555) 555-5555',
    required: true,
    icon: <Phone className="h-4 w-4" />,
    autoComplete: 'tel',
  },
  {
    name: 'address',
    type: 'text',
    label: 'Address',
    placeholder: 'Street address',
    required: true,
    icon: <Home className="h-4 w-4" />,
    autoComplete: 'address-line1',
  },
  {
    name: 'city',
    type: 'text',
    label: 'City',
    required: true,
    autoComplete: 'address-level2',
  },
  {
    name: 'state',
    type: 'select',
    label: 'State/Province',
    required: true,
    options: [
      { value: 'NY', label: 'New York' },
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      // More states would be added here
    ],
    autoComplete: 'address-level1',
  },
  {
    name: 'postalCode',
    type: 'text',
    label: 'ZIP / Postal Code',
    required: true,
    autoComplete: 'postal-code',
  },
  {
    name: 'country',
    type: 'select',
    label: 'Country',
    required: true,
    options: [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada' },
      { value: 'UK', label: 'United Kingdom' },
      // More countries would be added here
    ],
    autoComplete: 'country',
  },
  {
    name: 'saveAddress',
    type: 'checkbox',
    label: 'Save Information',
    checkboxLabel: 'Save this address for future orders',
  },
]

// Generate Zod validation schema from the form schema
const validationSchema = generateValidationSchema(shippingFormSchema)

// Define the shipping address data type
export type ShippingAddressFormData = z.infer<typeof validationSchema>

export function ShippingAddressForm() {
  const router = useRouter()
  const dispatch = useDispatch()

  // Get shipping address from the Redux store if available
  const shippingAddress = useAppSelector(selectShippingAddress)
  const savedAddressPreference = useAppSelector(selectSaveAddress)

  // Handle form submission
  const handleSubmit = (data: ShippingAddressFormData) => {
    console.log('Shipping address form data:', data)

    // 1. Save the shipping address to the store
    dispatch(
      saveShippingAddress({
        address: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.postalCode,
          country: data.country,
        },
        saveAddress: data.saveAddress || false,
      })
    )

    // 2. Navigate to the next checkout step
    router.push('/checkout/payment')
  }

  // Handle back button click
  const handleBack = () => {
    router.push('/checkout')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <BackButton
          onClick={handleBack}
          label="Back to cart"
          className="mr-2"
        />
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Shipping Address</h2>
        </div>
      </div>

      <FormGenerator
        schema={shippingFormSchema}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        submitText="Continue to Payment"
        defaultValues={{
          fullName: shippingAddress?.fullName || '',
          email: shippingAddress?.email || '',
          phone: shippingAddress?.phone || '',
          address: shippingAddress?.address || '',
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || '',
          postalCode: shippingAddress?.zipCode || '',
          country: shippingAddress?.country || 'US',
          saveAddress: savedAddressPreference || true,
        }}
      />
    </div>
  )
}
