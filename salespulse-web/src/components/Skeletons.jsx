export function SkeletonBar({ className = "" }) {
  return (
    <div className={`h-4 w-full animate-pulse rounded bg-white/10 ${className}`} />
  );
}

export function SkeletonCard({ lines = 4, className = "" }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="mb-3 h-5 w-40 animate-pulse rounded bg-white/10" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBar key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-3 h-5 w-48 animate-pulse rounded bg-white/10" />
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-3 py-3">
            <SkeletonBar className="col-span-2" />
            <SkeletonBar />
            <SkeletonBar />
            <SkeletonBar />
          </div>
        ))}
      </div>
    </div>
  );
}
