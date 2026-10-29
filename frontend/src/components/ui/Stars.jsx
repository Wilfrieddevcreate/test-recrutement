/** Note sur 5 avec remplissage partiel de la dernière étoile. */
export default function Stars({ rating, count, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label={`Note ${rating} sur 5`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i))
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
              <defs>
                <linearGradient id={`star-${i}-${fill}`} x1="0" x2="1">
                  <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#star-${i}-${fill})`}
                d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z"
              />
            </svg>
          )
        })}
      </div>
      <span className="text-sm font-semibold tabular-nums text-ink">{rating.toFixed(1).replace('.', ',')}</span>
      {count != null && <span className="text-sm text-stone-500">({count} avis)</span>}
    </div>
  )
}
