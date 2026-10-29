import Button from '../ui/Button'
import Icon from '../ui/Icon'
import SearchSummary from './SearchSummary'
import TutorCard from './TutorCard'
import TutorCardSkeleton from './TutorCardSkeleton'
import EmptyState from './EmptyState'

export default function ResultsView({ meta, criteria, results, loading, error, onEdit, onRetry, onSelectSlot }) {
  const childName = criteria.child_first_name?.trim()

  return (
    <div className="mt-6 sm:mt-8">
      <SearchSummary criteria={criteria} meta={meta} onEdit={onEdit} />

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {loading ? 'Recherche des tuteurs…' : results ? headline(results.length, childName) : 'Tuteurs'}
          </h1>
          {!loading && results?.length > 0 && (
            <p className="mt-1 text-sm text-stone-600">
              Classés par pertinence selon vos critères, leurs évaluations et leur expérience.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {loading && [0, 1, 2].map((i) => <TutorCardSkeleton key={i} index={i} />)}

        {!loading && error && (
          <div className="animate-fade-up rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-red-800">
              <Icon name="alert" className="h-4 w-4" />
              {error.message}
            </p>
            <Button variant="secondary" size="sm" onClick={onRetry} className="mt-3">
              <Icon name="refresh" className="h-4 w-4" />
              Réessayer
            </Button>
          </div>
        )}

        {!loading && !error && results?.length === 0 && <EmptyState onEdit={onEdit} />}

        {!loading &&
          !error &&
          results?.map((result, i) => (
            <TutorCard key={result.tutor.id} result={result} rank={i} windows={criteria.windows} onSelectSlot={onSelectSlot} />
          ))}
      </div>
    </div>
  )
}

function headline(count, childName) {
  if (count === 0) return 'Aucun tuteur trouvé'
  const who = childName ? `pour ${childName}` : 'disponible'
  if (count === 1) return `1 tuteur ${who}`
  return `${count} tuteurs ${childName ? who : 'disponibles'}`
}
