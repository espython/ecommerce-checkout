import { Product } from '../types/cart.types'
import { addToCart } from '../store/cart-slice'
import { makeStore } from '@/shared/store/index'

// Sample product data
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    image: '/images/products/headphones.jpg',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    inStock: 25,
    weight: 0.3,
    dimensions: {
      length: 18,
      width: 15,
      height: 8,
    },
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: '/images/products/tshirt.jpg',
    description: 'Comfortable 100% organic cotton t-shirt',
    category: 'Clothing',
    inStock: 50,
    weight: 0.2,
    dimensions: {
      length: 30,
      width: 20,
      height: 2,
    },
  },
  {
    id: 3,
    name: 'Smart Home Hub',
    price: 129.99,
    image: '/images/products/smarthub.jpg',
    description: 'Control all your smart home devices with this central hub',
    category: 'Electronics',
    inStock: 15,
    weight: 0.5,
    dimensions: {
      length: 12,
      width: 12,
      height: 4,
    },
  },
]

/**
 * Populates the cart with sample products for testing or demonstration
 * @param productCount - Number of different products to add (1-3)
 * @returns void
 */
export const populateCartWithMockData = (productCount: number = 2) => {
  // Ensure we don't try to add more products than available
  const count = Math.min(productCount, mockProducts.length)

  // Add each product to the cart
  for (let i = 0; i < count; i++) {
    const product = mockProducts[i]
    const quantity = Math.floor(Math.random() * 2) + 1 // Random quantity 1-3

    makeStore().dispatch(addToCart({ product, quantity }))
  }
}

/**
 * Clear the cart and populate it with a specific product
 * @param productId - ID of the product to add
 * @param quantity - Quantity to add
 * @returns boolean - Whether the product was found and added
 */
export const addSpecificProductToCart = (
  productId: number,
  quantity: number = 1
): boolean => {
  const product = mockProducts.find((p) => p.id === productId)

  if (product) {
    makeStore().dispatch(addToCart({ product, quantity }))
    return true
  }

  return false
}
