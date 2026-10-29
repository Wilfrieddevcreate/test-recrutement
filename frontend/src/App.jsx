import { useCallback, useState } from 'react'
import { api } from './api/client'
import { useMeta } from './hooks/useMeta'
import { EMPTY_CRITERIA } from './lib/criteria'
import Header from './components/layout/Header'
import StepIndicator from './components/layout/StepIndicator'
import SearchForm from './components/search/SearchForm'
import ResultsView from './components/results/ResultsView'
import BookingSheet from './components/booking/BookingSheet'
import Confirmation from './components/booking/Confirmation'

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/**
 * Parcours en trois temps, sur une seule page :
 * recherche → tuteurs compatibles → confirmation de réservation.
 */
export default function App() {
  const { meta, error: metaError } = useMeta()

  const [step, setStep] = useState('search') // search | results | confirmed
  const [criteria, setCriteria] = useState(EMPTY_CRITERIA)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [selection, setSelection] = useState(null) // { tutor, slot }
  const [booking, setBooking] = useState(null)

  const runSearch = useCallback(async (nextCriteria) => {
    setCriteria(nextCriteria)
    setStep('results')
    setLoading(true)
    setSearchError(null)
    scrollToTop()
    try {
      setResults(await api.match(nextCriteria))
    } catch (err) {
      setSearchError(err)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const editSearch = () => {
    setStep('search')
    scrollToTop()
  }

  const startOver = () => {
    setBooking(null)
    setResults(null)
    setCriteria(EMPTY_CRITERIA)
    setStep('search')
    scrollToTop()
  }

  const handleBooked = (confirmed) => {
    setBooking(confirmed)
    setSelection(null)
    setStep('confirmed')
    scrollToTop()
  }

  // Le créneau a été pris entre-temps : on relance la recherche pour rafraîchir les disponibilités.
  const handleSlotTaken = () => {
    setSelection(null)
    runSearch(criteria)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onHome={startOver} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        <StepIndicator current={step} />

        {metaError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            Le service est momentanément indisponible. Vérifiez que l'API est démarrée puis rechargez la page.
          </div>
        )}

        {!metaError && step === 'search' && (
          <SearchForm key={criteria === EMPTY_CRITERIA ? 'new' : 'edit'} meta={meta} initial={criteria} onSubmit={runSearch} />
        )}

        {!metaError && step === 'results' && (
          <ResultsView
            meta={meta}
            criteria={criteria}
            results={results}
            loading={loading}
            error={searchError}
            onEdit={editSearch}
            onRetry={() => runSearch(criteria)}
            onSelectSlot={(tutor, slot) => setSelection({ tutor, slot })}
          />
        )}

        {!metaError && step === 'confirmed' && booking && (
          <Confirmation booking={booking} onNewSearch={startOver} />
        )}
      </main>

      {selection && (
        <BookingSheet
          meta={meta}
          criteria={criteria}
          tutor={selection.tutor}
          slot={selection.slot}
          onClose={() => setSelection(null)}
          onBooked={handleBooked}
          onSlotTaken={handleSlotTaken}
        />
      )}
    </div>
  )
}
