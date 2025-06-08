export const dynamic = 'force-dynamic'
import { getCartItems } from '@/features/cart/services/cart-service'
import { CartContainer } from '@/features/cart/components'

export default async function CheckoutPage() {
  // Fetch cart items on the server
  const cartItems = await getCartItems()

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <CartContainer items={cartItems} />
    </div>
  )
}
