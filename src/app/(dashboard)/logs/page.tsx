'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, Flame, Dumbbell, Award, History, PenTool } from 'lucide-react'
import { LogForm } from '@/components/logs/LogForm'
import { LogHistoryTable } from '@/components/logs/LogHistoryTable'
import { LogDetailModal } from '@/components/logs/LogDetailModal'
import { getTodayLocalDateString, toLocalDateString } from '@/lib/utils/dsa'
import type { DailyLogEntry } from '@/types'
import type { DailyLogInput } from '@/lib/validations/log'

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form')
  const [logs, setLogs] = useState<DailyLogEntry[]>([])
  const [selectedLogForDate, setSelectedLogForDate] = useState<DailyLogEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Detail Modal state
  const [detailLog, setDetailLog] = useState<DailyLogEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Race condition ref
  const requestIdRef = useRef(0)

  const fetchLogs = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current
    setLoading(true)
    try {
      const res = await fetch('/api/logs')
      const result = await res.json()

      if (currentRequestId !== requestIdRef.current) return

      if (result.success) {
        setLogs(result.data)

        // Find log entry for today if exists
        const todayStr = getTodayLocalDateString()
        const todayEntry = result.data.find(
          (l: DailyLogEntry) => l.date && toLocalDateString(l.date) === todayStr
        )
        if (todayEntry) {
          setSelectedLogForDate(todayEntry)
        }
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleDateChangeInForm = async (dateStr: string) => {
    const existing = logs.find((l) => l.date && toLocalDateString(l.date) === dateStr)
    setSelectedLogForDate(existing || null)
  }

  const handleSubmitForm = async (formData: DailyLogInput) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (result.success) {
        fetchLogs()
      }
    } catch (err) {
      console.error('Failed to save daily log:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectLogForDetail = (log: DailyLogEntry) => {
    setDetailLog(log)
    setIsDetailModalOpen(true)
  }

  const handleEditLogFromHistory = (log: DailyLogEntry) => {
    setSelectedLogForDate(log)
    setActiveTab('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Metrics
  const totalLoggedDays = logs.length
  const totalHoursLogged = logs.reduce((acc, l) => acc + (l.totalHours || 0), 0)
  const avgHoursPerDay = totalLoggedDays > 0 ? (totalHoursLogged / totalLoggedDays).toFixed(1) : '0'
  const daysTargetMet = logs.filter((l) => (l.totalHours || 0) >= 11).length
  const totalWorkouts = logs.filter((l) => l.exerciseDone).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Daily Time & Habit Logger</h1>
          <p className="text-xs text-neutral-400">
            Log your daily 11-hour study breakdown across DSA, MERN, CS Core, and Projects.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'form'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Log Hours</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({totalLoggedDays})</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Avg Daily Study</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white">{avgHoursPerDay} hrs/day</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Target Met (11h+)</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400">{daysTargetMet} days</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Hours Logged</span>
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-purple-300">{totalHoursLogged.toFixed(1)} hrs</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Workouts Completed</span>
            <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-blue-400">{totalWorkouts} sessions</p>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'form' ? (
        <LogForm
          initialLog={selectedLogForDate}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitForm}
          onDateChange={handleDateChangeInForm}
        />
      ) : (
        <div>
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-neutral-900/60 border border-neutral-800">
              <p className="text-xs text-neutral-400 animate-pulse">Loading daily log history...</p>
            </div>
          ) : (
            <LogHistoryTable
              logs={logs}
              onSelectLog={handleSelectLogForDetail}
              onEditLog={handleEditLogFromHistory}
            />
          )}
        </div>
      )}

      {/* Detail Modal */}
      <LogDetailModal
        isOpen={isDetailModalOpen}
        log={detailLog}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  )
}
