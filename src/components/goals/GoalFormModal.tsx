'use client'

import { useState } from 'react'
import { X, Target, Save, Clock, Briefcase, Brain, BookOpen } from 'lucide-react'
import type { WeeklyGoalItem } from './CurrentGoalCard'

interface GoalFormModalProps {
  currentGoal: WeeklyGoalItem
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export function GoalFormModal({ currentGoal, isOpen, onClose, onSaved }: GoalFormModalProps) {
  const [weekNumber, setWeekNumber] = useState(currentGoal.weekNumber)
  const [studyHoursTarget, setStudyHoursTarget] = useState(currentGoal.studyHoursTarget)
  const [appsTarget, setAppsTarget] = useState(currentGoal.appsTarget)
  const [dsaTarget, setDsaTarget] = useState(currentGoal.dsaTarget)
  const [mernTopicsTarget, setMernTopicsTarget] = useState(currentGoal.mernTopicsTarget)
  const [notes, setNotes] = useState(currentGoal.notes || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber,
          startDate: currentGoal.startDate,
          endDate: currentGoal.endDate,
          studyHoursTarget: Number(studyHoursTarget),
          appsTarget: Number(appsTarget),
          dsaTarget: Number(dsaTarget),
          mernTopicsTarget: Number(mernTopicsTarget),
          notes: notes.trim() || null,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error?.message || 'Failed to save weekly goals.')
        return
      }

      onSaved()
      onClose()
    } catch (err) {
      console.error('Failed to submit goal form:', err)
      setError('An unexpected network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 id="goal-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Set Week {weekNumber} Goals
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Define study hours, application, DSA, and revision benchmarks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Study Hours Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Study Hours Target (hrs)
              </label>
              <input
                type="number"
                min={1}
                max={150}
                step={0.5}
                required
                value={studyHoursTarget}
                onChange={(e) => setStudyHoursTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Applications Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Job Applications Target
              </label>
              <input
                type="number"
                min={0}
                max={200}
                required
                value={appsTarget}
                onChange={(e) => setAppsTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DSA Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-500" /> DSA Problems Target
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={dsaTarget}
                onChange={(e) => setDsaTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* MERN Topics Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" /> MERN Topics Target
              </label>
              <input
                type="number"
                min={0}
                max={21}
                required
                value={mernTopicsTarget}
                onChange={(e) => setMernTopicsTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Strategy Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Sunday Strategy Note (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on GATE algorithms, solve 5 DP problems, send 5 custom resume referrals."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving...' : 'Save Goals'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
