export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse"></div>
        <div className="ml-2 h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-md animate-pulse"></div>
        ))}
      </div>

      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-md animate-pulse"></div>
        ))}
      </div>

      <div className="h-96 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  )
}
