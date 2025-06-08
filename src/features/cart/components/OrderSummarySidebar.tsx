'use client'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { OrderSummaryCard } from '@/features/cart/components/OrderSummaryCard'
import { usePathname } from 'next/navigation'

export function OrderSummarySidebar() {
  const pathname = usePathname()

  return (
    <div className="lg:col-span-1">
      {pathname !== '/checkout' && <OrderSummaryCard />}
      <CartSummary />
    </div>
  )
}
