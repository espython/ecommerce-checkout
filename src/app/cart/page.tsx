import { Metadata } from 'next'
import { Cart } from '@/features/cart/components'

export const metadata: Metadata = {
  title: 'Your Cart | E-commerce Checkout',
  description: 'View and manage items in your shopping cart',
}

export default function CartPage() {
  return <Cart />
}
