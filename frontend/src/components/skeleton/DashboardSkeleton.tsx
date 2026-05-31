// DashboardSkeleton.tsx
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-black px-6 py-10 space-y-6 max-w-3xl mx-auto">

    {/* header skeleton */}
    <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-800" />

    {/* card skeletons */}
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-3 rounded-xl border border-neutral-800 p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-800" />
        <div className="h-4 w-full animate-pulse rounded bg-neutral-800" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800" />
      </div>
    ))}

  </div>
)

export default DashboardSkeleton;