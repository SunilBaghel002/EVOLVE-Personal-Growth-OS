'use client'

import { CheckCircle2, Clock, Briefcase, Brain, Calendar } from 'lucide-react'

export interface ChallengeDayItem {
  id: string
  dayNumber: number
  date: string | Date
  targetHours: number
  achievedHours: number
  targetApps: number
  achievedApps: number
  targetDSA: number
  achievedDSA: number
  completed: boolean
  exerciseDone?: boolean
  isToday?: boolean
  isPast?: boolean
  isFuture?: boolean
}

interface ChallengeGridProps {
  days: ChallengeDayItem[]
  onSelectDay?: (day: ChallengeDayItem) => void
}

export function ChallengeGrid({ days, onSelectDay }: ChallengeGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">21-Day Challenge Timeline Grid</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">August 12 — September 2, 2026</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Completed
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> In Progress / Partial
          </span>
          <span className="flex items-center gap-1 text-slate-400 dark:text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-neutral-700 inline-block" /> Upcoming
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
        {days.map((day) => {
          const dateStr = new Date(day.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          })

          const isFullyMet = day.completed
          const isPartialMet = day.achievedHours > 0 || day.achievedApps > 0 || day.achievedDSA > 0

          let statusClass = 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
          if (isFullyMet) {
            statusClass = 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-300'
          } else if (day.isToday) {
            statusClass = 'bg-slate-100 dark:bg-neutral-800 border-emerald-500 ring-2 ring-emerald-500/20'
          } else if (isPartialMet && day.isPast) {
            statusClass = 'bg-amber-50 dark:bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-300'
          }

          return (
            <button
              key={day.id || day.dayNumber}
              type="button"
              onClick={() => onSelectDay && onSelectDay(day)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 shadow-sm flex flex-col justify-between space-y-2 relative overflow-hidden group ${statusClass}`}
            >
              {day.isToday && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                  Today
                </span>
              )}

              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-neutral-400 block">
                  Day {day.dayNumber}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{dateStr}</span>
                </span>
              </div>

              {/* Progress Counters */}
              <div className="space-y-1 text-[11px] font-bold">
                <div className="flex items-center justify-between text-slate-700 dark:text-neutral-300">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Hrs</span>
                  </span>
                  <span className={day.achievedHours >= 11 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}>
                    {day.achievedHours}/11h
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 dark:text-neutral-300">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Briefcase className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span>Apps</span>
                  </span>
                  <span className={day.achievedApps >= 5 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}>
                    {day.achievedApps}/5
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 dark:text-neutral-300">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Brain className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span>DSA</span>
                  </span>
                  <span className={day.achievedDSA >= 2 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}>
                    {day.achievedDSA}/2
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-neutral-800/80 flex items-center justify-between">
                {isFullyMet ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Met
                  </span>
                ) : isPartialMet ? (
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">In Progress</span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500">Pending</span>
                )}

                {day.exerciseDone && (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400" title="Workout Done">
                    💪
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
