'use client'

import { useState, useEffect, useCallback } from 'react'
import { Target, RefreshCw, AlertTriangle, Calendar, PlusCircle } from 'lucide-react'
import { CurrentGoalCard, type WeeklyGoalItem, type GoalActuals } from '@/components/goals/CurrentGoalCard'
import { GoalFormModal } from '@/components/goals/GoalFormModal'
import { HistoricalGoalsList } from '@/components/goals/HistoricalGoalsList'
import { TOTAL_CHALLENGE_DAYS } from '@/lib/constants'

export default function GoalsPage() {
  const [currentGoal, setCurrentGoal] = useState<WeeklyGoalItem | null>(null)
  const [actuals, setActuals] = useState<GoalActuals | null>(null)
  const [historicalGoals, setHistoricalGoals] = useState<WeeklyGoalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchGoalsData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [currentRes, historicalRes] = await Promise.all([
        fetch('/api/goals/current'),
        fetch('/api/goals'),
      ])

      const currentJson = await currentRes.json()
      const historicalJson = await historicalRes.json()

      if (!currentRes.ok || !currentJson.success) {
        setError(currentJson.error?.message || 'Failed to load current week goals')
        return
      }

      if (!historicalRes.ok || !historicalJson.success) {
        setError(historicalJson.error?.message || 'Failed to load historical goals')
        return
      }

      setCurrentGoal(currentJson.data.goal)
      setActuals(currentJson.data.actuals)
      setHistoricalGoals(historicalJson.data || [])
    } catch (err) {
      console.error('Error fetching goals data:', err)
      setError('A network error occurred while loading goals.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoalsData()
  }, [fetchGoalsData])

  const isTodaySunday = new Date().getUTCDay() === 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Goals & Strategy</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Weekly targets and real-time achievement tracking.</p>
        </div>
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Loading weekly goal targets & actuals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Goals & Strategy</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Weekly targets and real-time achievement tracking.</p>
        </div>
        <div className="p-8 text-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Unable to Load Weekly Goals</p>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchGoalsData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Goals & Strategy</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Set weekly benchmark targets, track progress live, and review historical performance across Sunil&apos;s {TOTAL_CHALLENGE_DAYS}-Day Challenge.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Set Weekly Targets</span>
        </button>
      </div>

      {/* Sunday Goal Setting Reminder Banner */}
      {isTodaySunday && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sunday Goal-Setting Ritual ☀️</h4>
              <p className="text-[11px] text-slate-600 dark:text-neutral-300">
                It&apos;s Sunday! Review your weekly progress and configure your targets for next week.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shrink-0"
          >
            Configure Week Goals
          </button>
        </div>
      )}

      {/* Current Week Progress Card */}
      {currentGoal && actuals && (
        <CurrentGoalCard
          goal={currentGoal}
          actuals={actuals}
          onEditGoal={() => setIsModalOpen(true)}
        />
      )}

      {/* Historical Goals List */}
      <HistoricalGoalsList goals={historicalGoals} />

      {/* Goal Form Modal */}
      {currentGoal && (
        <GoalFormModal
          currentGoal={currentGoal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchGoalsData}
        />
      )}
    </div>
  )
}
