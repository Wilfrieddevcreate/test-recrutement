import Icon from '../ui/Icon'

const STEPS = [
  { key: 'search', label: 'Besoins' },
  { key: 'results', label: 'Tuteurs' },
  { key: 'confirmed', label: 'Réservation' },
]

export default function StepIndicator({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)

  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Progression">
      {STEPS.map((step, i) => {
        const done = i < currentIndex || current === 'confirmed'
        const active = i === currentIndex
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${
                done ? 'bg-brand-500 text-white' : active ? 'bg-ink text-white' : 'bg-stone-200 text-stone-500'
              }`}
              aria-current={active ? 'step' : undefined}
            >
              {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={`whitespace-nowrap font-medium ${active || done ? 'text-ink' : 'text-stone-400'}`}>{step.label}</span>
            {i < STEPS.length - 1 && <span className="mx-0.5 h-px w-4 bg-stone-300 sm:mx-1 sm:w-10" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
