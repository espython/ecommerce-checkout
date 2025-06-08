'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import {
  selectCheckoutSteps,
  selectCurrentStepId,
  setCurrentStep,
  selectIsCheckoutComplete,
} from '@/features/checkout/store/checkout-slice'

interface Step {
  id: number
  name: string
  path?: string
  completed?: boolean
}

interface StepsProps {
  steps?: Step[]
  currentStep?: number
  className?: string
  allowNavigation?: boolean
}

export function Steps({
  // Optional props to override redux state if needed
  steps: propSteps,
  currentStep: propCurrentStep,
  className,
  allowNavigation = true,
}: StepsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Use props if provided, otherwise use Redux state
  const reduxSteps = useAppSelector(selectCheckoutSteps)
  const reduxCurrentStep = useAppSelector(selectCurrentStepId)
  const isCheckoutComplete = useAppSelector(selectIsCheckoutComplete)

  const steps = propSteps || reduxSteps
  const currentStep = propCurrentStep || reduxCurrentStep

  // Handle step click for navigation
  const handleStepClick = (step: Step) => {
    if (!allowNavigation) return

    // Don't allow navigation to future uncompleted steps
    if (!step.completed && step.id > currentStep) return

    // Don't allow navigation away from confirmation once completed
    if (isCheckoutComplete && currentStep === 4) return

    // Update Redux state
    dispatch(setCurrentStep(step.id))

    // Navigate to the step's path if available
    if (step.path) {
      router.push(step.path)
    }
  }

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.completed || currentStep > step.id
          const isCurrent = currentStep === step.id
          const isLast = index === steps.length - 1
          const isClickable =
            allowNavigation && (isCompleted || step.id <= currentStep)

          return (
            <li
              key={step.name}
              className={cn(
                'relative',
                !isLast && 'flex-1',
                isClickable && 'cursor-pointer'
              )}
              onClick={() => isClickable && handleStepClick(step)}
            >
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
                      'h-5 w-5 rounded-full',
                      isCompleted || isCurrent ? 'bg-primary' : 'bg-transparent'
                    )}
                  >
                    {isCompleted && (
                      <Check
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    )}
                    {!isCompleted && !isCurrent && (
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
              <div
                className={`absolute -bottom-12 md:-bottom-8 ${step.id === steps.length ? '-left-9' : 'left-0'} w-full text-start`}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    isCurrent
                      ? 'text-primary font-semibold'
                      : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500',
                    isClickable && 'hover:text-primary transition-colors'
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
