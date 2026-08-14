'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Loader2, ExternalLink } from 'lucide-react'
import { createDSAProblemSchema, type CreateDSAProblemInput } from '@/lib/validations/dsa'
import { ConfidenceRating } from './ConfidenceRating'
import { DSA_TOPICS, DSA_DIFFICULTIES } from '@/lib/constants'
import { toLocalDateString, getTodayLocalDateString } from '@/lib/utils/dsa'
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
  const titleInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CreateDSAProblemInput>({
    title: '',
    problemUrl: '',
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'EASY',
    timeTakenMinutes: 30,
    confidence: 3,
    notes: '',
    solvedDate: getTodayLocalDateString(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        problemUrl: initialData.problemUrl || '',
        platform: initialData.platform || 'LeetCode',
        topic: initialData.topic || 'Arrays',
        difficulty: initialData.difficulty || 'EASY',
        timeTakenMinutes: initialData.timeTakenMinutes !== undefined ? initialData.timeTakenMinutes : 30,
        confidence: initialData.confidence || 3,
        notes: initialData.notes || '',
        solvedDate: initialData.solvedDate
          ? toLocalDateString(initialData.solvedDate)
          : getTodayLocalDateString(),
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
        solvedDate: getTodayLocalDateString(),
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  useEffect(() => {
    if (!isOpen) return

    titleInputRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

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
            <label htmlFor="dsa-title-input" className="block text-xs font-semibold text-neutral-300 mb-1">
              Problem Title / Name <span className="text-red-400">*</span>
            </label>
            <input
              id="dsa-title-input"
              ref={titleInputRef}
              type="text"
              placeholder="e.g. Two Sum, Trapping Rain Water, LRU Cache"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Topic */}
            <div>
              <label htmlFor="dsa-topic-select" className="block text-xs font-semibold text-neutral-300 mb-1">
                Topic Category <span className="text-red-400">*</span>
              </label>
              <select
                id="dsa-topic-select"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                {DSA_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="dsa-difficulty-select" className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
              <select
                id="dsa-difficulty-select"
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
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
              <label htmlFor="dsa-platform-input" className="block text-xs font-semibold text-neutral-300 mb-1">Platform</label>
              <input
                id="dsa-platform-input"
                type="text"
                placeholder="e.g. LeetCode, GFG, Codeforces"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Time Taken */}
            <div>
              <label htmlFor="dsa-timetaken-input" className="block text-xs font-semibold text-neutral-300 mb-1">Time Taken (Minutes)</label>
              <input
                id="dsa-timetaken-input"
                type="number"
                min="0"
                max="300"
                placeholder="e.g. 25"
                value={formData.timeTakenMinutes !== undefined ? formData.timeTakenMinutes : ''}
                onChange={(e) => handleChange('timeTakenMinutes', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Problem Link */}
          <div>
            <label htmlFor="dsa-url-input" className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
              <span>Problem Link / URL</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </label>
            <input
              id="dsa-url-input"
              type="text"
              placeholder="https://leetcode.com/problems/two-sum/"
              value={formData.problemUrl || ''}
              onChange={(e) => handleChange('problemUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {errors.problemUrl && <p className="text-[11px] text-red-400 mt-1">{errors.problemUrl}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Confidence Rating Group */}
            <fieldset className="space-y-1">
              <legend className="block text-xs font-semibold text-neutral-300">
                Confidence Rating (1-5 Stars) <span className="text-red-400">*</span>
              </legend>
              <div className="flex items-center gap-3 pt-1">
                <ConfidenceRating
                  value={formData.confidence}
                  onChange={(val) => handleChange('confidence', val)}
                />
                <span className="text-xs font-semibold text-amber-400">
                  {formData.confidence}/5 Stars
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                {formData.confidence <= 2 && 'Revise in 2 days (Heavy struggle)'}
                {formData.confidence === 3 && 'Revise in 5 days (Moderate)'}
                {formData.confidence === 4 && 'Revise in 10 days (Comfortable)'}
                {formData.confidence === 5 && 'Revise in 20 days (Mastered)'}
              </p>
            </fieldset>

            {/* Solved Date */}
            <div>
              <label htmlFor="dsa-date-input" className="block text-xs font-semibold text-neutral-300 mb-1">Solved Date</label>
              <input
                id="dsa-date-input"
                type="date"
                value={formData.solvedDate || ''}
                onChange={(e) => handleChange('solvedDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Approach & Notes */}
          <div>
            <label htmlFor="dsa-notes-input" className="block text-xs font-semibold text-neutral-300 mb-1">Approach & Key Learnings</label>
            <textarea
              id="dsa-notes-input"
              rows={3}
              placeholder="e.g. Used HashMap for O(N) time complexity. Corner case: duplicate values."
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-colors disabled:opacity-50"
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
