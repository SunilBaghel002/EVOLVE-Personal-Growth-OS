'use client'

import Link from 'next/link'
import { Briefcase, ArrowRight, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { toLocalDateString } from '@/lib/utils/dsa'
import type { JobApplication } from '@/types'

interface RecentApplicationsWidgetProps {
  applications: JobApplication[]
}

export function RecentApplicationsWidget({ applications }: RecentApplicationsWidgetProps) {
  if (applications.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Recent Job Applications</h3>
          </div>
          <Link href="/applications" className="text-xs text-neutral-400 hover:text-blue-400 flex items-center gap-1 transition-colors">
            <span>View Pipeline</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 text-center rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <p className="text-xs text-neutral-400">No job applications submitted yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Recent Applications (Last 5)</h3>
        </div>
        <Link href="/applications" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold">
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">{app.companyName}</span>
                {app.jobUrl && (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="text-[11px] text-neutral-400">
                <span>{app.role}</span>
                <span className="mx-1.5">•</span>
                <span>{toLocalDateString(app.appliedDate)}</span>
              </div>
            </div>

            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
