'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Loader2, Star, ExternalLink } from 'lucide-react'
import { createDSAProblemSchema, type CreateDSAProblemInput } from '@/lib/validations/dsa'
import { DSA_TOPICS, DSA_DIFFICULTIES, DSA_PLATFORMS } from '@/lib/constants'
import type { DSAProblemEntry } from '@/types'

interface DSAModalProps {
  isOpen: boolean
  initialData?: DSAProblemEntry | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: CreateDSAProblemInput) => void
}

export function DSAModal({
  isOpen,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: DSAModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CreateDSAProblemInput>({
    title: '',
    problemUrl: '',
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'EASY',
    timeTakenMinutes: 30,
    confidence: 3,
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) return

    if (initialData) {
      setFormData({
        title: initialData.title || '',
        problemUrl: initialData.problemUrl || '',
        platform: initialData.platform || 'LeetCode',
        topic: initialData.topic || 'Arrays',
        difficulty: initialData.difficulty || 'EASY',
        timeTakenMinutes: initialData.timeTakenMinutes ?? 30,
        confidence: initialData.confidence || 3,
        notes: initialData.notes || '',
      })
    } else {
      setFormData({
        title: '',
        problemUrl: '',
        platform: 'LeetCode',
        topic: 'Arrays',
        difficulty: 'EASY',
        timeTakenMinutes: 30,
        confidence: 3,
        notes: '',
      })
    }
    setErrors({})

    // Move initial focus into modal input
    setTimeout(() => {
      firstInputRef.current?.focus()
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [initialData, isOpen, onClose])

  if (!isOpen) return null

  const handleChange = (field: keyof CreateDSAProblemInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const result = createDSAProblemSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(newErrors)
      return
    }

    onSubmit(result.data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dsa-modal-title"
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-800">
          <div>
            <h2 id="dsa-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit DSA Problem' : 'Log Solved DSA Problem'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              {initialData ? 'Update problem details and confidence rating' : 'Track a new solved problem to activate spaced repetition'}
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Problem Title */}
          <div>
            <label htmlFor="dsa-title-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
              Problem Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="dsa-title-input"
              ref={firstInputRef}
              type="text"
              placeholder="e.g. 3Sum, Trapping Rain Water, LRU Cache"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
            />
            {errors.title && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Topic */}
            <div>
              <label htmlFor="dsa-topic-select" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Topic / Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="dsa-topic-select"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all cursor-pointer shadow-xs"
              >
                {DSA_TOPICS.map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="dsa-difficulty-select" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Difficulty</label>
              <select
                id="dsa-difficulty-select"
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all cursor-pointer shadow-xs"
              >
                {DSA_DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Platform */}
            <div>
              <label htmlFor="dsa-platform-select" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Platform</label>
              <select
                id="dsa-platform-select"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all cursor-pointer shadow-xs"
              >
                {DSA_PLATFORMS.map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Taken */}
            <div>
              <label htmlFor="dsa-timetaken-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Time Taken (Minutes)</label>
              <input
                id="dsa-timetaken-input"
                type="number"
                min="1"
                max="300"
                value={formData.timeTakenMinutes || ''}
                onChange={(e) =>
                  handleChange('timeTakenMinutes', e.target.value ? parseInt(e.target.value, 10) : null)
                }
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-bold transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Problem URL */}
          <div>
            <label htmlFor="dsa-url-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
              <span>Problem Link URL</span>
              {formData.problemUrl && (
                <a
                  href={formData.problemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link
                </a>
              )}
            </label>
            <input
              id="dsa-url-input"
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={formData.problemUrl || ''}
              onChange={(e) => handleChange('problemUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
            />
          </div>

          {/* Confidence Rating (1-5 Stars) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
              Confidence Rating (1 = Weak, 5 = Mastered)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = starVal <= (formData.confidence || 3)
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => handleChange('confidence', starVal)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={`Rate confidence level ${starVal}/5`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-neutral-700'
                      }`}
                    />
                  </button>
                )
              })}
              <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 ml-2">
                {formData.confidence}/5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
              Spaced Repetition due date will be calculated automatically based on this rating (+2d for 1-2, +5d for 3, +10d for 4, +20d for 5).
            </p>
          </div>

          {/* Notes & Approaches */}
          <div>
            <label htmlFor="dsa-notes-textarea" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
              Notes & Key Algorithmic Insights
            </label>
            <textarea
              id="dsa-notes-textarea"
              rows={3}
              placeholder="e.g. Used Two Pointers after sorting array. Edge case: handle duplicates by advancing L pointer."
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all resize-none shadow-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Problem' : 'Save Problem'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
