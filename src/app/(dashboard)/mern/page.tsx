'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BookOpenCheck, Search } from 'lucide-react'
import { MERNTopicCard } from '@/components/mern/MERNTopicCard'
import { MERNCategoryProgress } from '@/components/mern/MERNCategoryProgress'
import type { MERNTopicEntry } from '@/types'

interface MERNData {
  topics: MERNTopicEntry[]
  allTopics: MERNTopicEntry[]
  totalCount: number
  completedCount: number
  overallProgressPercent: number
  categoryStats: Array<{ category: string; total: number; completed: number; percent: number }>
}

export default function MERNPage() {
  const [data, setData] = useState<MERNData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const requestIdRef = useRef(0)

  const fetchMERNData = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory && selectedCategory !== 'ALL') params.append('category', selectedCategory)

      const res = await fetch(`/api/mern?${params.toString()}`)
      const result = await res.json()

      if (currentRequestId !== requestIdRef.current) return

      if (result.success) {
        setData(result.data)
      }
    } catch (err) {
      console.error('Failed to fetch MERN topics:', err)
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [search, selectedCategory])

  useEffect(() => {
    fetchMERNData()
  }, [fetchMERNData])

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      // Optimistic update
      if (data) {
        setData({
          ...data,
          topics: data.topics.map((t) => (t.id === id ? { ...t, completed } : t)),
          allTopics: data.allTopics.map((t) => (t.id === id ? { ...t, completed } : t)),
        })
      }

      await fetch(`/api/mern/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      fetchMERNData()
    } catch (err) {
      console.error('Failed to update topic status:', err)
      fetchMERNData()
    }
  }

  const handleUpdateConfidence = async (id: string, confidence: number) => {
    try {
      // Optimistic update
      if (data) {
        setData({
          ...data,
          topics: data.topics.map((t) => (t.id === id ? { ...t, confidence } : t)),
        })
      }

      await fetch(`/api/mern/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confidence }),
      })
    } catch (err) {
      console.error('Failed to update confidence level:', err)
      fetchMERNData()
    }
  }

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      await fetch(`/api/mern/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      fetchMERNData()
    } catch (err) {
      console.error('Failed to save notes:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">MERN Revision Checklist</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Systematic revision tracking across 21 core topics in MongoDB, Express, React, and Node.js.
          </p>
        </div>

        {/* Overall Completion Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs self-start sm:self-auto">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {data?.completedCount || 0} / {data?.totalCount || 21} Completed
              </span>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                ({data?.overallProgressPercent || 0}%)
              </span>
            </div>
            <div className="w-36 h-1.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${data?.overallProgressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Category Cards Row */}
      {data?.categoryStats && (
        <MERNCategoryProgress
          stats={data.categoryStats}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MERN topics, concepts, or your revision notes..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 font-medium transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'MongoDB', 'Express', 'React', 'Node'].map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all shadow-xs ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                    : 'bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Topic List */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 animate-pulse">Loading MERN topics...</p>
        </div>
      ) : data?.topics.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-sm">
          <p className="text-sm font-bold text-slate-900 dark:text-white">No MERN topics match your search</p>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Try adjusting your category filter or query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {data?.topics.map((topic) => (
            <MERNTopicCard
              key={topic.id}
              topic={topic}
              onToggleComplete={handleToggleComplete}
              onUpdateConfidence={handleUpdateConfidence}
              onSaveNotes={handleSaveNotes}
            />
          ))}
        </div>
      )}
    </div>
  )
}
