const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Impossible de joindre le serveur. Vérifiez votre connexion.', 0)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Une erreur est survenue.', response.status, data?.errors ?? null)
  }

  return data
}

export const api = {
  /** Matières, niveaux par cycle, périodes et jours : tout le nécessaire au formulaire. */
  meta: () => request('/meta'),

  /** Tuteurs compatibles, classés par pertinence, avec leurs créneaux correspondants. */
  match: ({ subject_id, level_id, windows }) =>
    request('/match', { method: 'POST', body: { subject_id, level_id, windows } }).then((r) => r.data),

  /** Tous les créneaux encore libres d'un tuteur. */
  availabilities: (tutorId) => request(`/tutors/${tutorId}/availabilities`).then((r) => r.data),

  /** Réservation immédiate d'un créneau. */
  book: (payload) => request('/bookings', { method: 'POST', body: payload }).then((r) => r.data),
}
