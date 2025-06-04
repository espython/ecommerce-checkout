import { apiSlice } from '@/store/api-slice'
import type { CartItem, Product, ValidatedCartItem } from '../types/cart.types'

// Response type for validateCartItems
interface ValidateCartResponse {
  validatedItems: ValidatedCartItem[]
  outOfStockItems: string[]
}

// Request type for adding to cart
interface AddToCartRequest {
  productId: string
  quantity: number
  variant?: {
    size?: string
    color?: string
    style?: string
  }
}

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<CartItem, AddToCartRequest>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),

    updateCartItem: builder.mutation<
      CartItem,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    removeFromCart: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    validateCart: builder.mutation<ValidateCartResponse, { items: CartItem[] }>(
      {
        query: (body) => ({
          url: '/cart/validate',
          method: 'POST',
          body,
        }),
      }
    ),

    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

// Export auto-generated hooks
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useValidateCartMutation,
  useClearCartMutation,
} = cartApiSlice
