'use client'

import { useState } from 'react'
import { X, Loader2, HelpCircle } from 'lucide-react'

interface ApplicationOption {
  id: string
  companyName: string
  role: string
}

interface InterviewQuestionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  applications: ApplicationOption[]
}

export function InterviewQuestionFormModal({
  isOpen,
  onClose,
  onSuccess,
  applications,
}: InterviewQuestionFormModalProps) {
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('DSA')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [applicationId, setApplicationId] = useState('')
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) {
      setErrorMsg('Question text is required')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          category,
          difficulty,
          applicationId: applicationId || null,
          answer: answer.trim() || null,
        }),
      })

      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to save question')
      }

      setQuestion('')
      setAnswer('')
      setApplicationId('')
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating question'
      setErrorMsg(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Log Interview Question</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Question Text *
            </label>
            <textarea
              required
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How do you optimize rendering performance in React using useMemo and React.memo?"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="DSA">DSA</option>
                <option value="System Design">System Design</option>
                <option value="React/MERN">React/MERN</option>
                <option value="Tech">Tech / JS Core</option>
                <option value="Behavioral">Behavioral</option>
                <option value="CS Core">CS Core</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Linked Application (Optional)
            </label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">-- General / Unlinked --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Model Answer / Key Points (Optional)
            </label>
            <textarea
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Key concepts, complexity analysis, or approach summary..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
