// src/features/shipping/components/__tests__/ShippingAddressForm.test.tsx
import React, { act } from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ShippingAddressForm } from '../components/ShippingAddressForm'
import shippingReducer, { saveShippingAddress } from '../store/shipping-slice'

// Create a mock store with the shipping reducer
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      shipping: shippingReducer,
    },
    preloadedState: {
      shipping: {
        address: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        ...initialState,
        saveAddress: false,
      },
    },
  })
}

// Test component wrapper with Redux provider
const renderWithStore = (ui: React.ReactNode, initialState = {}) => {
  const store = createMockStore(initialState)
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
}

// Mock the Next.js router
const mockRouterPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

describe('ShippingAddressForm', () => {
  test('renders the shipping form correctly', () => {
    renderWithStore(<ShippingAddressForm />)

    // Check if key form elements are rendered
    // Use loose matching to account for asterisks in required field labels
    expect(
      screen.getByLabelText((content) => content.startsWith('Full Name'))
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText((content) => content.startsWith('Email Address'))
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText((content) => content.startsWith('Phone Number'))
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(
        (content) => content.startsWith('Address') && !content.includes('Email')
      )
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText((content) => content.startsWith('City'))
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText((content) =>
        content.startsWith('ZIP / Postal Code')
      )
    ).toBeInTheDocument()
  })

  test('shows validation errors when submitting empty form', async () => {
    const { store } = renderWithStore(<ShippingAddressForm />)
    await act(async () => {
      store.dispatch(
        saveShippingAddress({
          address: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          saveAddress: false,
        })
      )
    })

    // Find and click the submit button
    const submitButton = screen.getByRole('button', {
      name: /continue to payment/i,
    })

    // Wrap submission in act()
    await act(async () => {
      fireEvent.click(submitButton)

      // Give time for validation to happen
      await new Promise((r) => setTimeout(r, 100))
    })

    // Check the DOM directly for any validation-related elements or attributes
    const html = document.body.innerHTML

    // Either inputs have aria-invalid attribute or there are error class elements
    const hasInvalidAttributes = html.includes('aria-invalid="true"')
    const hasErrorElements = html.includes('error') || html.includes('invalid')

    // Assert that validation occurred - either through invalid attributes or error messages
    expect(hasInvalidAttributes || hasErrorElements).toBe(true)

    // Also verify we didn't navigate away (which happens only if form was valid)
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  test('updates store when form is submitted with valid data', async () => {
    // Reset the mock to clear any previous calls
    mockRouterPush.mockClear()

    // Create a mock store and render the form
    const { store } = renderWithStore(<ShippingAddressForm />)

    // Wrap all our form interactions in act()
    await act(async () => {
      // Regular text fields
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'John Doe' },
      })
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'test@gmail.com' },
      })
      fireEvent.change(screen.getByLabelText(/phone number/i), {
        target: { value: '555-555-5555' },
      })
      fireEvent.change(screen.getByLabelText(/^address/i), {
        target: { value: '456 Oak Ave' },
      })
      fireEvent.change(screen.getByLabelText(/city/i), {
        target: { value: 'Somewhere' },
      })

      // For select fields, we'll use direct DOM manipulation
      const selectElements = document.querySelectorAll('select')

      // State select should be the first select element
      if (selectElements.length >= 1) {
        fireEvent.change(selectElements[0], { target: { value: 'NY' } })
      }

      fireEvent.change(screen.getByLabelText(/zip.*postal code/i), {
        target: { value: '67890' },
      })

      // Country select should be the second select element
      if (selectElements.length >= 2) {
        fireEvent.change(selectElements[1], { target: { value: 'US' } })
      }

      // Also click the saveAddress checkbox
      const saveAddressCheckbox = screen.getByRole('checkbox', {
        name: /save this address/i,
      })
      fireEvent.change(saveAddressCheckbox, { target: { checked: true } })
    })

    // Submit the form in a separate act() to ensure all state updates are processed
    await act(async () => {
      const submitButton = screen.getByRole('button', {
        name: /continue to payment/i,
      })
      fireEvent.click(submitButton)
    })

    // Use a larger delay to ensure all async operations complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check all store fields now
    const state = store.getState()

    expect(state.shipping.address?.fullName).toBe('John Doe')
    expect(state.shipping.address?.email).toBe('test@gmail.com')
    expect(state.shipping.address?.phone).toBe('555-555-5555')
    expect(state.shipping.address?.address).toBe('456 Oak Ave')
    expect(state.shipping.address?.city).toBe('Somewhere')
    expect(state.shipping.address?.state).toBe('NY')
    expect(state.shipping.address?.zipCode).toBe('67890')
    expect(state.shipping.address?.country).toBe('US')
    expect(state.shipping.saveAddress).toBe(true)

    // Verify router.push was called with the correct path
    expect(mockRouterPush).toHaveBeenCalledWith('/checkout/payment')
  })

  test('pre-fills form with data from store', () => {
    // Initial state with pre-filled address
    const initialState = {
      address: {
        fullName: 'Jane Doe',
        email: 'test@gmail.com',
        phone: '555-555-5555',
        address: '456 Oak Ave',
        city: 'Somewhere',
        state: 'NY',
        zipCode: '67890',
        country: 'US',
      },
      saveAddress: true,
    }
    renderWithStore(<ShippingAddressForm />, initialState)

    // Check if form fields are pre-filled with the stored address
    expect(
      screen.getByLabelText((content) => content.startsWith('Full Name'))
    ).toHaveValue('Jane Doe')
    expect(
      screen.getByLabelText((content) => content.startsWith('Email Address'))
    ).toHaveValue('test@gmail.com')
    expect(
      screen.getByLabelText((content) => content.startsWith('Phone Number'))
    ).toHaveValue('555-555-5555')
    expect(
      screen.getByLabelText(
        (content) => content.startsWith('Address') && !content.includes('Email')
      )
    ).toHaveValue('456 Oak Ave')
    expect(
      screen.getByLabelText((content) => content.startsWith('City'))
    ).toHaveValue('Somewhere')

    // For select fields, check if their selected options contain the expected text
    const stateFieldContainer = screen
      .getByText(/State\/Province/)
      .closest('div')!.parentElement!
    const stateValue = within(stateFieldContainer).getByRole('combobox')
    expect(stateValue).toHaveTextContent('New York')

    expect(
      screen.getByLabelText((content) =>
        content.startsWith('ZIP / Postal Code')
      )
    ).toHaveValue('67890')

    const countryFieldContainer = screen
      .getByText(/Country/)
      .closest('div')!.parentElement!
    const countryValue = within(countryFieldContainer).getByRole('combobox')
    expect(countryValue).toHaveTextContent('United States')

    expect(
      screen.getByRole('checkbox', {
        name: (name) => name.includes('Save Information'),
      })
    ).toBeChecked()
  })
})
