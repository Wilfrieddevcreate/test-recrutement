import { useEffect, useState } from 'react'
import { api } from '../api/client'

/** Charge une fois les données de référence du formulaire. */
export function useMeta() {
  const [meta, setMeta] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    api
      .meta()
      .then((data) => active && setMeta(data))
      .catch((err) => active && setError(err))
    return () => {
      active = false
    }
  }, [])

  return { meta, error }
}
