import Icon from './Icon'

/** Champ de saisie avec libellé, icône optionnelle et message d'erreur. */
export default function Field({ id, label, icon, error, hint, className = '', ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <Icon name={icon} className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`h-12 w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-stone-400 transition-colors focus:border-ink focus:ring-2 focus:ring-ink/10 focus-visible:ring-ink/10 focus-visible:ring-offset-0 ${
            icon ? 'pl-11' : ''
          } ${error ? 'border-red-300 bg-red-50/40' : 'border-stone-200'}`}
          {...inputProps}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
