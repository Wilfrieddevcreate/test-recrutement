import Button from '../ui/Button'
import Icon from '../ui/Icon'

export default function EmptyState({ onEdit }) {
  return (
    <div className="animate-fade-up rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
        <Icon name="search" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-xl font-bold tracking-tight">Aucun tuteur disponible sur ces créneaux</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">
        Essayez d'ajouter une ou deux demi-journées : la plupart de nos tuteurs sont disponibles le mercredi et le
        week-end.
      </p>
      <Button variant="secondary" onClick={onEdit} className="mt-6">
        <Icon name="pencil" className="h-4 w-4" />
        Modifier mes disponibilités
      </Button>
    </div>
  )
}
