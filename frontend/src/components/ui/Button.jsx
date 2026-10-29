import Spinner from './Spinner'

const VARIANTS = {
  primary:
    'bg-ink text-white shadow-[0_1px_0_rgb(255_255_255/0.08)_inset] hover:bg-black active:scale-[0.98] disabled:bg-stone-300 disabled:text-white disabled:shadow-none',
  secondary:
    'border border-stone-200 bg-white text-ink hover:border-stone-300 hover:bg-stone-50 active:scale-[0.98] disabled:text-stone-400',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-ink active:scale-[0.98]',
}

const SIZES = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-6 text-base',
  sm: 'h-9 px-3.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}
