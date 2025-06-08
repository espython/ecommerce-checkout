export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: number
  weight: number // for shipping calculation
  dimensions: {
    length: number
    width: number
    height: number
  }
}

export interface ValidatedCartItem {
  id: number
  availableQuantity: number
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  selectedVariant?: {
    size?: string
    color?: string
    style?: string
  }
  addedAt: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  totalItems: number
  isLoading: boolean
  error: string | null
  appliedCoupon?: {
    code: string
    discount: number
    type: 'percentage' | 'fixed'
  }
  lastUpdated: string
}

export interface CartCalculations {
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
}
