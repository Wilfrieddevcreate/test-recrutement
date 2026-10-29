import Chip from '../ui/Chip'

/** Choix du niveau en deux temps : le cycle, puis la classe. */
export default function LevelPicker({ cycles, cycle, onCycleChange, value, onChange }) {
  const current = cycles.find((c) => c.slug === cycle) ?? cycles[0]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-stone-200/70 p-1" role="tablist" aria-label="Cycle scolaire">
        {cycles.map((c) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={c.slug === current.slug}
            onClick={() => onCycleChange(c.slug)}
            className={`h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
              c.slug === current.slug ? 'bg-white text-ink shadow-sm' : 'text-stone-600 hover:text-ink'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div key={current.slug} className="flex animate-fade-in flex-wrap gap-2" role="radiogroup" aria-label="Classe">
        {current.levels.map((level) => (
          <Chip
            key={level.id}
            role="radio"
            aria-checked={value === level.id}
            selected={value === level.id}
            onClick={() => onChange(level.id)}
            className="min-w-18 flex-1 sm:flex-none"
          >
            {level.name}
          </Chip>
        ))}
      </div>
    </div>
  )
}
