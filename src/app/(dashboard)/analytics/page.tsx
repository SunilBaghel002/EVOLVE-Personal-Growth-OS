'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, Briefcase, Brain, Trophy, AlertTriangle, RefreshCw, X, Calendar, CheckCircle2 } from 'lucide-react'
import { ChallengeGrid, type ChallengeDayItem } from '@/components/analytics/ChallengeGrid'
import { StreakCard } from '@/components/analytics/StreakCard'

interface AnalyticsData {
  challengeDays: ChallengeDayItem[]
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
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<ChallengeDayItem | null>(null)

  const fetchChallengeData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/challenge')
      const result = await res.json()

      if (!res.ok || !result.success) {
        setError(result.error?.message || 'Failed to load challenge analytics data')
        return
      }

      setData(result.data)
    } catch (err) {
      console.error('Failed to fetch analytics challenge data:', err)
      setError('A network error occurred while loading analytics data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChallengeData()
  }, [fetchChallengeData])

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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">21-Day Challenge Progress & Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Live streak tracking and target progress for Aug 12 - Sep 2, 2026.</p>
        </div>
        <div className="p-8 text-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Unable to Load Challenge Analytics</p>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchChallengeData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
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
        <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm self-start sm:self-auto">
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
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
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
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
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
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
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
      {data?.challengeDays && (
        <ChallengeGrid
          days={data.challengeDays}
          onSelectDay={(day) => setSelectedDay(day)}
        />
      )}

      {/* Selected Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-details-title"
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="day-details-title" className="text-base font-bold text-slate-900 dark:text-white">
                    Day {selectedDay.dayNumber} Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {new Date(selectedDay.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-800 flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-300">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Study Hours:
                </span>
                <span className={`font-black text-sm ${selectedDay.achievedHours >= 11 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {selectedDay.achievedHours} / 11 hrs
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-800 flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-300">
                  <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Job Applications:
                </span>
                <span className={`font-black text-sm ${selectedDay.achievedApps >= 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {selectedDay.achievedApps} / 5 apps
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-800 flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-300">
                  <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" /> DSA Solved:
                </span>
                <span className={`font-black text-sm ${selectedDay.achievedDSA >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {selectedDay.achievedDSA} / 2 problems
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-neutral-400 font-medium">Daily Target Status:</span>
              {selectedDay.completed ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Targets Met
                </span>
              ) : (
                <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Incomplete / In Progress
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
