import { CartItem } from '@/features/cart/types/cart.types'

// Mock cart items that can be reused across test files
export const mockCartItems: CartItem[] = [
  {
    id: 1,
    product: {
      id: 1,
      name: 'Product 1',
      price: 19.99,
      image: '/product1.jpg',
      description: 'Description 1',
      category: 'Category 1',
      inStock: 1,
      weight: 1,
      dimensions: {
        length: 1,
        width: 1,
        height: 1,
      },
    },
    quantity: 1,
    addedAt: new Date('2025-06-01').toISOString(), // Using a fixed date for consistent testing
  },
  {
    id: 2,
    product: {
      id: 2,
      name: 'Product 2',
      price: 29.99,
      image: '/product2.jpg',
      description: 'Description 2',
      category: 'Category 2',
      inStock: 2,
      weight: 2,
      dimensions: {
        length: 2,
        width: 2,
        height: 2,
      },
    },
    quantity: 2,
    addedAt: new Date('2025-06-02').toISOString(), // Using a fixed date for consistent testing
  },
]
