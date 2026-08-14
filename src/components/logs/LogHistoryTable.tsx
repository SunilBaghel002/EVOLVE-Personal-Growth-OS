'use client'

import { Calendar, Eye, Dumbbell, Check } from 'lucide-react'
import { toLocalDateString } from '@/lib/utils/dsa'
import type { DailyLogEntry } from '@/types'

interface LogHistoryTableProps {
  logs: DailyLogEntry[]
  onSelectLog: (log: DailyLogEntry) => void
  onEditLog: (log: DailyLogEntry) => void
}

export function LogHistoryTable({ logs, onSelectLog, onEditLog }: LogHistoryTableProps) {
  if (logs.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
        <p className="text-sm font-semibold text-white">No historical daily logs recorded yet</p>
        <p className="text-xs text-neutral-400">Log your study hours today using the form above!</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800 sticky top-0">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Total Hours</th>
            <th className="px-4 py-3 font-semibold">Breakdown</th>
            <th className="px-4 py-3 font-semibold">Workout</th>
            <th className="px-4 py-3 font-semibold">Focus</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/80">
          {logs.map((log) => {
            const formattedDate = log.date ? toLocalDateString(log.date) : '—'
            const isTargetMet = (log.totalHours || 0) >= 11

            return (
              <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors group">
                {/* Date */}
                <td className="px-4 py-3 font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* Total Hours */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isTargetMet
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    <span>{log.totalHours?.toFixed(1) || 0} hrs</span>
                    {isTargetMet && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </td>

                {/* Breakdown Pills */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      DSA: {log.interviewHours || 0}h
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                      MERN: {log.mernHours || 0}h
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                      CS: {log.gateHours || 0}h
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      Proj: {log.projectHours || 0}h
                    </span>
                  </div>
                </td>

                {/* Workout */}
                <td className="px-4 py-3">
                  {log.exerciseDone ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  ) : (
                    <span className="text-neutral-600 text-[11px]">—</span>
                  )}
                </td>

                {/* Focus */}
                <td className="px-4 py-3 text-neutral-300 font-medium text-xs">
                  {log.focusLevel || 3}/5
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                      title="View complete details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors"
                      title="Edit log entry"
                    >
                      <span>Edit</span>
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
