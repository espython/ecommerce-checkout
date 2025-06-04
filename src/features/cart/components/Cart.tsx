'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { useAppSelector } from '@/shared/hooks/redux'
import { useCartApi } from '../hooks/use-cart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import {
  selectCartItems,
  selectIsCartEmpty,
  selectCartStatus,
} from '../store/cart-selectors'
import { CartItem as CartItemType } from '../types/cart.types'

export function Cart() {
  const router = useRouter()
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

  // Handle continue shopping
  const continueShopping = () => {
    router.push('/products')
  }

  // Handle clearing the cart
  const handleClearCart = () => {
    clearCart()
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Show empty cart state
  if (isEmpty && !isLoading) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button size="lg" onClick={continueShopping}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
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
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
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
      </div>

      {isLoading && (
        <Alert className="mb-4">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Validating your cart</AlertTitle>
          <AlertDescription>
            We&apos;re checking inventory levels and pricing...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="divide-y">
            {cartItems.map((item: CartItemType) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
