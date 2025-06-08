// src/shared/store/root-reducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { apiSlice } from './api-slice'
import { cartSlice } from '@/features/cart/store/cart-slice'
import { shippingSlice } from '@/features/shipping/store/shipping-slice'
import { checkoutSlice } from '@/features/checkout/store/checkout-slice'
//Todo: implement payment, order
// import { paymentSlice } from '@/features/payment/store/paymentSlice'
// import { orderSlice } from '@/features/order/store/orderSlice'

const persistConfig = {
  key: 'ecommerce-checkout',
  storage,
  whitelist: ['cart', 'shipping', 'checkout'],
  blacklist: ['payment', 'api'],
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  cart: cartSlice.reducer,
  shipping: shippingSlice.reducer,
  checkout: checkoutSlice.reducer,
  //Todo: implement payment, order
  // payment: paymentSlice.reducer,
  // order: orderSlice.reducer,
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)
