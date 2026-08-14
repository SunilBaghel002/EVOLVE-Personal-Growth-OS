'use client'

import { ExternalLink, Edit2, Trash2, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react'
import { DifficultyBadge } from './DifficultyBadge'
import { ConfidenceRating } from './ConfidenceRating'
import { isDueForRevision, toLocalDateString } from '@/lib/utils/dsa'
import type { DSAProblemEntry } from '@/types'

interface DSATableProps {
  problems: DSAProblemEntry[]
  onEdit: (problem: DSAProblemEntry) => void
  onDelete: (problem: DSAProblemEntry) => void
  onMarkRevised: (id: string, confidence: number) => void
}

export function DSATable({
  problems,
  onEdit,
  onDelete,
  onMarkRevised,
}: DSATableProps) {
  if (problems.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-sm">
        <p className="text-sm font-bold text-slate-900 dark:text-white">No DSA problems match your criteria</p>
        <p className="text-xs text-slate-500 dark:text-neutral-400">Try adjusting your search query or topic/difficulty filter.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-neutral-800 sticky top-0">
          <tr>
            <th className="px-4 py-3.5 font-bold">Problem & Topic</th>
            <th className="px-4 py-3.5 font-bold">Difficulty</th>
            <th className="px-4 py-3.5 font-bold">Confidence</th>
            <th className="px-4 py-3.5 font-bold">Time Taken</th>
            <th className="px-4 py-3.5 font-bold">Solved Date</th>
            <th className="px-4 py-3.5 font-bold">Next Revision</th>
            <th className="px-4 py-3.5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-800/80">
          {problems.map((prob) => {
            const formattedSolvedDate = toLocalDateString(prob.solvedDate) || '—'
            const isDue = isDueForRevision(prob.nextRevisionDate)
            const formattedNextRevDate = toLocalDateString(prob.nextRevisionDate) || '—'

            return (
              <tr key={prob.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors group">
                {/* Problem Title & Topic */}
                <td className="px-4 py-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {prob.title}
                      </span>
                      {prob.problemUrl && (
                        <a
                          href={prob.problemUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 dark:text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Open problem link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-slate-500 dark:text-neutral-400 flex items-center gap-2 text-xs font-medium">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{prob.topic}</span>
                      <span className="text-slate-300 dark:text-neutral-600">•</span>
                      <span className="text-slate-400 dark:text-neutral-500">{prob.platform}</span>
                    </div>
                  </div>
                </td>

                {/* Difficulty */}
                <td className="px-4 py-3.5">
                  <DifficultyBadge difficulty={prob.difficulty} />
                </td>

                {/* Confidence */}
                <td className="px-4 py-3.5">
                  <ConfidenceRating value={prob.confidence} readOnly />
                </td>

                {/* Time Taken */}
                <td className="px-4 py-3.5 text-slate-600 dark:text-neutral-400 font-medium">
                  {prob.timeTakenMinutes !== null && prob.timeTakenMinutes !== undefined ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                      <span>{prob.timeTakenMinutes} mins</span>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-neutral-600">—</span>
                  )}
                </td>

                {/* Solved Date */}
                <td className="px-4 py-3.5 text-slate-600 dark:text-neutral-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                    <span>{formattedSolvedDate}</span>
                  </div>
                </td>

                {/* Next Revision */}
                <td className="px-4 py-3.5">
                  {isDue ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      <span>Due ({formattedNextRevDate})</span>
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-neutral-400 text-xs font-semibold">
                      {formattedNextRevDate}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Mark Revised Button */}
                    <button
                      type="button"
                      onClick={() => onMarkRevised(prob.id, prob.confidence)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20 transition-colors shadow-xs"
                      title="Mark problem as revised today"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Revised</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(prob)}
                      className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Edit problem"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(prob)}
                      className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-red-400 hover:bg-rose-500/10 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete problem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
