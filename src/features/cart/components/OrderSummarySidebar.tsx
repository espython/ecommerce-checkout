'use client'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { OrderSummaryCard } from '@/features/cart/components/OrderSummaryCard'

export function OrderSummarySidebar() {
  return (
    <div className="lg:col-span-1">
      <OrderSummaryCard />
      <CartSummary />
    </div>
  )
}
