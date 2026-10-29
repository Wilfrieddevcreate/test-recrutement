import Icon from '../ui/Icon'

export default function Header({ onHome }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/60 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <button type="button" onClick={onHome} className="flex items-center gap-2.5 rounded-lg" aria-label="Accueil">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <Icon name="graduation" className="h-5 w-5 text-brand-300" />
          </span>
          <span className="text-[17px] font-bold tracking-tight">Tutoring Match</span>
        </button>
        <span className="hidden text-sm text-stone-500 sm:block">Cours particuliers en visio</span>
      </div>
    </header>
  )
}
