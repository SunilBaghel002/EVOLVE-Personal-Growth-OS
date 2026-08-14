'use client'

import { ExternalLink, Edit2, Trash2, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react'
import { DifficultyBadge } from './DifficultyBadge'
import { ConfidenceRating } from './ConfidenceRating'
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
      <div className="p-12 text-center rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
        <p className="text-sm font-semibold text-white">No DSA problems match your criteria</p>
        <p className="text-xs text-neutral-400">Try adjusting your search query or topic/difficulty filter.</p>
      </div>
    )
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800 sticky top-0">
          <tr>
            <th className="px-4 py-3 font-semibold">Problem & Topic</th>
            <th className="px-4 py-3 font-semibold">Difficulty</th>
            <th className="px-4 py-3 font-semibold">Confidence</th>
            <th className="px-4 py-3 font-semibold">Time Taken</th>
            <th className="px-4 py-3 font-semibold">Solved Date</th>
            <th className="px-4 py-3 font-semibold">Next Revision</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/80">
          {problems.map((prob) => {
            const formattedSolvedDate = new Date(prob.solvedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            let formattedNextRevDate = '—'
            let isDue = false

            if (prob.nextRevisionDate) {
              const revDateObj = new Date(prob.nextRevisionDate)
              const revDateStr = revDateObj.toISOString().split('T')[0]
              isDue = revDateStr <= todayStr

              formattedNextRevDate = revDateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }

            return (
              <tr key={prob.id} className="hover:bg-neutral-800/40 transition-colors group">
                {/* Problem Title & Topic */}
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {prob.title}
                      </span>
                      {prob.problemUrl && (
                        <a
                          href={prob.problemUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-500 hover:text-blue-400 transition-colors"
                          title="Open problem link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-neutral-400 flex items-center gap-2 text-xs">
                      <span className="text-emerald-400/90 font-medium">{prob.topic}</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-500">{prob.platform}</span>
                    </div>
                  </div>
                </td>

                {/* Difficulty */}
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={prob.difficulty} />
                </td>

                {/* Confidence */}
                <td className="px-4 py-3">
                  <ConfidenceRating value={prob.confidence} readOnly />
                </td>

                {/* Time Taken */}
                <td className="px-4 py-3 text-neutral-400">
                  {prob.timeTakenMinutes !== null && prob.timeTakenMinutes !== undefined ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{prob.timeTakenMinutes} mins</span>
                    </div>
                  ) : (
                    <span className="text-neutral-600">—</span>
                  )}
                </td>

                {/* Solved Date */}
                <td className="px-4 py-3 text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{formattedSolvedDate}</span>
                  </div>
                </td>

                {/* Next Revision */}
                <td className="px-4 py-3">
                  {isDue ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      <span>Due ({formattedNextRevDate})</span>
                    </span>
                  ) : (
                    <span className="text-neutral-400 text-xs font-medium">
                      {formattedNextRevDate}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Mark Revised Button */}
                    <button
                      type="button"
                      onClick={() => onMarkRevised(prob.id, prob.confidence)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 transition-colors"
                      title="Mark problem as revised today"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Revised</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(prob)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                      title="Edit problem"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(prob)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
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
