// src/shared/store/StoreProvider.tsx
'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppStore, makeStore, persistor } from './index'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
