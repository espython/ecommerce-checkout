declare namespace jest {
  function mock(moduleName: string, factory?: any): void
  function requireActual(moduleName: string): any
  type MockedFunction<T> = T & {
    mockImplementation: any
    mockReturnValue: any
    mockReset: () => void
    mockClear: () => void
    mockRestore: () => void
  }
}

// Import @testing-library/jest-dom matchers
import '@testing-library/jest-dom'

// Extend expect interface with jest-dom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeVisible(): R
      toBeInvalid(): R
      toBeValid(): R
      toHaveValue(value: any): R
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveAttribute(attr: string, value?: any): R
      toHaveClass(...classNames: string[]): R
      toHaveFocus(): R
      toHaveFormValues(expectedValues: Record<string, any>): R
      toHaveStyle(css: string | Record<string, any>): R
      toHaveTextContent(
        content: string | RegExp,
        options?: { normalizeWhitespace: boolean }
      ): R
    }
  }
}
