import { useState } from 'react'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Icon from '../ui/Icon'
import Skeleton from '../ui/Skeleton'
import Section from './Section'
import SubjectPicker from './SubjectPicker'
import LevelPicker from './LevelPicker'
import AvailabilityGrid from './AvailabilityGrid'
import { cycleOfLevel } from '../../lib/criteria'

export default function SearchForm({ meta, initial, onSubmit }) {
  const [subjectId, setSubjectId] = useState(initial.subject_id)
  const [levelId, setLevelId] = useState(initial.level_id)
  const [cycle, setCycle] = useState(() => cycleOfLevel(meta, initial.level_id) ?? 'college')
  const [windows, setWindows] = useState(initial.windows)
  const [childName, setChildName] = useState(initial.child_first_name ?? '')

  if (!meta) return <SearchFormSkeleton />

  const ready = Boolean(subjectId && levelId && windows.length > 0)
  const name = childName.trim()
  const child = name || 'votre enfant'

  const changeCycle = (next) => {
    setCycle(next)
    // Une classe d'un autre cycle n'a plus de sens : on la désélectionne.
    if (levelId && cycleOfLevel(meta, levelId) !== next) setLevelId(null)
  }

  const submit = (e) => {
    e.preventDefault()
    if (ready) onSubmit({ subject_id: subjectId, level_id: levelId, windows, child_first_name: name })
  }

  return (
    <form onSubmit={submit} className="mt-8 sm:mt-10">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Trouvez le bon tuteur
          <br />
          <span className="text-stone-500">pour votre enfant.</span>
        </h1>
        <p className="mt-3 max-w-xl text-base text-stone-600">
          Indiquez la matière, le niveau et vos disponibilités : nous vous proposons les tuteurs les plus adaptés,
          à réserver immédiatement.
        </p>
      </div>

      {/* Facultatif : sert uniquement à personnaliser le parcours et à pré-remplir la réservation. */}
      <Field
        id="child-name"
        className="mt-8 max-w-sm animate-fade-up stagger-1"
        label={
          <>
            Prénom de votre enfant <span className="font-normal text-stone-400">(facultatif)</span>
          </>
        }
        icon="user"
        placeholder="Ex. Léa"
        autoComplete="off"
        maxLength={40}
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
      />

      <div className="mt-10 space-y-10">
        <Section number={1} title="Quelle matière ?">
          <SubjectPicker subjects={meta.subjects} value={subjectId} onChange={setSubjectId} />
        </Section>

        <Section number={2} title="Quel niveau ?" hint={`Choisissez le cycle, puis la classe de ${child}.`}>
          <LevelPicker cycles={meta.cycles} cycle={cycle} onCycleChange={changeCycle} value={levelId} onChange={setLevelId} />
        </Section>

        <Section
          number={3}
          title={`Quelles disponibilités pour ${child} ?`}
          hint="Cochez une ou plusieurs demi-journées. Plus vous en indiquez, plus vous aurez de choix."
        >
          <AvailabilityGrid weekdays={meta.weekdays} periods={meta.periods} value={windows} onChange={setWindows} />
        </Section>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-10 border-t border-stone-200/60 bg-paper/85 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <Button type="submit" size="lg" disabled={!ready} className="w-full sm:w-auto">
          Voir les tuteurs disponibles
          <Icon name="arrowRight" className="h-5 w-5" />
        </Button>
        {!ready && (
          <p className="mt-2 text-center text-xs text-stone-500 sm:text-left">
            {missingHint(subjectId, levelId, windows)}
          </p>
        )}
      </div>
    </form>
  )
}

function missingHint(subjectId, levelId, windows) {
  const missing = []
  if (!subjectId) missing.push('une matière')
  if (!levelId) missing.push('un niveau')
  if (windows.length === 0) missing.push('au moins une disponibilité')
  return `Il reste à choisir ${missing.join(', ').replace(/, ([^,]*)$/, ' et $1')}.`
}

function SearchFormSkeleton() {
  return (
    <div className="mt-10 space-y-10" aria-busy="true" aria-label="Chargement">
      <div className="space-y-3">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[0, 1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-11" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
