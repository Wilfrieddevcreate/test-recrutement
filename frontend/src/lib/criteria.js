export const EMPTY_CRITERIA = { subject_id: null, level_id: null, windows: [], child_first_name: '' }

export const windowKey = (w) => `${w.weekday}-${w.period}`

export function hasWindow(windows, weekday, period) {
  return windows.some((w) => w.weekday === weekday && w.period === period)
}

export function toggleWindow(windows, weekday, period) {
  return hasWindow(windows, weekday, period)
    ? windows.filter((w) => !(w.weekday === weekday && w.period === period))
    : [...windows, { weekday, period }]
}

/** Un créneau du tuteur correspond-il à l'une des demi-journées demandées ? */
export function slotMatches(slot, windows) {
  return hasWindow(windows, slot.weekday, slot.period)
}

export function cycleOfLevel(meta, levelId) {
  return meta?.cycles.find((c) => c.levels.some((l) => l.id === levelId))?.slug ?? null
}

/** Traduit les identifiants des critères en libellés lisibles. */
export function describeCriteria(criteria, meta) {
  if (!meta) return { subject: '', level: '', windows: [] }

  const subject = meta.subjects.find((s) => s.id === criteria.subject_id)?.name ?? ''
  const level = meta.cycles.flatMap((c) => c.levels).find((l) => l.id === criteria.level_id)?.name ?? ''

  const windows = [...criteria.windows]
    .sort((a, b) => a.weekday - b.weekday || periodOrder(a.period) - periodOrder(b.period))
    .map((w) => {
      const day = meta.weekdays.find((d) => d.iso === w.weekday)?.label ?? ''
      const period = meta.periods.find((p) => p.value === w.period)?.label ?? ''
      return `${day.slice(0, 3)}. ${period.toLowerCase()}`
    })

  return { subject, level, windows }
}

function periodOrder(period) {
  return ['morning', 'afternoon', 'evening'].indexOf(period)
}
