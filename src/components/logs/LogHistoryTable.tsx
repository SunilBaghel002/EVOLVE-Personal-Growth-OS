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
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-sm">
        <p className="text-sm font-bold text-slate-900 dark:text-white">No historical daily logs recorded yet</p>
        <p className="text-xs text-slate-500 dark:text-neutral-400">Log your study hours today using the form above!</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-neutral-800 sticky top-0">
          <tr>
            <th className="px-4 py-3.5 font-bold">Date</th>
            <th className="px-4 py-3.5 font-bold">Total Hours</th>
            <th className="px-4 py-3.5 font-bold">Breakdown</th>
            <th className="px-4 py-3.5 font-bold">Workout</th>
            <th className="px-4 py-3.5 font-bold">Focus</th>
            <th className="px-4 py-3.5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-800/80">
          {logs.map((log) => {
            const formattedDate = log.date ? toLocalDateString(log.date) : '—'
            const isTargetMet = (log.totalHours || 0) >= 11

            return (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors group">
                {/* Date */}
                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* Total Hours */}
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isTargetMet
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700'
                    }`}
                  >
                    <span>{log.totalHours?.toFixed(1) || 0} hrs</span>
                    {isTargetMet && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </td>

                {/* Breakdown Pills */}
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
                      DSA: {log.interviewHours || 0}h
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
                      MERN: {log.mernHours || 0}h
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold">
                      CS: {log.gateHours || 0}h
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
                      Proj: {log.projectHours || 0}h
                    </span>
                  </div>
                </td>

                {/* Workout */}
                <td className="px-4 py-3.5">
                  {log.exerciseDone ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-neutral-600 text-[11px]">—</span>
                  )}
                </td>

                {/* Focus */}
                <td className="px-4 py-3.5 text-slate-700 dark:text-neutral-300 font-bold text-xs">
                  {log.focusLevel || 3}/5
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-bold transition-colors"
                      title="View complete details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 transition-colors"
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
