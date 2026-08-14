'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Loader2, ExternalLink } from 'lucide-react'
import { createApplicationSchema, type CreateApplicationInput } from '@/lib/validations/application'
import { APPLICATION_STATUSES, APPLICATION_PLATFORMS } from '@/lib/constants'
import type { JobApplication } from '@/types'

interface ApplicationModalProps {
  isOpen: boolean
  initialData?: JobApplication | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: CreateApplicationInput) => void
}

export function ApplicationModal({
  isOpen,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CreateApplicationInput>({
    companyName: '',
    role: '',
    platform: 'LinkedIn',
    status: 'APPLIED',
    jobUrl: '',
    location: '',
    salaryRange: '',
    contactPerson: '',
    contactEmail: '',
    usedReferral: false,
    appliedDate: new Date().toISOString().split('T')[0],
    followUpDate: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) return

    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        role: initialData.role || '',
        platform: initialData.platform || 'LinkedIn',
        status: initialData.status || 'APPLIED',
        jobUrl: initialData.jobUrl || '',
        location: initialData.location || '',
        salaryRange: initialData.salaryRange || '',
        contactPerson: initialData.contactPerson || '',
        contactEmail: initialData.contactEmail || '',
        usedReferral: !!initialData.usedReferral,
        appliedDate: initialData.appliedDate
          ? new Date(initialData.appliedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        followUpDate: initialData.followUpDate
          ? new Date(initialData.followUpDate).toISOString().split('T')[0]
          : '',
        notes: initialData.notes || '',
      })
    } else {
      setFormData({
        companyName: '',
        role: '',
        platform: 'LinkedIn',
        status: 'APPLIED',
        jobUrl: '',
        location: '',
        salaryRange: '',
        contactPerson: '',
        contactEmail: '',
        usedReferral: false,
        appliedDate: new Date().toISOString().split('T')[0],
        followUpDate: '',
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

  const handleChange = (field: keyof CreateApplicationInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const result = createApplicationSchema.safeParse(formData)

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
        aria-labelledby="app-modal-title"
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-800">
          <div>
            <h2 id="app-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Application' : 'Add New Application'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              {initialData ? 'Update application details and pipeline status' : 'Track a new job opportunity in your pipeline'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="companyName-input"
                ref={firstInputRef}
                type="text"
                placeholder="e.g. Razorpay, Google, CRED"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
              />
              {errors.companyName && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Role Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="role-input"
                type="text"
                placeholder="e.g. SDE-1, Full Stack Developer"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
              />
              {errors.role && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Platform */}
            <div>
              <label htmlFor="platform-select" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Platform</label>
              <select
                id="platform-select"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all cursor-pointer shadow-xs"
              >
                {APPLICATION_PLATFORMS.map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status-select" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Status</label>
              <select
                id="status-select"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all cursor-pointer shadow-xs"
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label htmlFor="jobUrl-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
              <span>Job Posting URL</span>
              {formData.jobUrl && (
                <a
                  href={formData.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link
                </a>
              )}
            </label>
            <input
              id="jobUrl-input"
              type="url"
              placeholder="https://linkedin.com/jobs/view/..."
              value={formData.jobUrl || ''}
              onChange={(e) => handleChange('jobUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
            />
            {errors.jobUrl && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.jobUrl}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label htmlFor="location-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Location</label>
              <input
                id="location-input"
                type="text"
                placeholder="e.g. Remote, Bengaluru, Hybrid"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label htmlFor="salaryRange-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Salary Range / CTC</label>
              <input
                id="salaryRange-input"
                type="text"
                placeholder="e.g. ₹12L - ₹18L"
                value={formData.salaryRange || ''}
                onChange={(e) => handleChange('salaryRange', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Applied Date */}
            <div>
              <label htmlFor="appliedDate-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Applied Date</label>
              <input
                id="appliedDate-input"
                type="date"
                value={formData.appliedDate}
                onChange={(e) => handleChange('appliedDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all shadow-xs"
              />
            </div>

            {/* Follow Up Date */}
            <div>
              <label htmlFor="followUpDate-input" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Follow-Up Date</label>
              <input
                id="followUpDate-input"
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) => handleChange('followUpDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Used Referral Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="referral"
              type="checkbox"
              checked={formData.usedReferral}
              onChange={(e) => handleChange('usedReferral', e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 border-slate-300 dark:border-neutral-700 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="referral" className="text-xs font-bold text-slate-800 dark:text-neutral-200 cursor-pointer">
              Used Employee Referral for this application
            </label>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes-textarea" className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Notes / HR Contacts</label>
            <textarea
              id="notes-textarea"
              rows={3}
              placeholder="e.g. Referred by Rahul via LinkedIn. Round 1 OA cleared on Tuesday."
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
                <span>{initialData ? 'Update Application' : 'Save Application'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
