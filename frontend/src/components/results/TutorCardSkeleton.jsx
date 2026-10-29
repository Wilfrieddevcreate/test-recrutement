import Skeleton from '../ui/Skeleton'

export default function TutorCardSkeleton({ index = 0 }) {
  return (
    <div
      className="animate-fade-up rounded-3xl border border-stone-200 bg-white p-5 shadow-card sm:p-6"
      style={{ animationDelay: `${index * 70}ms` }}
      aria-hidden="true"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <div className="mt-6 flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
