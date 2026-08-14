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
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Spaced Repetition Due</h3>
          </div>
          <Link href="/dsa" className="text-xs text-slate-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
            <span>View All DSA</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200/80 dark:border-neutral-800/80 space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-slate-900 dark:text-white">All caught up for today!</p>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">No DSA problems are due for revision right now.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Spaced Repetition Due ({dueProblems.length})
          </h3>
        </div>
        <Link href="/dsa" className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold">
          <span>Go to DSA Tracker</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {dueProblems.map((prob) => (
          <div
            key={prob.id}
            className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {prob.title}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-neutral-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{prob.topic}</span>
                <span>•</span>
                <span>Due: {toLocalDateString(prob.nextRevisionDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <DifficultyBadge difficulty={prob.difficulty} />
              <button
                type="button"
                onClick={() => onMarkRevised(prob.id, prob.confidence)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20 transition-colors shadow-xs"
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
