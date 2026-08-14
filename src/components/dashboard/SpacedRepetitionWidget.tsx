'use client'

import Link from 'next/link'
import { AlertCircle, CheckCircle2, ArrowRight, Brain } from 'lucide-react'
import { DifficultyBadge } from '@/components/dsa/DifficultyBadge'
import { toLocalDateString } from '@/lib/utils/dsa'
import type { DSAProblemEntry } from '@/types'

interface SpacedRepetitionWidgetProps {
  dueProblems: DSAProblemEntry[]
  onMarkRevised: (id: string, confidence: number) => void
}

export function SpacedRepetitionWidget({
  dueProblems,
  onMarkRevised,
}: SpacedRepetitionWidgetProps) {
  if (dueProblems.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Spaced Repetition Due</h3>
          </div>
          <Link href="/dsa" className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors">
            <span>View All DSA</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 text-center rounded-xl bg-neutral-900/40 border border-neutral-800/80 space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
          <p className="text-xs font-semibold text-white">All caught up for today!</p>
          <p className="text-[11px] text-neutral-400">No DSA problems are due for revision right now.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white">
            Spaced Repetition Due ({dueProblems.length})
          </h3>
        </div>
        <Link href="/dsa" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
          <span>Go to DSA Tracker</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {dueProblems.map((prob) => (
          <div
            key={prob.id}
            className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-bold text-white truncate block">
                {prob.title}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="text-emerald-400 font-medium">{prob.topic}</span>
                <span>•</span>
                <span>Due: {toLocalDateString(prob.nextRevisionDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <DifficultyBadge difficulty={prob.difficulty} />
              <button
                type="button"
                onClick={() => onMarkRevised(prob.id, prob.confidence)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 transition-colors"
                title="Mark revised today"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Revised</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
