'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Briefcase, Clock, Trophy, UserCheck, RefreshCw } from 'lucide-react'
import { ApplicationTable } from '@/components/applications/ApplicationTable'
import { ApplicationModal } from '@/components/applications/ApplicationModal'
import { DeleteConfirmModal } from '@/components/applications/DeleteConfirmModal'
import { APPLICATION_STATUSES } from '@/lib/constants'
import type { JobApplication, ApplicationStatus } from '@/types'
import type { CreateApplicationInput } from '@/lib/validations/application'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirm modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedStatus && selectedStatus !== 'ALL') params.append('status', selectedStatus)

      const res = await fetch(`/api/applications?${params.toString()}`)
      const result = await res.json()

      if (result.success) {
        setApplications(result.data)
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setLoading(false)
    }
  }, [search, selectedStatus])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleOpenAddModal = () => {
    setEditingApp(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (app: JobApplication) => {
    setEditingApp(app)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (app: JobApplication) => {
    setDeletingApp(app)
    setIsDeleteModalOpen(true)
  }

  const handleSubmitModal = async (formData: CreateApplicationInput) => {
    setIsSubmitting(true)
    try {
      const url = editingApp ? `/api/applications/${editingApp.id}` : '/api/applications'
      const method = editingApp ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (result.success) {
        setIsModalOpen(false)
        fetchApplications()
      }
    } catch (err) {
      console.error('Failed to save application:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      )

      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (err) {
      console.error('Failed to update status:', err)
      fetchApplications()
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingApp) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/applications/${deletingApp.id}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        setIsDeleteModalOpen(false)
        setDeletingApp(null)
        fetchApplications()
      }
    } catch (err) {
      console.error('Failed to delete application:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Metrics
  const totalApps = applications.length
  const pendingApps = applications.filter((a) => a.status === 'APPLIED' || a.status === 'SAVED').length
  const interviewApps = applications.filter(
    (a) => a.status === 'INTERVIEW_SCHEDULED' || a.status === 'INTERVIEW_COMPLETED' || a.status === 'OA_RECEIVED' || a.status === 'OA_COMPLETED'
  ).length
  const offerApps = applications.filter((a) => a.status === 'OFFER_RECEIVED' || a.status === 'ACCEPTED').length
  const referralApps = applications.filter((a) => a.usedReferral).length

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Job Application Pipeline</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            End-to-end management from application submission to interview rounds and offers.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all self-start sm:self-auto shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total</span>
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{totalApps}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{pendingApps}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Interview/OA</span>
            <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{interviewApps}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Offered</span>
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{offerApps}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 col-span-2 sm:col-span-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Referrals</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{referralApps}</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, role, or location..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 dark:text-neutral-500 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-xs"
          >
            <option value="ALL">All Statuses</option>
            {APPLICATION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 animate-pulse">Loading job applications...</p>
        </div>
      ) : (
        <ApplicationTable
          applications={applications}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {/* Modals */}
      <ApplicationModal
        isOpen={isModalOpen}
        initialData={editingApp}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        companyName={deletingApp?.companyName || ''}
        role={deletingApp?.role || ''}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
