/** Indicateur de pertinence : anneau de progression avec le score 0-100 au centre. */
export default function ScoreRing({ value, size = 60, stroke = 5, className = '' }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100)

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Pertinence ${value} sur 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} className="stroke-stone-200/80" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-brand-500 transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-base font-bold tabular-nums text-ink">{value}</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-stone-400">match</span>
      </div>
    </div>
  )
}
