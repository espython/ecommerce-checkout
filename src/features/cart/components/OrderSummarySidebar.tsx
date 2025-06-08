import { useAppSelector } from '@/shared/hooks/redux'
import { selectCartItems } from '@/features/cart/store/cart-selectors'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { CartItemCompact } from '@/features/cart/components/CartItemCompact'
import { Card } from '@/shared/components/ui/card'

export function OrderSummarySidebar() {
  const cartItems = useAppSelector(selectCartItems)

  return (
    <div className="lg:col-span-1">
      <Card className="p-6 mb-6">
        <h3 className="font-medium mb-3">Order Summary</h3>
        <div className="divide-y">
          {cartItems.map((item) => (
            <CartItemCompact key={item.product.id} item={item} />
          ))}
        </div>
      </Card>

      <CartSummary />
    </div>
  )
}
