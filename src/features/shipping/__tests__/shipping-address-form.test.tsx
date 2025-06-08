// src/features/shipping/components/__tests__/ShippingAddressForm.test.tsx
import React from 'react'
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
import shippingReducer from '../store/shipping-slice'

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
        saveAddress: false,
        ...initialState,
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
    renderWithStore(<ShippingAddressForm />)

    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(submitButton)

    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Please enter a valid email address/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/address is required/i)).toBeInTheDocument()
    })
  })

  test('updates store when form is submitted with valid data', async () => {
    const { store } = renderWithStore(<ShippingAddressForm />)

    // Fill out the form
    fireEvent.change(
      screen.getByLabelText((content) => content.startsWith('Full Name')),
      {
        target: { value: 'John Doe' },
      }
    )
    fireEvent.change(
      screen.getByLabelText((content) => content.startsWith('Email Address')),
      {
        target: { value: 'test@gmail.com' },
      }
    )
    fireEvent.change(
      screen.getByLabelText((content) => content.startsWith('Phone Number')),
      {
        target: { value: '555-555-5555' },
      }
    )
    fireEvent.change(
      screen.getByLabelText(
        (content) => content.startsWith('Address') && !content.includes('Email')
      ),
      {
        target: { value: '456 Oak Ave' },
      }
    )
    fireEvent.change(
      screen.getByLabelText((content) => content.startsWith('City')),
      {
        target: { value: 'Somewhere' },
      }
    )

    // For State/Province, directly set the value on the hidden native select element
    const stateInput = document.querySelector(
      'select[aria-hidden="true"]'
    ) as HTMLSelectElement
    if (stateInput) {
      fireEvent.change(stateInput, { target: { value: 'NY' } })
    }

    fireEvent.change(
      screen.getByLabelText((content) =>
        content.startsWith('ZIP / Postal Code')
      ),
      {
        target: { value: '67890' },
      }
    )

    // For Country, directly set the value on the hidden native select element
    const selectElements = document.querySelectorAll(
      'select[aria-hidden="true"]'
    )
    const countryInput = selectElements[1] as HTMLSelectElement
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: 'US' } })
    }

    // Toggle the save address checkbox
    const saveAddressCheckbox = screen.getByRole('checkbox', {
      name: (name) => name.includes('Save Information'),
    })
    fireEvent.click(saveAddressCheckbox)

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    // Check if the store was updated correctly
    await waitFor(() => {
      const state = store.getState()
      expect(state.shipping.address?.fullName).toBe('John Doe')
      expect(state.shipping.address?.email).toBe('test@gmail.com')
      expect(state.shipping.address?.phone).toBe('555-555-5555')
      expect(state.shipping.address?.address).toBe('456 Oak Ave')
      expect(state.shipping.address?.city).toBe('Somewhere')
      expect(state.shipping.address?.state).toBe('NY')
      expect(state.shipping.address?.zipCode).toBe('67890')
      expect(state.shipping.address?.country).toBe('US')
      expect(state.shipping.saveAddress).toBe(false)
    })
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
