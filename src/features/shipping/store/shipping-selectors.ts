import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/shared/store'

// Select the shipping state
export const selectShippingState = (state: RootState) => state.shipping

// Select the shipping address
export const selectShippingAddress = createSelector(
  [selectShippingState],
  (shipping) => shipping.address
)

// Select if the save address flag is set
export const selectSaveAddress = createSelector(
  [selectShippingState],
  (shipping) => shipping.saveAddress
)
