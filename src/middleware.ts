import { NextRequest, NextResponse } from 'next/server'

// Paths that should be protected after order completion
const PROTECTED_PATHS = ['/checkout/payment', '/checkout/shipping']

export function middleware(request: NextRequest) {
  // Check if user has completed an order by looking for a session cookie
  const hasCompletedOrder = request.cookies.has('order_completed')

  // Get the path from the request
  const path = request.nextUrl.pathname

  // If user has completed an order and tries to access a protected path
  // redirect them to the confirmation page
  if (
    hasCompletedOrder &&
    PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath))
  ) {
    return NextResponse.redirect(new URL('/checkout/confirmation', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/checkout/:path*'],
}
