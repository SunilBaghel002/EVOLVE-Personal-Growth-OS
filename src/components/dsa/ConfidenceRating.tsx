'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfidenceRatingProps {
  value: number
  onChange?: (val: number) => void
  readOnly?: boolean
  className?: string
}

export function ConfidenceRating({
  value,
  onChange,
  readOnly = false,
  className,
}: ConfidenceRatingProps) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars.map((star) => {
        const isFilled = star <= value

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            className={cn(
              'p-0.5 rounded transition-transform',
              !readOnly && 'hover:scale-125 cursor-pointer',
              readOnly && 'cursor-default'
            )}
            title={`Confidence: ${star}/5`}
          >
            <Star
              className={cn(
                'w-3.5 h-3.5 transition-colors',
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-neutral-700 fill-neutral-800/50'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
