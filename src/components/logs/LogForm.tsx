'use client'

import { useState, useEffect } from 'react'
import { Clock, Zap, Target, Loader2, CheckCircle2, Dumbbell, Flame, Check } from 'lucide-react'
import { toLocalDateString, getTodayLocalDateString } from '@/lib/utils/dsa'
import type { DailyLogInput } from '@/lib/validations/log'
import type { DailyLogEntry } from '@/types'

interface LogFormProps {
  initialLog?: DailyLogEntry | null
  isSubmitting: boolean
  onSubmit: (data: DailyLogInput) => void
  onDateChange?: (dateStr: string) => void
}

export function LogForm({
  initialLog,
  isSubmitting,
  onSubmit,
  onDateChange,
}: LogFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalDateString())
  const [formData, setFormData] = useState<DailyLogInput>({
    date: getTodayLocalDateString(),
    interviewHours: 3.5,
    mernHours: 4.5,
    gateHours: 2,
    projectHours: 1,
    exerciseDone: true,
    energyLevel: 4,
    focusLevel: 4,
    moodRating: 4,
    whatWentWell: '',
    whatWentWrong: '',
    blockers: '',
    tomorrowPriority: '',
  })

  useEffect(() => {
    if (initialLog) {
      const logDate = initialLog.date ? toLocalDateString(initialLog.date) : getTodayLocalDateString()
      setSelectedDate(logDate)
      setFormData({
        date: logDate,
        interviewHours: initialLog.interviewHours || 0,
        mernHours: initialLog.mernHours || 0,
        gateHours: initialLog.gateHours || 0,
        projectHours: initialLog.projectHours || 0,
        exerciseDone: !!initialLog.exerciseDone,
        energyLevel: initialLog.energyLevel || 3,
        focusLevel: initialLog.focusLevel || 3,
        moodRating: initialLog.moodRating || 3,
        whatWentWell: initialLog.whatWentWell || '',
        whatWentWrong: initialLog.whatWentWrong || '',
        blockers: initialLog.blockers || '',
        tomorrowPriority: initialLog.tomorrowPriority || '',
      })
    }
  }, [initialLog])

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    setFormData((prev) => ({ ...prev, date: dateStr }))
    if (onDateChange) onDateChange(dateStr)
  }

  const handleChange = (field: keyof DailyLogInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const totalStudyHours =
    (Number(formData.interviewHours) || 0) +
    (Number(formData.mernHours) || 0) +
    (Number(formData.gateHours) || 0) +
    (Number(formData.projectHours) || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: selectedDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
      {/* Date Header & Target Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="space-y-1">
          <label htmlFor="log-date-select" className="text-xs font-semibold text-neutral-400 block">
            Select Logging Date
          </label>
          <div className="flex items-center gap-2">
            <input
              id="log-date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
            {selectedDate === getTodayLocalDateString() && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Today
              </span>
            )}
          </div>
        </div>

        {/* Live Calculated Total Study Hours */}
        <div className="flex items-center gap-3 bg-neutral-800/80 px-4 py-2 rounded-xl border border-neutral-700/60 self-start sm:self-auto">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
              Total Study Hours
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">{totalStudyHours.toFixed(1)} hrs</span>
              <span className="text-xs text-neutral-400">/ 11 hrs target</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Study Categories Inputs Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Study Category Hours</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* DSA / Interview Prep */}
          <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-800 space-y-1.5">
            <label htmlFor="interview-hours" className="block text-xs font-semibold text-purple-300">
              DSA / Interview (hrs)
            </label>
            <input
              id="interview-hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.interviewHours || 0}
              onChange={(e) => handleChange('interviewHours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* MERN Stack */}
          <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-800 space-y-1.5">
            <label htmlFor="mern-hours" className="block text-xs font-semibold text-emerald-300">
              MERN Revision (hrs)
            </label>
            <input
              id="mern-hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.mernHours || 0}
              onChange={(e) => handleChange('mernHours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* CS Core / GATE / Aptitude */}
          <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-800 space-y-1.5">
            <label htmlFor="gate-hours" className="block text-xs font-semibold text-blue-300">
              CS Core / Aptitude (hrs)
            </label>
            <input
              id="gate-hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.gateHours || 0}
              onChange={(e) => handleChange('gateHours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Projects */}
          <div className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-800 space-y-1.5">
            <label htmlFor="project-hours" className="block text-xs font-semibold text-amber-300">
              Projects & Code (hrs)
            </label>
            <input
              id="project-hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.projectHours || 0}
              onChange={(e) => handleChange('projectHours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Habit & Rating Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Exercise Habit Toggle */}
        <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Physical Workout / Exercise</span>
              <span className="text-[11px] text-neutral-400">Completed 30+ mins workout</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleChange('exerciseDone', !formData.exerciseDone)}
            className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
              formData.exerciseDone
                ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                : 'bg-neutral-800 border-neutral-700 text-transparent'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* 1-5 Ratings Group */}
        <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800 grid grid-cols-3 gap-2">
          {/* Energy Level */}
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Energy</span>
            <select
              value={formData.energyLevel}
              onChange={(e) => handleChange('energyLevel', Number(e.target.value))}
              className="w-full px-2 py-1 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} / 5
                </option>
              ))}
            </select>
          </div>

          {/* Focus Level */}
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Focus</span>
            <select
              value={formData.focusLevel}
              onChange={(e) => handleChange('focusLevel', Number(e.target.value))}
              className="w-full px-2 py-1 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} / 5
                </option>
              ))}
            </select>
          </div>

          {/* Mood Rating */}
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Mood</span>
            <select
              value={formData.moodRating}
              onChange={(e) => handleChange('moodRating', Number(e.target.value))}
              className="w-full px-2 py-1 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} / 5
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reflections: What Went Well & Blockers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="what-went-well" className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>What Went Well Today</span>
          </label>
          <textarea
            id="what-went-well"
            rows={3}
            placeholder="e.g. Solved 3 DP problems, completed Next.js API routes."
            value={formData.whatWentWell || ''}
            onChange={(e) => handleChange('whatWentWell', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div>
          <label htmlFor="blockers-input" className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Blockers / Distractions</span>
          </label>
          <textarea
            id="blockers-input"
            rows={3}
            placeholder="e.g. Spent too much time debugging Prisma client."
            value={formData.blockers || ''}
            onChange={(e) => handleChange('blockers', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>
      </div>

      {/* Tomorrow Priority */}
      <div>
        <label htmlFor="tomorrow-priority" className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-400" />
          <span>Tomorrow&apos;s #1 Priority</span>
        </label>
        <input
          id="tomorrow-priority"
          type="text"
          placeholder="e.g. Complete Phase 1.5 MERN Revision checklist."
          value={formData.tomorrowPriority || ''}
          onChange={(e) => handleChange('tomorrowPriority', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Submit CTA */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Log...</span>
            </>
          ) : (
            <span>Save Daily Log ({selectedDate})</span>
          )}
        </button>
      </div>
    </form>
  )
}
