import { cn } from '@/lib/utils'
import type { DSADifficulty } from '@/types'

interface DifficultyBadgeProps {
  difficulty: DSADifficulty | string
  className?: string
}

const DIFFICULTY_CONFIG: Record<string, { label: string; style: string }> = {
  EASY: { label: 'Easy', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  MEDIUM: { label: 'Medium', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  HARD: { label: 'Hard', style: 'bg-red-500/10 text-red-400 border-red-500/20 font-semibold' },
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty] || {
    label: difficulty,
    style: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap',
        config.style,
        className
      )}
    >
      {config.label}
    </span>
  )
}
