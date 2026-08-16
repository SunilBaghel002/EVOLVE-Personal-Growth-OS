'use client'

import { useState } from 'react'
import { X, Loader2, Calendar } from 'lucide-react'

interface ApplicationOption {
  id: string
  companyName: string
  role: string
}

interface InterviewRoundFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  applications: ApplicationOption[]
}

export function InterviewRoundFormModal({
  isOpen,
  onClose,
  onSuccess,
  applications,
}: InterviewRoundFormModalProps) {
  const [applicationId, setApplicationId] = useState('')
  const [roundName, setRoundName] = useState('Technical Screening')
  const [roundNumber, setRoundNumber] = useState(1)
  const [scheduledAt, setScheduledAt] = useState('')
  const [status, setStatus] = useState('SCHEDULED')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicationId) {
      setErrorMsg('Please select an application')
      return
    }
    if (!roundName.trim()) {
      setErrorMsg('Round name is required')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          roundName,
          roundNumber: Number(roundNumber),
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          status,
          feedback: feedback.trim() || null,
        }),
      })

      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to schedule round')
      }

      setApplicationId('')
      setFeedback('')
      setScheduledAt('')
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating interview round'
      setErrorMsg(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Schedule Interview Round</h2>
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
              Select Job Application *
            </label>
            <select
              required
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">-- Choose Company --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Round Name *</label>
              <input
                type="text"
                required
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                placeholder="e.g. System Design / HR"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Round #</label>
              <input
                type="number"
                min={1}
                max={10}
                value={roundNumber}
                onChange={(e) => setRoundNumber(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="PASSED">PASSED</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Feedback / Notes</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Interviewer questions asked, key feedback, areas to revise..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-emerald-500"
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
              Save Round
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
