/** Pastille sélectionnable (choix unique ou multiple selon le parent). */
export default function Chip({ selected = false, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
        selected
          ? 'border-ink bg-ink text-white shadow-sm'
          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
