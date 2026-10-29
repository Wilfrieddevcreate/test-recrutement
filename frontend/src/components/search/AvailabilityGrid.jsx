import Icon from '../ui/Icon'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { hasWindow, toggleWindow } from '../../lib/criteria'

const PRESETS = [
  { label: 'Soirs de semaine', windows: [1, 2, 3, 4, 5].map((d) => ({ weekday: d, period: 'evening' })) },
  { label: 'Mercredi après-midi', windows: [{ weekday: 3, period: 'afternoon' }] },
  { label: 'Week-end', windows: [6, 7].flatMap((d) => ['morning', 'afternoon'].map((p) => ({ weekday: d, period: p }))) },
]

/**
 * Grille de disponibilités : chaque case (jour × demi-journée) se coche d'un geste.
 * Sur ordinateur : 7 jours en colonnes. Sur mobile : la grille est transposée
 * (3 demi-journées en colonnes, 7 jours en lignes) pour des cases larges, faciles au pouce.
 */
export default function AvailabilityGrid({ weekdays, periods, value, onChange }) {
  const transposed = useMediaQuery('(max-width: 639px)')
  const toggle = (weekday, period) => onChange(toggleWindow(value, weekday, period))

  const applyPreset = (windows) => {
    const allSelected = windows.every((w) => hasWindow(value, w.weekday, w.period))
    onChange(
      allSelected
        ? value.filter((v) => !windows.some((w) => w.weekday === v.weekday && w.period === v.period))
        : [...value, ...windows.filter((w) => !hasWindow(value, w.weekday, w.period))],
    )
  }

  const cell = (day, period) => (
    <Cell
      key={`${day.iso}-${period.value}`}
      selected={hasWindow(value, day.iso, period.value)}
      label={`${day.label} ${period.label.toLowerCase()}`}
      onClick={() => toggle(day.iso, period.value)}
    />
  )

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-card sm:p-4">
        {transposed ? (
          <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5" role="group" aria-label="Disponibilités">
            <span aria-hidden="true" />
            {periods.map((period) => (
              <div key={period.value} className="pb-1 text-center leading-tight">
                <span className="block text-xs font-semibold text-ink">{period.label}</span>
                <span className="block text-[10px] text-stone-400">{period.hours}</span>
              </div>
            ))}
            {weekdays.map((day) => (
              <Row key={day.iso} label={`${day.label.slice(0, 3)}.`}>
                {periods.map((period) => cell(day, period))}
              </Row>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-2" role="group" aria-label="Disponibilités">
            <span aria-hidden="true" />
            {weekdays.map((day) => (
              <span key={day.iso} className="pb-1 text-center text-xs font-semibold text-stone-500">
                {day.label.slice(0, 3)}.
              </span>
            ))}
            {periods.map((period) => (
              <Row key={period.value} label={period.label} sub={period.hours}>
                {weekdays.map((day) => cell(day, period))}
              </Row>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-stone-500">Raccourcis :</span>
        {PRESETS.map((preset) => {
          const active = preset.windows.every((w) => hasWindow(value, w.weekday, w.period))
          return (
            <button
              key={preset.label}
              type="button"
              aria-pressed={active}
              onClick={() => applyPreset(preset.windows)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active ? 'border-ink bg-ink text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Row({ label, sub, children }) {
  return (
    <>
      <div className="flex flex-col justify-center pr-2 leading-tight sm:pr-3">
        <span className="text-xs font-semibold text-ink sm:text-sm">{label}</span>
        {sub && <span className="text-[11px] text-stone-400">{sub}</span>}
      </div>
      {children}
    </>
  )
}

function Cell({ selected, label, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className={`flex h-11 items-center justify-center rounded-lg border transition-all duration-150 active:scale-95 sm:h-12 ${
        selected ? 'border-ink bg-ink text-white shadow-sm' : 'border-stone-200 bg-stone-50 hover:border-stone-400 hover:bg-white'
      }`}
    >
      {selected && <Icon name="check" className="h-4 w-4" strokeWidth={3} />}
    </button>
  )
}
