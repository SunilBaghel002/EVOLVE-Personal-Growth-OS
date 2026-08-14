'use client'

import { useEffect, useRef } from 'react'
import { X, Calendar, Clock, Dumbbell, Zap, CheckCircle2, Target, Flame } from 'lucide-react'
import { toLocalDateString } from '@/lib/utils/dsa'
import type { DailyLogEntry } from '@/types'

interface LogDetailModalProps {
  isOpen: boolean
  log: DailyLogEntry | null
  onClose: () => void
}

export function LogDetailModal({ isOpen, log, onClose }: LogDetailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !log) return null

  const formattedDate = log.date ? toLocalDateString(log.date) : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-detail-title"
        className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="log-detail-title" className="text-base font-bold text-slate-900 dark:text-white">
                Daily Log ({formattedDate})
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Detailed study breakdown & habit progress</p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Hours Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Total Study Time</span>
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">{log.totalHours?.toFixed(1) || 0} Hours</span>
        </div>

        {/* 4 Categories */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Category Breakdown</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-800 dark:text-purple-300 flex justify-between">
              <span>DSA / Interview:</span>
              <span className="font-black">{log.interviewHours || 0} hrs</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex justify-between">
              <span>MERN Revision:</span>
              <span className="font-black">{log.mernHours || 0} hrs</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 flex justify-between">
              <span>CS Core / Aptitude:</span>
              <span className="font-black">{log.gateHours || 0} hrs</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex justify-between">
              <span>Projects:</span>
              <span className="font-black">{log.projectHours || 0} hrs</span>
            </div>
          </div>
        </div>

        {/* Habit & Ratings */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Workout:
            </span>
            <span className={`font-bold ${log.exerciseDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500'}`}>
              {log.exerciseDone ? 'Completed' : 'No'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-neutral-400">Energy / Focus:</span>
            <span className="font-black text-amber-600 dark:text-amber-400">
              {log.energyLevel || 3}/5 • {log.focusLevel || 3}/5
            </span>
          </div>
        </div>

        {/* Reflections */}
        {log.whatWentWell && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> What Went Well
            </span>
            <p className="text-xs text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 leading-relaxed font-medium">
              {log.whatWentWell}
            </p>
          </div>
        )}

        {log.blockers && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Blockers / Distractions
            </span>
            <p className="text-xs text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 leading-relaxed font-medium">
              {log.blockers}
            </p>
          </div>
        )}

        {log.tomorrowPriority && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Tomorrow&apos;s Priority
            </span>
            <p className="text-xs text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 leading-relaxed font-medium">
              {log.tomorrowPriority}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
