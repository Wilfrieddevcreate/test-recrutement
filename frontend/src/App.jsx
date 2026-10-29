import { useCallback, useEffect, useState } from 'react'
import { api } from './api/client'
import { useMeta } from './hooks/useMeta'
import { EMPTY_CRITERIA } from './lib/criteria'
import Header from './components/layout/Header'
import StepIndicator from './components/layout/StepIndicator'
import SearchForm from './components/search/SearchForm'
import ResultsView from './components/results/ResultsView'
import BookingSheet from './components/booking/BookingSheet'
import Confirmation from './components/booking/Confirmation'

const scrollToTop = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

/**
 * Parcours en trois temps, sur une seule page :
 * recherche → tuteurs compatibles → confirmation de réservation.
 * Chaque étape est poussée dans l'historique du navigateur : « retour » ramène à l'étape précédente.
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

  const fetchResults = useCallback(async (searchCriteria) => {
    setLoading(true)
    setSearchError(null)
    try {
      setResults(await api.match(searchCriteria))
    } catch (err) {
      setSearchError(err)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const navigate = (nextStep) => {
    window.history.pushState({ step: nextStep }, '')
    setStep(nextStep)
    scrollToTop()
  }

  // Étape initiale dans l'historique, puis écoute du bouton « retour » / « suivant ».
  useEffect(() => {
    if (!window.history.state?.step) window.history.replaceState({ step: 'search' }, '')

    const onPopState = (event) => {
      const target = event.state?.step ?? 'search'
      setSelection(null)
      if (target === 'results' && criteria.subject_id) {
        setStep('results')
        fetchResults(criteria) // les disponibilités ont pu changer entre-temps
      } else if (target === 'confirmed' && booking) {
        setStep('confirmed')
      } else {
        setStep('search')
      }
      scrollToTop()
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [criteria, booking, fetchResults])

  const runSearch = (nextCriteria) => {
    setCriteria(nextCriteria)
    navigate('results')
    fetchResults(nextCriteria)
  }

  const editSearch = () => navigate('search')

  const startOver = () => {
    setBooking(null)
    setResults(null)
    setCriteria(EMPTY_CRITERIA)
    navigate('search')
  }

  const handleBooked = (confirmed) => {
    setBooking(confirmed)
    setSelection(null)
    navigate('confirmed')
  }

  // Le créneau a été pris entre-temps : on rafraîchit les disponibilités.
  const handleSlotTaken = () => {
    setSelection(null)
    fetchResults(criteria)
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
            onRetry={() => fetchResults(criteria)}
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
