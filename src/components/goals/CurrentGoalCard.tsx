'use client'

import { Clock, Briefcase, Brain, BookOpen, CheckCircle2, Target, Calendar, Edit3 } from 'lucide-react'

export interface WeeklyGoalItem {
  id: string
  weekNumber: number
  startDate: string
  endDate: string
  studyHoursTarget: number
  appsTarget: number
  dsaTarget: number
  mernTopicsTarget: number
  achieved: boolean
  notes?: string | null
}

export interface GoalActuals {
  studyHours: number
  apps: number
  dsa: number
  mernTopics: number
}

interface CurrentGoalCardProps {
  goal: WeeklyGoalItem
  actuals: GoalActuals
  onEditGoal: () => void
}

export function CurrentGoalCard({ goal, actuals, onEditGoal }: CurrentGoalCardProps) {
  const hoursPct = Math.min(100, Math.round((actuals.studyHours / goal.studyHoursTarget) * 100))
  const appsPct = Math.min(100, Math.round((actuals.apps / goal.appsTarget) * 100))
  const dsaPct = Math.min(100, Math.round((actuals.dsa / goal.dsaTarget) * 100))
  const mernPct = Math.min(100, Math.round((actuals.mernTopics / goal.mernTopicsTarget) * 100))

  const overallPct = Math.round((hoursPct + appsPct + dsaPct + mernPct) / 4)

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
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-6 shadow-sm">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Week {goal.weekNumber} Active Targets
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {startDateFormatted} – {endDateFormatted}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {goal.achieved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> All Targets Achieved 🎉
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
              <Target className="w-4 h-4" /> {overallPct}% Week Progress
            </span>
          )}

          <button
            type="button"
            onClick={onEditGoal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Set Targets</span>
          </button>
        </div>
      </div>

      {/* 4 Targets Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Study Hours Target */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
              <Clock className="w-4 h-4 text-emerald-500" /> Study Hours Target
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{hoursPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {actuals.studyHours} <span className="text-xs text-slate-400 font-normal">hrs</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {goal.studyHoursTarget} hrs target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-neutral-700 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${hoursPct}%` }} />
          </div>
        </div>

        {/* Job Applications Target */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
              <Briefcase className="w-4 h-4 text-blue-500" /> Job Applications Target
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{appsPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {actuals.apps} <span className="text-xs text-slate-400 font-normal">apps</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {goal.appsTarget} apps target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-neutral-700 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${appsPct}%` }} />
          </div>
        </div>

        {/* DSA Problems Target */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
              <Brain className="w-4 h-4 text-purple-500" /> DSA Problems Target
            </span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{dsaPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {actuals.dsa} <span className="text-xs text-slate-400 font-normal">probs</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {goal.dsaTarget} probs target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-neutral-700 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${dsaPct}%` }} />
          </div>
        </div>

        {/* MERN Topics Target */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
              <BookOpen className="w-4 h-4 text-amber-500" /> MERN Topics Target
            </span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{mernPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {actuals.mernTopics} <span className="text-xs text-slate-400 font-normal">topics</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {goal.mernTopicsTarget} topics target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-neutral-700 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${mernPct}%` }} />
          </div>
        </div>
      </div>

      {/* Goal Notes */}
      {goal.notes && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-neutral-300 space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">Sunday Strategy Note:</span>
          <p className="italic">{goal.notes}</p>
        </div>
      )}
    </div>
  )
}
