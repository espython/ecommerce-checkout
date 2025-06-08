import { apiSlice } from '@/shared/store/api-slice'
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

// FakeStore API product type
interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

// Transform FakeStore products to our Product structure
const transformFakeStoreProducts = (
  products: FakeStoreProduct[]
): CartItem[] => {
  return products.map((item) => ({
    id: item.id.toString(),
    product: {
      id: item.id.toString(),
      name: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      rating: item.rating.rate,
      inventory: item.rating.count, // Using rating count as inventory for demo
      inStock: item.rating.count, // Repurposing the rating count as inStock
      weight: 1.0, // Default weight
      dimensions: {
        length: 10,
        width: 10,
        height: 5,
      },
    },
    quantity: 1,
    addedAt: new Date().toISOString(),
  }))
}

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/products?limit=4',
      transformResponse: (response: FakeStoreProduct[]) =>
        transformFakeStoreProducts(response),
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
