// src/features/shipping/store/__tests__/shipping-selectors.test.ts
import {
  selectShippingState,
  selectShippingAddress,
  selectSaveAddress,
} from '../store/shipping-selectors'
import { RootState } from '@/store/index'
import { apiSlice } from '@/shared/store/api-slice'

// Create a more complete mock state with required properties
const mockState = {
  [apiSlice.reducerPath]: {} as any, // Mock API state
  cart: {} as any,
  shipping: {
    address: {
      fullName: 'John',
      email: '<EMAIL>',
      phone: '555-555-5555',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
    },
    saveAddress: true,
  },
  checkout: {} as any,
} as RootState // Cast to RootState

describe('Shipping Selectors', () => {
  test('selectShippingState returns the shipping state', () => {
    const result = selectShippingState(mockState)
    expect(result).toEqual(mockState.shipping)
  })

  test('selectShippingAddress returns the shipping address', () => {
    const result = selectShippingAddress(mockState)
    expect(result).toEqual(mockState.shipping.address)
  })

  test('selectSaveAddress returns the save address flag', () => {
    const result = selectSaveAddress(mockState)
    expect(result).toBe(true)
  })
})
