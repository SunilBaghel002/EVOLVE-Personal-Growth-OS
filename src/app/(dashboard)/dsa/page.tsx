'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Search, Filter, Brain, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import { DSATable } from '@/components/dsa/DSATable'
import { DSAModal } from '@/components/dsa/DSAModal'
import { DSADeleteModal } from '@/components/dsa/DSADeleteModal'
import { TopicHeatmap } from '@/components/dsa/TopicHeatmap'
import { DSA_TOPICS, DSA_DIFFICULTIES } from '@/lib/constants'
import { isDueForRevision } from '@/lib/utils/dsa'
import type { DSAProblemEntry } from '@/types'
import type { CreateDSAProblemInput } from '@/lib/validations/dsa'

export default function DSAPage() {
  // All problems state for metrics & topic heatmap
  const [allProblems, setAllProblems] = useState<DSAProblemEntry[]>([])
  // Filtered problems for table display
  const [filteredProblems, setFilteredProblems] = useState<DSAProblemEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [dueOnly, setDueOnly] = useState(false)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<DSAProblemEntry | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingProblem, setDeletingProblem] = useState<DSAProblemEntry | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Request race condition guard
  const requestIdRef = useRef(0)

  const fetchProblems = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current
    setLoading(true)
    try {
      // 1. Fetch unfiltered problems for overall metrics and heatmap
      const allRes = await fetch('/api/dsa')
      const allResult = await allRes.json()

      // 2. Fetch filtered problems for the data table
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedTopic && selectedTopic !== 'ALL') params.append('topic', selectedTopic)
      if (selectedDifficulty && selectedDifficulty !== 'ALL') params.append('difficulty', selectedDifficulty)
      if (dueOnly) params.append('dueOnly', 'true')

      const filteredRes = await fetch(`/api/dsa?${params.toString()}`)
      const filteredResult = await filteredRes.json()

      // Check if another request started after this one
      if (currentRequestId !== requestIdRef.current) return

      if (allResult.success) {
        setAllProblems(allResult.data)
      }

      if (filteredResult.success) {
        setFilteredProblems(filteredResult.data)
      }
    } catch (err) {
      console.error('Failed to fetch DSA problems:', err)
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [search, selectedTopic, selectedDifficulty, dueOnly])

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const handleOpenAddModal = () => {
    setEditingProblem(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (problem: DSAProblemEntry) => {
    setEditingProblem(problem)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (problem: DSAProblemEntry) => {
    setDeletingProblem(problem)
    setIsDeleteModalOpen(true)
  }

  const handleSubmitModal = async (formData: CreateDSAProblemInput) => {
    setIsSubmitting(true)
    try {
      const url = editingProblem ? `/api/dsa/${editingProblem.id}` : '/api/dsa'
      const method = editingProblem ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (result.success) {
        setIsModalOpen(false)
        fetchProblems()
      }
    } catch (err) {
      console.error('Failed to save DSA problem:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkRevised = async (id: string, confidence: number) => {
    try {
      // Optimistic update
      setFilteredProblems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, confidence } : p))
      )

      await fetch(`/api/dsa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRevised: true, confidence }),
      })
      fetchProblems()
    } catch (err) {
      console.error('Failed to mark problem revised:', err)
      fetchProblems()
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingProblem) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/dsa/${deletingProblem.id}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        setIsDeleteModalOpen(false)
        setDeletingProblem(null)
        fetchProblems()
      }
    } catch (err) {
      console.error('Failed to delete DSA problem:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Unfiltered Metrics
  const totalSolved = allProblems.length
  const easyCount = allProblems.filter((p) => p.difficulty === 'EASY').length
  const mediumCount = allProblems.filter((p) => p.difficulty === 'MEDIUM').length
  const hardCount = allProblems.filter((p) => p.difficulty === 'HARD').length
  const dueCount = allProblems.filter((p) => isDueForRevision(p.nextRevisionDate)).length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">DSA Problem Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Log solved problems, track topic heatmaps, and automate spaced repetition revision.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all self-start sm:self-auto shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Log Problem</span>
        </button>
      </div>

      {/* Metrics Row (Unfiltered Overall Progress) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Solved</span>
            <Brain className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{totalSolved}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Easy</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{easyCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Medium</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">{mediumCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Hard</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-xl font-black text-rose-600 dark:text-red-400">{hardCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-1 col-span-2 sm:col-span-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Due Revision</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">{dueCount}</p>
        </div>
      </div>

      {/* Spaced Repetition Due Alert Banner */}
      {dueCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Spaced Repetition Alert</h3>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/80 font-medium">
                You have {dueCount} problem{dueCount > 1 ? 's' : ''} scheduled for revision today based on past confidence ratings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDueOnly(!dueOnly)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all self-start sm:self-auto whitespace-nowrap shadow-xs"
          >
            {dueOnly ? 'Show All Problems' : 'View Due Problems'}
          </button>
        </div>
      )}

      {/* Topic Heatmap Overview (Renders using allProblems for accurate total topic distribution) */}
      <TopicHeatmap
        problems={allProblems}
        selectedTopic={selectedTopic}
        onSelectTopic={(t) => setSelectedTopic(t)}
      />

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problem title, platform, or notes..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-xs"
            >
              <option value="ALL">All Topics</option>
              {DSA_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-xs"
          >
            <option value="ALL">All Difficulties</option>
            {DSA_DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setDueOnly(!dueOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-xs ${
              dueOnly
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40'
                : 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Due Today</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 animate-pulse">Loading DSA problems...</p>
        </div>
      ) : (
        <DSATable
          problems={filteredProblems}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onMarkRevised={handleMarkRevised}
        />
      )}

      {/* Modals */}
      <DSAModal
        isOpen={isModalOpen}
        initialData={editingProblem}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
      />

      <DSADeleteModal
        isOpen={isDeleteModalOpen}
        title={deletingProblem?.title || ''}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
