'use client'

import { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { PageTransition } from '@/shared/components/ui/page-transition'

// Define the direction for different checkout steps
const getDirectionForPath = (path: string): 'left' | 'right' => {
  if (path.includes('/checkout/shipping')) return 'right'
  if (path.includes('/checkout/payment')) return 'right'
  if (path.includes('/checkout/confirmation')) return 'right'
  return 'right' // Default
}

export default function CheckoutTemplate({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  // Get the appropriate animation direction based on the current route
  const direction = getDirectionForPath(pathname)

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={pathname} direction={direction} className="w-full">
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}
