'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right' | 'up' | 'down'
}

export function PageTransition({
  children,
  className = '',
  direction = 'right',
}: PageTransitionProps) {
  // Set the appropriate X or Y values based on the direction
  const getInitialAnimation = () => {
    switch (direction) {
      case 'left':
        return { x: '-100%', opacity: 0 }
      case 'right':
        return { x: '100%', opacity: 0 }
      case 'up':
        return { y: '-100%', opacity: 0 }
      case 'down':
        return { y: '100%', opacity: 0 }
      default:
        return { x: '100%', opacity: 0 }
    }
  }

  const variants = {
    hidden: getInitialAnimation(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
