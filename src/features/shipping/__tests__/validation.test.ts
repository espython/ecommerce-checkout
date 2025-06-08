// src/features/shipping/__tests__/validation.test.ts
import { z } from 'zod'
import { validationSchema } from '../components/ShippingAddressForm'

describe('Shipping Form Validation', () => {
  test('validates a complete shipping address', () => {
    const validAddress = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '555-555-5555',
      address: '123 Main St',
      city: 'Anytown',
      state: 'NY', // Must match one of the option values in the form schema
      postalCode: '12345',
      country: 'US', // Must match one of the option values in the form schema
      saveAddress: true,
    }

    const result = validationSchema.safeParse(validAddress)
    expect(result.success).toBe(true)
  })

  test('requires essential fields', () => {
    const incompleteAddress = {
      fullName: '',
      email: 'john@example.com',
      phone: '555-555-5555',
      address: '',
      city: 'Anytown',
      state: '',
      postalCode: '12345',
      country: 'US',
      saveAddress: true,
    }

    const result = validationSchema.safeParse(incompleteAddress)
    expect(result.success).toBe(false)

    if (!result.success) {
      const formattedErrors = result.error.format()
      expect(formattedErrors.fullName).toBeDefined()
      expect(formattedErrors.address).toBeDefined()
      expect(formattedErrors.state).toBeDefined()
    }
  })

  test('validates email format', () => {
    const addressWithInvalidEmail = {
      fullName: 'John Doe',
      email: 'not-an-email',
      phone: '555-555-5555',
      address: '123 Main St',
      city: 'Anytown',
      state: 'NY',
      postalCode: '12345',
      country: 'US',
      saveAddress: true,
    }

    const result = validationSchema.safeParse(addressWithInvalidEmail)
    expect(result.success).toBe(false)

    if (!result.success) {
      const formattedErrors = result.error.format()
      expect(formattedErrors.email).toBeDefined()
    }
  })
})
