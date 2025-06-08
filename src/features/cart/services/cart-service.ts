'use server'

import { CartItem, Product } from '@/features/cart/types/cart.types'
import { API_BASE_URL } from '@/shared/constants/api'

// This would typically come from a database or external API
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 89.99,
    description: 'Premium wireless headphones with noise cancellation',
    image: 'https://fakestoreapi.com/img/headphones.jpg',
    category: 'Electronics',
    inStock: 15,
    weight: 0.3,
    dimensions: {
      length: 7.5,
      width: 6.2,
      height: 3.0,
    },
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    description: 'Fitness tracker with heart rate monitor',
    image: 'https://fakestoreapi.com/img/smartwatch.jpg',
    category: 'Electronics',
    inStock: 8,
    weight: 0.15,
    dimensions: {
      length: 4.5,
      width: 3.8,
      height: 1.2,
    },
  },
  {
    id: 3,
    name: 'Laptop Backpack',
    price: 49.99,
    description: 'Water-resistant backpack with USB charging port',
    image: 'https://fakestoreapi.com/img/backpack.jpg',
    category: 'Accessories',
    inStock: 20,
    weight: 1.2,
    dimensions: {
      length: 18.0,
      width: 12.0,
      height: 6.0,
    },
  },
]

// Mock cart data for server-side rendering
const mockCartItems: CartItem[] = [
  {
    id: 1,
    product: mockProducts[0],
    quantity: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 2,
    product: mockProducts[1],
    quantity: 1,
    addedAt: new Date().toISOString(),
  },
]

// Server action to fetch cart items
export async function getCartItems(): Promise<CartItem[]> {
  // In a real app, this would fetch from a database or API
  // For now, we'll return mock data

  // Simulate network delay
  const response = await fetch(`${API_BASE_URL}/products?limit=4`)
  if (!response.ok) {
    return mockCartItems
  }
  const data = await response.json()
  const cartItems = transformFakeStoreProducts(data)

  return cartItems
}
function transformFakeStoreProducts(data: any) {
  return data.map((item: any) => ({
    id: item.id,
    product: {
      id: item.id,
      name: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      inStock: item.rating.count,
      weight: 1.0,
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
