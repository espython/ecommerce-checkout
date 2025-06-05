'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from './button'

export interface BackButtonProps {
  /**
   * The function to call when the back button is clicked
   */
  onClick: () => void

  /**
   * Optional aria-label for accessibility
   * @default "Go back"
   */
  label?: string

  /**
   * Optional additional class name
   */
  className?: string
}

/**
 * A rounded back button with an arrow icon
 */
export function BackButton({
  onClick,
  label = 'Go back',
  className = '',
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-gray-100 ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  )
}
