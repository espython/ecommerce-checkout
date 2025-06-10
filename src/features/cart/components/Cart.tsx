'use client'

import React from 'react'
import { Button } from '@/shared/components/ui/button'
import { ShoppingCart, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { CartItem as CartItemType } from '../types/cart.types'
import { CartItem } from './CartItem'
import { CartSkeleton } from './CartSkeleton'
import { useAppSelector } from '@/shared/hooks/redux'
import { selectCartStatus } from '../store/cart-selectors'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/shared/components/ui/alert'
import { OrderSummarySidebar } from './OrderSummarySidebar'
import { Card } from '@/components/ui'

interface CartProps {
  items: CartItemType[]
  hideTitle?: boolean
  hideControls?: boolean
  isLoading?: boolean
}

export function Cart({
  items,
  hideControls = false,
  isLoading = false,
}: CartProps) {
  const { error } = useAppSelector(selectCartStatus)

  if (isLoading) {
    return <CartSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading cart</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        {!hideControls && (
          <Button asChild>
            <Link href="/checkout">Continue Shopping</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart items */}
      <Card className="lg:col-span-2  shadow p-6">
        <div className="divide-y">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </Card>

      {/* Order summary */}
      <OrderSummarySidebar />
    </div>
  )
}
