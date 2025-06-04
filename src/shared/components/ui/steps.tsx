'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface Step {
  id: number
  name: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isLast = index === steps.length - 1

          return (
            <li key={step.name} className={cn('relative', !isLast && 'flex-1')}>
              <div className="flex items-center">
                {/* Complete or current step */}
                <div
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full',
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-gray-100 border-2 border-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      isCompleted || isCurrent ? 'bg-primary' : 'bg-transparent'
                    )}
                  >
                    {isCompleted && (
                      <Check
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    )}
                    {!isCompleted && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {step.id}
                        </span>
                      </span>
                    )}
                  </span>
                </div>

                {/* Lines connecting steps */}
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2',
                      isCompleted ? 'bg-primary' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>

              {/* Step text */}
              <div className="absolute -bottom-8 left-0 w-full text-center">
                <span
                  className={cn(
                    'text-sm font-medium',
                    isCurrent
                      ? 'text-primary font-semibold'
                      : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500'
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
