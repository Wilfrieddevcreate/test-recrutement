import { useState } from 'react'

const SIZES = {
  md: 'h-14 w-14 text-lg',
  lg: 'h-20 w-20 text-2xl',
  sm: 'h-10 w-10 text-sm',
}

/** Photo du tuteur, avec repli élégant sur son initiale si l'image ne charge pas. */
export default function Avatar({ src, name, size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl bg-brand-100 text-brand-800 ring-1 ring-black/5 ${SIZES[size]} ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={`Photo de ${name}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-bold" aria-label={name}>
          {name?.charAt(0)}
        </span>
      )}
    </div>
  )
}
