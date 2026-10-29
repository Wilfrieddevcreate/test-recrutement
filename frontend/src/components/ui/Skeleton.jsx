export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-stone-200/70 ${className}`} aria-hidden="true" />
}
