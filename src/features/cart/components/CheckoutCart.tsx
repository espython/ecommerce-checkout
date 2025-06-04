'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { useAppSelector } from '@/shared/hooks/redux'
import { useCartApi } from '../hooks/use-cart'
import { CartItem } from './CartItem'
import {
  selectCartItems,
  selectIsCartEmpty,
  selectCartStatus,
} from '../store/cart-selectors'
import { CartItem as CartItemType } from '../types/cart.types'

interface CheckoutCartProps {
  hideTitle?: boolean
  hideControls?: boolean
}

export function CheckoutCart({
  hideTitle = false,
  hideControls = false,
}: CheckoutCartProps) {
  const cartItems = useAppSelector(selectCartItems)
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const { isLoading, error } = useAppSelector(selectCartStatus)

  const { fetchCart, clearCart, validateCart: validateCartApi } = useCartApi()

  // Load cart data on component mount
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Validate cart items against inventory
  const validateCart = () => {
    validateCartApi()
  }

  // Handle clearing the cart
  const handleClearCart = () => {
    clearCart()
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Show empty cart state - this will rarely show since we populate with mock data
  if (isEmpty && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Your cart is empty. We&apos;ll add some items for you.
        </p>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading your cart</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={fetchCart}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {!hideTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Cart Items</h2>

          {!hideControls && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={validateCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Refresh Cart'
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                disabled={isLoading || isEmpty}
              >
                Clear Cart
              </Button>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <Alert className="mb-4">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Validating your cart</AlertTitle>
          <AlertDescription>
            We&apos;re checking inventory levels and pricing...
          </AlertDescription>
        </Alert>
      )}

      <div className="divide-y">
        {cartItems.map((item: CartItemType) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
    </div>
  )
}
