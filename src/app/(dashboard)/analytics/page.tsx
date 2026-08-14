'use client'

import { useState, useEffect } from 'react'
import { Clock, Briefcase, Brain, Trophy } from 'lucide-react'
import { ChallengeGrid } from '@/components/analytics/ChallengeGrid'
import { StreakCard } from '@/components/analytics/StreakCard'

interface AnalyticsData {
  challengeDays: Array<{
    id: string
    dayNumber: number
    date: string
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
  }>
  metrics: {
    totalHoursLogged: number
    targetHoursTotal: number
    totalAppsSubmitted: number
    targetAppsTotal: number
    totalDSASolved: number
    targetDSATotal: number
    totalDaysCompleted: number
    streaks: {
      studyHoursStreak: number
      appsStreak: number
      dsaStreak: number
      exerciseStreak: number
    }
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChallengeData() {
      try {
        const res = await fetch('/api/challenge')
        const result = await res.json()
        if (result.success) {
          setData(result.data)
        }
      } catch (err) {
        console.error('Failed to fetch analytics challenge data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChallengeData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">21-Day Challenge Progress & Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Live streak tracking and target progress for Aug 12 - Sep 2, 2026.</p>
        </div>
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 animate-pulse">Loading challenge progress metrics...</p>
        </div>
      </div>
    )
  }

  const metrics = data?.metrics
  const hoursPercent = metrics ? Math.min(100, Math.round((metrics.totalHoursLogged / metrics.targetHoursTotal) * 100)) : 0
  const appsPercent = metrics ? Math.min(100, Math.round((metrics.totalAppsSubmitted / metrics.targetAppsTotal) * 100)) : 0
  const dsaPercent = metrics ? Math.min(100, Math.round((metrics.totalDSASolved / metrics.targetDSATotal) * 100)) : 0

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">21-Day Challenge Progress & Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Real-time performance tracking for Sunil&apos;s 21-Day Transformation Challenge (Aug 12 - Sep 2, 2026).
          </p>
        </div>

        {/* Overall Completion Banner Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs self-start sm:self-auto">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {metrics?.totalDaysCompleted || 0} / 21 Days Perfect
              </span>
              <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                ({Math.round(((metrics?.totalDaysCompleted || 0) / 21) * 100)}%)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold">Aug 12 — Sep 2 Target Timeline</p>
          </div>
        </div>
      </div>

      {/* Multi-Streak Row */}
      {metrics?.streaks && <StreakCard streaks={metrics.streaks} />}

      {/* 3 Main Targets Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Study Hours */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Total Study Hours
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{hoursPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics?.totalHoursLogged.toFixed(1) || 0} <span className="text-xs text-slate-500 dark:text-neutral-400 font-normal">hrs</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-bold">/ 231 hrs target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${hoursPercent}%` }} />
          </div>
        </div>

        {/* Total Job Applications */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Total Job Applications
            </span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">{appsPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics?.totalAppsSubmitted || 0} <span className="text-xs text-slate-500 dark:text-neutral-400 font-normal">apps</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-bold">/ 105 apps target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${appsPercent}%` }} />
          </div>
        </div>

        {/* Total DSA Problems */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Total DSA Solved
            </span>
            <span className="text-xs font-black text-purple-600 dark:text-purple-400">{dsaPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics?.totalDSASolved || 0} <span className="text-xs text-slate-500 dark:text-neutral-400 font-normal">problems</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-bold">/ 42 probs target</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${dsaPercent}%` }} />
          </div>
        </div>
      </div>

      {/* 21-Day Timeline Grid */}
      {data?.challengeDays && <ChallengeGrid days={data.challengeDays} />}
    </div>
  )
}
