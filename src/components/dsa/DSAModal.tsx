'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, ExternalLink } from 'lucide-react'
import { createDSAProblemSchema, type CreateDSAProblemInput } from '@/lib/validations/dsa'
import { ConfidenceRating } from './ConfidenceRating'
import { DSA_TOPICS, DSA_DIFFICULTIES } from '@/lib/constants'
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
  const [formData, setFormData] = useState<CreateDSAProblemInput>({
    title: '',
    problemUrl: '',
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'EASY',
    timeTakenMinutes: 30,
    confidence: 3,
    notes: '',
    solvedDate: new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        problemUrl: initialData.problemUrl || '',
        platform: initialData.platform || 'LeetCode',
        topic: initialData.topic || 'Arrays',
        difficulty: (initialData.difficulty as 'EASY' | 'MEDIUM' | 'HARD') || 'EASY',
        timeTakenMinutes: initialData.timeTakenMinutes !== undefined ? initialData.timeTakenMinutes : 30,
        confidence: initialData.confidence || 3,
        notes: initialData.notes || '',
        solvedDate: initialData.solvedDate
          ? new Date(initialData.solvedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
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
        solvedDate: new Date().toISOString().split('T')[0],
      })
    }
    setErrors({})
  }, [initialData, isOpen])

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-white">
              {initialData ? 'Edit DSA Problem' : 'Log Solved DSA Problem'}
            </h2>
            <p className="text-xs text-neutral-400">
              {initialData ? 'Update problem details and confidence rating' : 'Track a new solved problem to activate spaced repetition'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Problem Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Problem Title / Name <span className="text-red-400">*</span>
            </label>
            <input
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
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Topic Category <span className="text-red-400">*</span>
              </label>
              <select
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
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
              <select
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
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Platform</label>
              <input
                type="text"
                placeholder="e.g. LeetCode, GFG, Codeforces"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Time Taken */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Time Taken (Minutes)</label>
              <input
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
            <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
              <span>Problem Link / URL</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </label>
            <input
              type="text"
              placeholder="https://leetcode.com/problems/two-sum/"
              value={formData.problemUrl || ''}
              onChange={(e) => handleChange('problemUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {errors.problemUrl && <p className="text-[11px] text-red-400 mt-1">{errors.problemUrl}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Confidence Rating */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Confidence Rating (1-5 Stars) <span className="text-red-400">*</span>
              </label>
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
            </div>

            {/* Solved Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Solved Date</label>
              <input
                type="date"
                value={formData.solvedDate || ''}
                onChange={(e) => handleChange('solvedDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Approach & Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Approach & Key Learnings</label>
            <textarea
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
