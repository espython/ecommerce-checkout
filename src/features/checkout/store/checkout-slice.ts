// src/features/checkout/store/checkout-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/shared/store'
import { CHECKOUT_STEPS } from '@/shared/constants/checkout-steps'

export interface CheckoutStep {
  id: number
  name: string
  path: string
  completed: boolean
}

export interface CheckoutState {
  steps: CheckoutStep[]
  currentStepId: number
  isComplete: boolean
}

const initialState: CheckoutState = {
  steps: CHECKOUT_STEPS.map((step) => ({
    ...step,
    completed: false,
  })),
  currentStepId: 1,
  isComplete: false,
}

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      const stepExists = state.steps.some((step) => step.id === action.payload)
      if (stepExists) {
        state.currentStepId = action.payload
      }
    },
    completeStep: (state, action: PayloadAction<number>) => {
      const step = state.steps.find((step) => step.id === action.payload)
      if (step) {
        step.completed = true
      }
    },
    resetStep: (state, action: PayloadAction<number>) => {
      const step = state.steps.find((step) => step.id === action.payload)
      if (step) {
        step.completed = false
      }
    },
    completeCheckout: (state) => {
      state.isComplete = true
      state.steps.forEach((step) => {
        step.completed = true
      })
    },
    resetCheckout: (state) => {
      state.isComplete = false
      state.currentStepId = 1
      state.steps.forEach((step) => {
        step.completed = false
      })
    },
    nextStep: (state) => {
      // Find current step
      const currentStepIndex = state.steps.findIndex(
        (step) => step.id === state.currentStepId
      )
      if (currentStepIndex >= 0 && currentStepIndex < state.steps.length - 1) {
        // Mark current step as completed
        state.steps[currentStepIndex].completed = true
        // Move to next step
        state.currentStepId = state.steps[currentStepIndex + 1].id
      }
    },
    prevStep: (state) => {
      // Find current step
      const currentStepIndex = state.steps.findIndex(
        (step) => step.id === state.currentStepId
      )
      if (currentStepIndex > 0) {
        // Move to previous step
        state.currentStepId = state.steps[currentStepIndex - 1].id
      }
    },
  },
})

export const {
  setCurrentStep,
  completeStep,
  resetStep,
  completeCheckout,
  resetCheckout,
  nextStep,
  prevStep,
} = checkoutSlice.actions

// Selectors
export const selectCheckoutSteps = (state: RootState) => state.checkout.steps
export const selectCurrentStepId = (state: RootState) =>
  state.checkout.currentStepId
export const selectCurrentStep = (state: RootState) => {
  return state.checkout.steps.find(
    (step) => step.id === state.checkout.currentStepId
  )
}
export const selectIsCheckoutComplete = (state: RootState) =>
  state.checkout.isComplete
export const selectNextStep = (state: RootState) => {
  const currentStepIndex = state.checkout.steps.findIndex(
    (step) => step.id === state.checkout.currentStepId
  )
  if (
    currentStepIndex >= 0 &&
    currentStepIndex < state.checkout.steps.length - 1
  ) {
    return state.checkout.steps[currentStepIndex + 1]
  }
  return null
}
export const selectPreviousStep = (state: RootState) => {
  const currentStepIndex = state.checkout.steps.findIndex(
    (step) => step.id === state.checkout.currentStepId
  )
  if (currentStepIndex > 0) {
    return state.checkout.steps[currentStepIndex - 1]
  }
  return null
}

export const setCurrentStepWithPersistence =
  (step: number) => (dispatch: any) => {
    dispatch(setCurrentStep(step))
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_step', step.toString())
    }
  }

export default checkoutSlice.reducer
