'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, MessageSquareCode, Calendar, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react'
import { InterviewQuestionFormModal } from '@/components/interviews/InterviewQuestionFormModal'
import { InterviewRoundFormModal } from '@/components/interviews/InterviewRoundFormModal'
import { DifficultyBadge } from '@/components/dsa/DifficultyBadge'

interface InterviewQuestionItem {
  id: string
  question: string
  category: string
  difficulty: string
  answer?: string | null
  createdAt: string
  application?: {
    companyName: string
    role: string
  } | null
}

interface InterviewRoundItem {
  id: string
  roundName: string
  roundNumber: number
  scheduledAt?: string | null
  completedAt?: string | null
  status: string
  feedback?: string | null
  application: {
    companyName: string
    role: string
  }
}

interface ApplicationOption {
  id: string
  companyName: string
  role: string
}

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'rounds'>('questions')
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([])
  const [rounds, setRounds] = useState<InterviewRoundItem[]>([])
  const [applications, setApplications] = useState<ApplicationOption[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState('ALL')

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [qRes, rRes, appRes] = await Promise.all([
        fetch(`/api/questions?search=${encodeURIComponent(search)}&category=${categoryFilter}&difficulty=${difficultyFilter}`),
        fetch('/api/interviews'),
        fetch('/api/applications'),
      ])

      const qData = await qRes.json()
      const rData = await rRes.json()
      const appData = await appRes.json()

      if (qData.success) setQuestions(qData.data)
      if (rData.success) setRounds(rData.data)
      if (appData.success) setApplications(appData.data)
    } catch (err) {
      console.error('Failed to load interview data:', err)
    } finally {
      setLoading(false)
    }
  }, [search, categoryFilter, difficultyFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error('Failed to delete question:', err)
    }
  }

  const handleDeleteRound = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview round?')) return
    try {
      const res = await fetch(`/api/interviews/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error('Failed to delete interview round:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5 text-emerald-400" />
            Interview Question Bank & Rounds
          </h1>
          <p className="text-xs text-neutral-400">
            Log technical questions, company specific preparation notes, and scheduled interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsQuestionModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
          <button
            onClick={() => setIsRoundModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-neutral-700"
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            Schedule Round
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquareCode className="w-4 h-4" />
          Question Bank ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('rounds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rounds'
              ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Interview Rounds ({rounds.length})
        </button>
      </div>

      {/* Question Bank Tab Content */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              <option value="DSA">DSA</option>
              <option value="System Design">System Design</option>
              <option value="React/MERN">React/MERN</option>
              <option value="Tech">Tech / JS Core</option>
              <option value="Behavioral">Behavioral</option>
              <option value="CS Core">CS Core</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* List */}
          {loading ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-2">
              <MessageSquareCode className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs font-semibold text-white">No interview questions found</p>
              <p className="text-[11px] text-neutral-400">Log questions asked in past interviews or practice sessions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                          {q.category}
                        </span>
                        <DifficultyBadge difficulty={q.difficulty as 'EASY' | 'MEDIUM' | 'HARD'} />
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-snug">{q.question}</h3>

                    {q.application && (
                      <p className="text-[11px] text-sky-400 font-medium">
                        Asked at: {q.application.companyName} ({q.application.role})
                      </p>
                    )}

                    {q.answer && (
                      <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed">
                        <span className="font-semibold text-neutral-400 block text-[10px] uppercase mb-0.5">Model Answer / Key Points:</span>
                        {q.answer}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-neutral-500 font-medium pt-2 border-t border-neutral-800/50">
                    Added: {new Date(q.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interview Rounds Tab Content */}
      {activeTab === 'rounds' && (
        <div>
          {loading ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading interview rounds...</div>
          ) : rounds.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-2">
              <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs font-semibold text-white">No interview rounds scheduled yet</p>
              <p className="text-[11px] text-neutral-400">Add round details when companies reach out for screenings or technical interviews.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rounds.map((r) => {
                let StatusIcon = Clock
                let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                if (r.status === 'PASSED') {
                  StatusIcon = CheckCircle2
                  statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                } else if (r.status === 'FAILED') {
                  StatusIcon = AlertCircle
                  statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }

                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          {r.application.companyName} — Round {r.roundNumber}: {r.roundName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusColor} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">Role: {r.application.role}</p>
                      {r.scheduledAt && (
                        <p className="text-[11px] text-sky-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Scheduled: {new Date(r.scheduledAt).toLocaleString()}
                        </p>
                      )}
                      {r.feedback && (
                        <p className="text-xs text-neutral-300 italic pt-1">
                          &quot;{r.feedback}&quot;
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteRound(r.id)}
                      className="text-neutral-500 hover:text-rose-400 p-2 rounded-lg hover:bg-neutral-800 transition-colors shrink-0 self-end sm:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <InterviewQuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSuccess={fetchData}
        applications={applications}
      />
      <InterviewRoundFormModal
        isOpen={isRoundModalOpen}
        onClose={() => setIsRoundModalOpen(false)}
        onSuccess={fetchData}
        applications={applications}
      />
    </div>
  )
}
