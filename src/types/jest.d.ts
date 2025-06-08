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
