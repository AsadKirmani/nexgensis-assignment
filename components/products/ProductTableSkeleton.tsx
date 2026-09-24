export default function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div className="hidden md:block">
        <div className="animate-pulse p-4">
          <div className="mb-4 h-10 rounded bg-gray-200" />

          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="mb-3 grid grid-cols-6 gap-4"
            >
              <div className="h-12 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-gray-200 p-4"
          >
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-lg bg-gray-200" />

              <div className="flex-1 space-y-3">
                <div className="h-4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="h-8 rounded bg-gray-200" />
              <div className="h-8 rounded bg-gray-200" />
              <div className="h-8 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}