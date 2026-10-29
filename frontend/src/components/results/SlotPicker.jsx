import { useMemo, useState } from 'react'
import Icon from '../ui/Icon'

const INITIAL_DAYS = 4

/** Créneaux groupés par jour, défilement horizontal sur mobile, sélection en un clic. */
export default function SlotPicker({ slots, onSelect, highlight }) {
  const [expanded, setExpanded] = useState(false)

  const days = useMemo(() => {
    const map = new Map()
    for (const slot of slots) {
      if (!map.has(slot.date_label)) map.set(slot.date_label, { label: slot.short_date_label, slots: [] })
      map.get(slot.date_label).slots.push(slot)
    }
    return [...map.values()]
  }, [slots])

  const visible = expanded ? days : days.slice(0, INITIAL_DAYS)
  const hidden = days.length - visible.length

  if (slots.length === 0) {
    return <p className="text-sm text-stone-500">Aucun créneau libre pour le moment.</p>
  }

  return (
    <div>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
        {visible.map((day) => (
          <div key={day.label} className="flex min-w-[6.25rem] shrink-0 snap-start flex-col gap-1.5">
            <span className="mb-0.5 text-xs font-semibold text-stone-500">{day.label}</span>
            {day.slots.map((slot) => {
              const matches = highlight ? highlight(slot) : true
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelect(slot)}
                  title={matches ? undefined : 'En dehors de vos disponibilités'}
                  className={`group flex h-10 items-center justify-center gap-1 rounded-lg border text-sm font-semibold tabular-nums transition-all duration-150 hover:border-ink hover:bg-ink hover:text-white active:scale-95 ${
                    matches ? 'border-brand-200 bg-brand-50/60 text-ink' : 'border-stone-200 bg-white text-stone-500'
                  }`}
                >
                  {slot.time_label.split(' ')[0]}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-stone-600 transition hover:text-ink"
        >
          <Icon name="chevronDown" className="h-4 w-4" />
          {hidden} {hidden > 1 ? 'autres jours' : 'autre jour'}
        </button>
      )}
    </div>
  )
}
