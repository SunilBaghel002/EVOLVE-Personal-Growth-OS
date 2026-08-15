'use client'

import { Target, CheckCircle2, Calendar, Clock, Briefcase, Brain, BookOpen } from 'lucide-react'
import type { WeeklyGoalItem } from './CurrentGoalCard'

interface HistoricalGoalsListProps {
  goals: WeeklyGoalItem[]
}

export function HistoricalGoalsList({ goals }: HistoricalGoalsListProps) {
  if (!goals || goals.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400 space-y-2">
        <Target className="w-8 h-8 text-slate-300 dark:text-neutral-600 mx-auto" />
        <p className="font-bold text-slate-700 dark:text-neutral-300">No Past Weekly Goals Found</p>
        <p className="max-w-xs mx-auto">Set your weekly targets to begin building a history of consistent achievement.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Historical Weekly Goals Timeline</span>
        </h3>
        <span className="text-xs text-slate-400 font-semibold">{goals.length} Weeks Logged</span>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => {
          const startDateFormatted = new Date(goal.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          })
          const endDateFormatted = new Date(goal.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
          })

          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-white flex items-center justify-center font-black text-xs">
                    W{goal.weekNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Week {goal.weekNumber} Goal</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{startDateFormatted} – {endDateFormatted}</p>
                  </div>
                </div>

                {goal.achieved ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-xs self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Achieved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg text-xs self-start sm:self-auto">
                    Recorded
                  </span>
                )}
              </div>

              {/* Target Breakdown Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 flex items-center justify-between font-mono">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" /> Study:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{goal.studyHoursTarget}h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 flex items-center justify-between font-mono">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-blue-500" /> Apps:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{goal.appsTarget}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 flex items-center justify-between font-mono">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Brain className="w-3 h-3 text-purple-500" /> DSA:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{goal.dsaTarget}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 flex items-center justify-between font-mono">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-500" /> MERN:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{goal.mernTopicsTarget}</span>
                </div>
              </div>

              {goal.notes && (
                <p className="text-xs text-slate-500 dark:text-neutral-400 italic pt-1">
                  &ldquo;{goal.notes}&rdquo;
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
