import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base API setup for RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fakestoreapi.com',
  }),
  tagTypes: ['Cart', 'Shipping', 'Payment', 'Order'],
  endpoints: () => ({}),
})
