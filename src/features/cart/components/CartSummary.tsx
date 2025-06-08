'use client'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { formatCurrency } from '@/utils/format'
import {
  selectCartTotal,
  selectSubtotal,
  selectTax,
  selectShipping,
} from '../store/cart-selectors'
import {
  nextStep,
  selectNextStep,
} from '@/features/checkout/store/checkout-slice'
import { PaymentMethodIcons } from './PaymentMethodIcons'

interface CartSummaryProps {
  className?: string
  showCheckoutButton?: boolean
}

export function CartSummary({
  className = '',
  showCheckoutButton: propShowCheckoutButton = true,
}: CartSummaryProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const nextStepData = useAppSelector(selectNextStep)
  const pathname = usePathname()
  // Instead of overriding the prop directly, create a local variable
  const isCheckoutPage = pathname === '/checkout'
  const showCheckoutButton = isCheckoutPage && propShowCheckoutButton
  // Get cart totals from the store
  const subtotal = useAppSelector(selectSubtotal)
  const shipping = useAppSelector(selectShipping)
  const tax = useAppSelector(selectTax)
  const total = useAppSelector(selectCartTotal)

  const handleCheckout = () => {
    if (nextStepData) {
      dispatch(nextStep())
      router.push(nextStepData.path)
    }
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5" />
        Order Details
      </h2>

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          {shipping > 0 ? (
            <span className="font-medium">{formatCurrency(shipping)}</span>
          ) : (
            <span className="text-green-600">Free</span>
          )}
        </div>

        {/* Tax */}
        <div className="flex justify-between">
          <span className="text-gray-500">Estimated Tax</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>

        <Separator className="my-2" />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {/* Checkout button */}
        {showCheckoutButton && (
          <Button className="w-full mt-4" size="lg" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        )}

        {/* Payment options */}
        <PaymentMethodIcons />
      </div>
    </div>
  )
}
