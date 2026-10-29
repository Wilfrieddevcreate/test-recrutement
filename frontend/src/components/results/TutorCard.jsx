import { useLayoutEffect, useRef, useState } from 'react'
import { api } from '../../api/client'
import { slotMatches } from '../../lib/criteria'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Icon from '../ui/Icon'
import ScoreRing from '../ui/ScoreRing'
import Stars from '../ui/Stars'
import Spinner from '../ui/Spinner'
import SlotPicker from './SlotPicker'

export default function TutorCard({ result, rank, windows, onSelectSlot }) {
  const { tutor, score, reasons, slots } = result
  const [bioOpen, setBioOpen] = useState(false)
  const [bioOverflows, setBioOverflows] = useState(false)
  const bioRef = useRef(null)

  // N'affiche « Lire la suite » que si la présentation dépasse réellement deux lignes.
  useLayoutEffect(() => {
    const el = bioRef.current
    if (el) setBioOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [])
  const [allSlots, setAllSlots] = useState(null)
  const [loadingAll, setLoadingAll] = useState(false)

  const showAll = async () => {
    setLoadingAll(true)
    try {
      setAllSlots(await api.availabilities(tutor.id))
    } finally {
      setLoadingAll(false)
    }
  }

  const isBest = rank === 0

  return (
    <article
      className={`relative animate-fade-up rounded-3xl border bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-6 ${
        isBest ? 'border-brand-200 ring-1 ring-brand-100' : 'border-stone-200'
      }`}
      style={{ animationDelay: `${Math.min(rank, 6) * 70}ms` }}
    >
      {isBest && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-sm sm:left-6">
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          Meilleur match
        </span>
      )}

      <div className="flex items-start gap-4">
        <Avatar src={tutor.photo_url} name={tutor.first_name} size="md" className="sm:h-16 sm:w-16" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold tracking-tight">{tutor.first_name}</h3>
              <p className="truncate text-sm text-stone-600">{tutor.headline}</p>
            </div>
            <ScoreRing value={score} size={56} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
            <Stars rating={tutor.rating} count={tutor.reviews_count} />
            <span className="hidden text-stone-300 sm:inline">·</span>
            <span>{tutor.years_experience} ans d'expérience</span>
            <span className="hidden text-stone-300 sm:inline">·</span>
            <span>{tutor.lessons_count} cours donnés</span>
          </div>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {reasons.map((reason) => (
            <Badge key={reason}>
              <Icon name="check" className="h-3 w-3" strokeWidth={3} />
              {reason}
            </Badge>
          ))}
        </div>
      )}

      <p ref={bioRef} className={`mt-4 text-sm leading-relaxed text-stone-700 ${bioOpen ? '' : 'line-clamp-2'}`}>
        {tutor.bio}
      </p>
      {bioOverflows && (
        <button
          type="button"
          onClick={() => setBioOpen((v) => !v)}
          className="mt-1 text-sm font-semibold text-stone-500 transition hover:text-ink"
        >
          {bioOpen ? 'Réduire' : 'Lire la suite'}
        </button>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tutor.subjects?.map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <div className="mt-5 border-t border-stone-100 pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="flex min-w-0 items-center gap-1.5 text-sm font-bold">
            <Icon name="calendar" className="h-4 w-4 shrink-0 text-stone-400" />
            <span className="truncate">{allSlots ? 'Toutes ses disponibilités' : 'Créneaux compatibles'}</span>
            <span className="hidden whitespace-nowrap font-normal text-stone-400 sm:inline">· cours d'1h</span>
          </h4>
          {!allSlots && (
            <button
              type="button"
              onClick={showAll}
              disabled={loadingAll}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-stone-500 transition hover:text-ink disabled:opacity-60"
            >
              {loadingAll && <Spinner className="h-3.5 w-3.5" />}
              Voir tout
            </button>
          )}
        </div>

        <SlotPicker
          slots={allSlots ?? slots}
          onSelect={(slot) => onSelectSlot(tutor, slot)}
          highlight={allSlots ? (slot) => slotMatches(slot, windows) : null}
        />
      </div>
    </article>
  )
}
