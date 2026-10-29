/** Bloc numéroté du formulaire : titre, aide, contenu. */
export default function Section({ number, title, hint, children, className = '' }) {
  return (
    <section className={`animate-fade-up stagger-${number} ${className}`}>
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200/80 text-xs font-bold text-stone-700">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-stone-500">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
