import Icon from '../ui/Icon'
import { describeCriteria } from '../../lib/criteria'

/** Rappel compact des critères, avec retour au formulaire en un clic. */
export default function SearchSummary({ criteria, meta, onEdit }) {
  const { subject, level, windows } = describeCriteria(criteria, meta)

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-2 pl-4 shadow-card sm:p-3 sm:pl-4">
      <p className="min-w-0 flex-1 text-sm sm:flex sm:items-center" title={`${subject} · ${level} · ${windows.join(', ')}`}>
        <span className="block truncate">
          <span className="font-semibold text-ink">{subject}</span>
          <span className="mx-1.5 text-stone-300">·</span>
          <span className="font-semibold text-ink">{level}</span>
        </span>
        <span className="hidden text-stone-300 sm:mx-1.5 sm:inline">·</span>
        <span className="block truncate text-stone-600">{windows.join(', ')}</span>
      </p>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink transition hover:bg-stone-100"
      >
        <Icon name="pencil" className="h-4 w-4" />
        Modifier
      </button>
    </div>
  )
}
