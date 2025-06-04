'use client'

export function CartSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Skeleton for cart items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Item skeletons */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 mb-6 p-4 border border-gray-100 rounded-lg"
            >
              {/* Image skeleton */}
              <div className="w-24 h-24 bg-gray-200 rounded"></div>

              <div className="flex-1">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                {/* Price skeleton */}
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>

                {/* Controls skeleton */}
                <div className="flex items-center">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-5"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
