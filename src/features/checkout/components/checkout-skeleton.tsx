// src/features/checkout/components/CheckoutPageSkeleton.tsx
export function CheckoutPageSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-60 bg-gray-200 mb-6 rounded-md"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-96 bg-gray-200 rounded-md"></div>
        </div>
        <div className="bg-gray-200 h-80 rounded-md"></div>
      </div>
    </div>
  )
}
