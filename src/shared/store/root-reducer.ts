// src/shared/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { cartSlice } from '@/features/cart/store/cartSlice'
import { shippingSlice } from '@/features/shipping/store/shippingSlice'
import { paymentSlice } from '@/features/payment/store/paymentSlice'
import { orderSlice } from '@/features/order/store/orderSlice'
import { checkoutFlowSlice } from '@/features/checkout-flow/store/checkoutFlowSlice'

const persistConfig = {
  key: 'ecommerce-checkout',
  storage,
  whitelist: ['cart', 'shipping', 'checkoutFlow'],
  blacklist: ['payment'], // Never persist sensitive payment data
}

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
  shipping: shippingSlice.reducer,
  payment: paymentSlice.reducer,
  order: orderSlice.reducer,
  checkoutFlow: checkoutFlowSlice.reducer,
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)
export { rootReducer }
