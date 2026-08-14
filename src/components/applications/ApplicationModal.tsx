'use client'

import { useState, useEffect } from 'react'
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
  }, [initialData, isOpen])

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
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Razorpay, Google, CRED"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {errors.companyName && (
                <p className="text-[11px] text-red-400 mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Role Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. SDE-1, Full Stack Developer"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {errors.role && (
                <p className="text-[11px] text-red-400 mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Platform */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
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
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Applied Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Applied Date</label>
              <input
                type="date"
                value={formData.appliedDate || ''}
                onChange={(e) => handleChange('appliedDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Follow Up Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) => handleChange('followUpDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job URL */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                <span>Job Link / URL</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </label>
              <input
                type="text"
                placeholder="https://company.com/careers/job"
                value={formData.jobUrl || ''}
                onChange={(e) => handleChange('jobUrl', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {errors.jobUrl && (
                <p className="text-[11px] text-red-400 mt-1">{errors.jobUrl}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Remote, Gurgaon, Bangalore"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Person */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Contact / Recruiter Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson (HR Lead)"
                value={formData.contactPerson || ''}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {errors.contactEmail && (
                <p className="text-[11px] text-red-400 mt-1">{errors.contactEmail}</p>
              )}
            </div>
          </div>

          {/* Referral Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="usedReferral"
              checked={!!formData.usedReferral}
              onChange={(e) => handleChange('usedReferral', e.target.checked)}
              className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900 cursor-pointer"
            />
            <label htmlFor="usedReferral" className="text-xs font-medium text-neutral-300 cursor-pointer">
              Applied using employee referral (5-10x higher impact)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Notes & Follow-up Details</label>
            <textarea
              rows={3}
              placeholder="e.g. Referred by Rahul from LinkedIn. Tech stack: Next.js + Node."
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
                <span>{initialData ? 'Update Application' : 'Save Application'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
