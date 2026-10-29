import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { buildCalendarFile } from '../../lib/calendar'

export default function Confirmation({ booking, onNewSearch }) {
  const { tutor, slot, subject, level, child_first_name: child, reference } = booking

  const downloadCalendar = () => {
    const url = buildCalendarFile(booking)
    const a = document.createElement('a')
    a.href = url
    a.download = `cours-${subject.toLowerCase()}-${reference}.ics`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="mx-auto mt-8 max-w-lg text-center sm:mt-14">
      <div className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_12px_32px_-8px_rgb(36_152_135/0.6)]">
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7" strokeDasharray="40" className="animate-draw" />
        </svg>
      </div>

      <h1 className="mt-6 animate-fade-up text-3xl font-extrabold tracking-tight stagger-1 sm:text-4xl">C'est réservé !</h1>
      <p className="mt-3 animate-fade-up text-stone-600 stagger-2">
        Le cours de {subject} de <span className="font-semibold text-ink">{child}</span> avec{' '}
        <span className="font-semibold text-ink">{tutor.first_name}</span> est confirmé.
      </p>

      <div className="mt-8 animate-fade-up rounded-3xl border border-stone-200 bg-white p-5 text-left shadow-card stagger-3 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar src={tutor.photo_url} name={tutor.first_name} size="md" />
          <div className="min-w-0">
            <p className="text-lg font-bold">{tutor.first_name}</p>
            <p className="truncate text-sm text-stone-600">{tutor.headline}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-stone-100 pt-5 text-sm">
          <Item icon="calendar" label="Date" value={slot.date_label} />
          <Item icon="clock" label="Horaire" value={slot.time_label} />
          <Item icon="graduation" label="Cours" value={`${subject} · ${level}`} />
          <Item icon="check" label="Référence" value={<span className="font-mono tracking-wide">{reference}</span>} />
        </dl>
      </div>

      <div className="mt-6 flex animate-fade-up flex-col gap-3 stagger-4 sm:flex-row sm:justify-center">
        <Button variant="secondary" onClick={downloadCalendar}>
          <Icon name="download" className="h-4 w-4" />
          Ajouter à mon agenda
        </Button>
        <Button onClick={onNewSearch}>
          Réserver un autre cours
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function Item({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">{label}</dt>
        <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
      </div>
    </div>
  )
}
