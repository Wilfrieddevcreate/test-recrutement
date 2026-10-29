const TONES = {
  brand: 'bg-brand-50 text-brand-800 ring-brand-100',
  neutral: 'bg-stone-100 text-stone-700 ring-stone-200/60',
  amber: 'bg-amber-50 text-amber-800 ring-amber-100',
}

export default function Badge({ tone = 'brand', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
