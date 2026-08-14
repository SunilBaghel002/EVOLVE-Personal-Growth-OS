'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Video } from 'lucide-react'
import { StatusBadge } from '@/components/applications/StatusBadge'
import type { JobApplication } from '@/types'

interface UpcomingInterviewsWidgetProps {
  interviews: JobApplication[]
}

export function UpcomingInterviewsWidget({ interviews }: UpcomingInterviewsWidgetProps) {
  if (interviews.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Interviews & OAs</h3>
          </div>
          <Link href="/applications" className="text-xs text-slate-500 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors">
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200/80 dark:border-neutral-800/80">
          <p className="text-xs text-slate-500 dark:text-neutral-400">No active interviews or OA assessments right now.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Interviews & OAs ({interviews.length})</h3>
        </div>
        <Link href="/applications" className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
          <span>Pipeline</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {interviews.map((app) => (
          <div
            key={app.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">{app.companyName}</span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">{app.role}</span>
            </div>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
