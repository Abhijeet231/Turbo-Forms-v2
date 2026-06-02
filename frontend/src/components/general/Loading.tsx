const Loading = () => {
  return (
    <div
      className="min-h-screen p-8 animate-pulse"
      style={{
        backgroundColor: "#0f0f0f",
        backgroundImage:
          "radial-gradient(circle, #c2410c22 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-40 rounded-md bg-stone-800 mb-2" />
          <div className="h-4 w-56 rounded-md bg-stone-900" />
        </div>

        <div className="h-10 w-32 rounded-lg bg-stone-800" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-xl p-4"
            style={{
              backgroundColor: "#1c1917cc",
              border: "0.5px solid #292524",
            }}
          >
            <div className="h-3 w-24 rounded bg-stone-800 mb-3" />
            <div className="h-8 w-16 rounded bg-stone-700 mb-3" />
            <div className="h-3 w-28 rounded bg-stone-900" />
          </div>
        ))}
      </div>

      {/* Recent Forms Skeleton */}
      <div>
        <div className="h-4 w-28 rounded bg-stone-800 mb-4" />

        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-4 rounded-lg"
              style={{
                backgroundColor: "#1c1917bb",
                border: "0.5px solid #292524",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-stone-700" />

                <div>
                  <div className="h-4 w-48 rounded bg-stone-700 mb-2" />
                  <div className="h-3 w-28 rounded bg-stone-900" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-3 w-28 rounded bg-stone-800" />
                <div className="h-3 w-24 rounded bg-stone-800" />
                <div className="h-6 w-20 rounded-full bg-stone-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
