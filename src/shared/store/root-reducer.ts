// src/shared/store/root-reducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { apiSlice } from './api-slice'
import { cartSlice } from '@/features/cart/store/cart-slice'
//Todo: implement shipping, payment, order, checkoutFlow
// import { shippingSlice } from '@/features/shipping/store/shippingSlice'
// import { paymentSlice } from '@/features/payment/store/paymentSlice'
// import { orderSlice } from '@/features/order/store/orderSlice'
// import { checkoutFlowSlice } from '@/features/checkout-flow/store/checkoutFlowSlice'

const persistConfig = {
  key: 'ecommerce-checkout',
  storage,
  whitelist: ['cart'],
  blacklist: ['payment', 'api'],
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  cart: cartSlice.reducer,
  //Todo: implement shipping, payment, order, checkoutFlow
  // shipping: shippingSlice.reducer,
  // payment: paymentSlice.reducer,
  // order: orderSlice.reducer,
  // checkoutFlow: checkoutFlowSlice.reducer,
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)
