import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

interface StatusBadgeProps {
  status: ApplicationStatus | string
  className?: string
}

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  SAVED: { label: 'Saved', style: 'bg-neutral-800 text-neutral-300 border-neutral-700' },
  APPLIED: { label: 'Applied', style: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  OA_RECEIVED: { label: 'OA Received', style: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  OA_COMPLETED: { label: 'OA Done', style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  INTERVIEW_COMPLETED: { label: 'Interview Done', style: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  OFFER_RECEIVED: { label: 'Offer!', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold' },
  ACCEPTED: { label: 'Accepted', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 font-bold' },
  REJECTED: { label: 'Rejected', style: 'bg-red-500/10 text-red-400 border-red-500/20' },
  GHOSTED: { label: 'Ghosted', style: 'bg-neutral-900 text-neutral-500 border-neutral-800' },
  WITHDRAWN: { label: 'Withdrawn', style: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    style: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
        config.style,
        className
      )}
    >
      {config.label}
    </span>
  )
}
