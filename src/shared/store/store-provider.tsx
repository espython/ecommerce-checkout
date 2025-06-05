// src/shared/store/StoreProvider.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppStore, makeStore, persistor } from './index'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>(makeStore())
  const [isClient, setIsClient] = useState(false)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent hydration mismatch by only rendering PersistGate on client
  if (!isClient) {
    return (
      <Provider store={storeRef.current}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Provider>
    )
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}
