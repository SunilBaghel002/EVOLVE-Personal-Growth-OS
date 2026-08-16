'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Clock, Flame } from 'lucide-react'
import { ChallengeBanner } from '@/components/dashboard/ChallengeBanner'
import { SpacedRepetitionWidget } from '@/components/dashboard/SpacedRepetitionWidget'
import { RecentApplicationsWidget } from '@/components/dashboard/RecentApplicationsWidget'
import { MernTopicWidget } from '@/components/dashboard/MernTopicWidget'
import { UpcomingInterviewsWidget } from '@/components/dashboard/UpcomingInterviewsWidget'
import { ApplicationModal } from '@/components/applications/ApplicationModal'
import { DSAModal } from '@/components/dsa/DSAModal'
import type { JobApplication, DSAProblemEntry, MERNTopicEntry } from '@/types'
import type { CreateApplicationInput } from '@/lib/validations/application'
import type { CreateDSAProblemInput } from '@/lib/validations/dsa'

interface DashboardData {
  challenge: {
    dayNumber: number
    achievedHours: number
    targetHours: number
    achievedApps: number
    targetApps: number
    achievedDSA: number
    targetDSA: number
  }
  dueDSAProblems: DSAProblemEntry[]
  mernTopicOfDay: MERNTopicEntry | null
  recentApplications: JobApplication[]
  upcomingInterviews: JobApplication[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quick Action Modal States
  const [isAppModalOpen, setIsAppModalOpen] = useState(false)
  const [isSubmittingApp, setIsSubmittingApp] = useState(false)

  const [isDSAModalOpen, setIsDSAModalOpen] = useState(false)
  const [isSubmittingDSA, setIsSubmittingDSA] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard')
      const result = await res.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error?.message || 'Failed to load dashboard data')
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to connect to dashboard server')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleMarkDSARevised = async (id: string, confidence: number) => {
    try {
      await fetch(`/api/dsa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRevised: true, confidence }),
      })
      fetchDashboardData()
    } catch (err) {
      console.error('Failed to mark DSA revised:', err)
    }
  }

  const handleSubmitApp = async (formData: CreateApplicationInput) => {
    setIsSubmittingApp(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (result.success) {
        setIsAppModalOpen(false)
        fetchDashboardData()
      }
    } catch (err) {
      console.error('Failed to save application:', err)
    } finally {
      setIsSubmittingApp(false)
    }
  }

  const handleSubmitDSA = async (formData: CreateDSAProblemInput) => {
    setIsSubmittingDSA(true)
    try {
      const res = await fetch('/api/dsa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (result.success) {
        setIsDSAModalOpen(false)
        fetchDashboardData()
      }
    } catch (err) {
      console.error('Failed to log DSA problem:', err)
    } finally {
      setIsSubmittingDSA(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Welcome Back, Sunil</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Sprint Control Center • Track your 11-hour daily target, job applications, and DSA revision.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/logs"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 text-xs font-bold transition-all shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Log Study Hours</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAppModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Add Application</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDSAModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log DSA Problem</span>
          </button>
        </div>
      </div>

      {/* Main Content & Banner rendering */}
      {loading ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center animate-pulse shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400">Loading sprint metrics...</p>
        </div>
      ) : error && !data ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center space-y-3 shadow-sm">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      ) : data ? (
        <>
          <ChallengeBanner
            dayNumber={data.challenge.dayNumber}
            achievedHours={data.challenge.achievedHours}
            targetHours={data.challenge.targetHours}
            achievedApps={data.challenge.achievedApps}
            targetApps={data.challenge.targetApps}
            achievedDSA={data.challenge.achievedDSA}
            targetDSA={data.challenge.targetDSA}
          />

          {/* Main Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <SpacedRepetitionWidget
                dueProblems={data.dueDSAProblems}
                onMarkRevised={handleMarkDSARevised}
              />

              <RecentApplicationsWidget
                applications={data.recentApplications}
              />
            </div>

            {/* Right Column (1 Col) */}
            <div className="space-y-6">
              <MernTopicWidget
                topic={data.mernTopicOfDay}
              />

              <UpcomingInterviewsWidget
                interviews={data.upcomingInterviews}
              />
            </div>
          </div>
        </>
      ) : null}

      {/* Quick Action Modals */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        isSubmitting={isSubmittingApp}
        onClose={() => setIsAppModalOpen(false)}
        onSubmit={handleSubmitApp}
      />

      <DSAModal
        isOpen={isDSAModalOpen}
        isSubmitting={isSubmittingDSA}
        onClose={() => setIsDSAModalOpen(false)}
        onSubmit={handleSubmitDSA}
      />
    </div>
  )
}
