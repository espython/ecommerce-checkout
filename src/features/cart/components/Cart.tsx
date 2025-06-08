'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppSelector } from '@/shared/hooks/redux'
import { useCartApi } from '../hooks/use-cart'
import {
  selectCartItems,
  selectCartStatus,
  selectIsCartEmpty,
} from '../store/cart-selectors'
import { CartItem as CartItemType } from '../types/cart.types'
import { populateCartWithMockData } from '../utils/mock-cart-data'
import { CartSkeleton } from './CartSkeleton'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'

interface CartProps {
  hideTitle?: boolean
  hideControls?: boolean
}

export function Cart({ hideTitle = false, hideControls = false }: CartProps) {
  const router = useRouter()
  const cartItems = useAppSelector(selectCartItems)
  const isEmpty = useAppSelector(selectIsCartEmpty)
  const { error } = useAppSelector(selectCartStatus)

  const {
    fetchCart,
    clearCart,
    validateCart: validateCartApi,
    isFetching,
    isClearing,
    isValidating,
  } = useCartApi()

  // Load cart data from API on component mount
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

  // Handle checkout
  const checkout = () => {
    router.push('/checkout')
  }

  // Handle clear cart
  const handleClearCart = () => {
    clearCart()
  }

  if (isFetching) {
    return <CartSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading cart</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fetchCart()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isEmpty) {
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

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {!hideTitle && (
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={validateCart}
              disabled={isFetching}
            >
              {isValidating ? (
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
              disabled={isFetching || isEmpty}
            >
              {isClearing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear Cart'
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="divide-y">
            {cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {!hideControls && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={validateCart}
                disabled={isFetching}
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate Items'
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                disabled={isFetching || isEmpty}
              >
                {isClearing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  'Clear Cart'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary />

          {/* {!hideControls && (
            <div className="mt-4">
              <Button
                variant="default"
                size="lg"
                onClick={checkout}
                disabled={isFetching}
              >
                {isFetching ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
