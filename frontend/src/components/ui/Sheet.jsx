import { useEffect } from 'react'
import Icon from './Icon'

/** Fenêtre modale centrée sur ordinateur, panneau glissant depuis le bas sur mobile. */
export default function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-lg animate-sheet-up rounded-t-3xl bg-white shadow-sheet sm:rounded-3xl">
        <div className="flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-7">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-ink"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="max-h-[80dvh] overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7 sm:pb-7">{children}</div>
      </div>
    </div>
  )
}
