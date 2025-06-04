'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { FormGenerator, FormFieldSchema } from '@/components/forms'
import { MapPin, User, Mail, Phone, Home } from 'lucide-react'
import { generateValidationSchema } from '@/shared/components/forms/form-schema-helpers'

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
      { value: '', label: 'Select State' },
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

  // Handle form submission
  const handleSubmit = (data: ShippingAddressFormData) => {
    console.log('Shipping address form data:', data)

    // Here you would typically:
    // 1. Save the shipping address to the store
    // 2. Navigate to the next checkout step
    router.push('/checkout/payment')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Shipping Address</h2>
      </div>

      <FormGenerator
        schema={shippingFormSchema}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        submitText="Continue to Payment"
        defaultValues={{
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US',
          saveAddress: true,
        }}
      />
    </div>
  )
}
