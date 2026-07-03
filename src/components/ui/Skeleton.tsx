export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg animate-shimmer ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl bg-glass-card overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
