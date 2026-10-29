import { useState } from 'react'
import { api } from '../../api/client'
import { describeCriteria } from '../../lib/criteria'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Icon from '../ui/Icon'
import Sheet from '../ui/Sheet'

const STORAGE_KEY = 'tutoring-match:parent'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function readRemembered() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function remember(values) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    /* stockage indisponible : on ignore */
  }
}

/** Dernière étape : deux champs, un bouton, et la réservation est confirmée. */
export default function BookingSheet({ meta, criteria, tutor, slot, onClose, onBooked, onSlotTaken }) {
  const remembered = readRemembered()
  // Pré-rempli par le prénom saisi dans le formulaire, sinon par la dernière réservation.
  const [childFirstName, setChildFirstName] = useState(criteria.child_first_name?.trim() || remembered.childFirstName || '')
  const [parentEmail, setParentEmail] = useState(remembered.parentEmail ?? '')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [failure, setFailure] = useState(null)

  const { subject, level } = describeCriteria(criteria, meta)

  const validate = () => {
    const next = {}
    if (!childFirstName.trim()) next.childFirstName = "Indiquez le prénom de l'élève."
    if (!EMAIL_RE.test(parentEmail.trim())) next.parentEmail = 'Saisissez une adresse e-mail valide.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setFailure(null)
    try {
      const booking = await api.book({
        slot_id: slot.id,
        subject_id: criteria.subject_id,
        level_id: criteria.level_id,
        child_first_name: childFirstName.trim(),
        parent_email: parentEmail.trim(),
      })
      remember({ childFirstName: childFirstName.trim(), parentEmail: parentEmail.trim() })
      onBooked(booking)
    } catch (err) {
      if (err.status === 409) {
        setConflict(true)
      } else if (err.status === 422 && err.errors) {
        setErrors({
          childFirstName: err.errors.child_first_name?.[0],
          parentEmail: err.errors.parent_email?.[0],
        })
        setFailure(err.errors.slot_id || err.errors.subject_id || err.errors.level_id ? err.message : null)
      } else {
        setFailure(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet title="Réserver ce créneau" onClose={onClose}>
      <div className="flex items-center gap-4 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200/70">
        <Avatar src={tutor.photo_url} name={tutor.first_name} size="sm" className="h-12 w-12" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {tutor.first_name} <span className="font-normal text-stone-500">· {subject}, {level}</span>
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-stone-700">
            <span className="inline-flex items-center gap-1">
              <Icon name="calendar" className="h-4 w-4 text-stone-400" />
              {slot.date_label}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" className="h-4 w-4 text-stone-400" />
              {slot.time_label}
            </span>
          </p>
        </div>
      </div>

      {conflict ? (
        <div className="mt-5 animate-fade-up rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-start gap-2 text-sm font-semibold text-amber-900">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            Ce créneau vient d'être réservé par une autre famille.
          </p>
          <p className="mt-1 text-sm text-amber-800">Les disponibilités vont être actualisées pour que vous puissiez en choisir un autre.</p>
          <Button onClick={onSlotTaken} className="mt-4 w-full">
            Choisir un autre créneau
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <Field
            id="child-first-name"
            label="Prénom de l'élève"
            icon="user"
            placeholder="Ex. Léo"
            autoComplete="off"
            autoFocus={!childFirstName}
            value={childFirstName}
            onChange={(e) => setChildFirstName(e.target.value)}
            error={errors.childFirstName}
          />
          <Field
            id="parent-email"
            label="Votre e-mail"
            icon="mail"
            type="email"
            inputMode="email"
            placeholder="vous@exemple.fr"
            autoComplete="email"
            autoFocus={Boolean(childFirstName) && !parentEmail}
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            error={errors.parentEmail}
            hint="Pour retrouver votre réservation. Aucune création de compte."
          />

          {failure && (
            <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              <Icon name="alert" className="h-4 w-4 shrink-0" />
              {failure}
            </p>
          )}

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            {submitting ? 'Réservation en cours…' : 'Confirmer la réservation'}
            {!submitting && <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />}
          </Button>
          <p className="text-center text-xs text-stone-500">Confirmation immédiate, sans validation manuelle.</p>
        </form>
      )}
    </Sheet>
  )
}
