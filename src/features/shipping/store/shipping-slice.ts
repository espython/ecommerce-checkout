import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// Define the shipping state interface
export interface ShippingState {
  address: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  } | null
  saveAddress: boolean
}

// Initial state
const initialState: ShippingState = {
  address: null,
  saveAddress: false,
}

// Create the shipping slice
export const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    // Save shipping address
    saveShippingAddress: (
      state,
      action: PayloadAction<{
        address: ShippingState['address']
        saveAddress: boolean
      }>
    ) => {
      state.address = action.payload.address
      state.saveAddress = action.payload.saveAddress
    },
    // Clear shipping data
    clearShippingData: (state) => {
      state.address = null
      state.saveAddress = false
    },
  },
})

// Export actions
export const { saveShippingAddress, clearShippingData } = shippingSlice.actions

// Export reducer
export default shippingSlice.reducer
