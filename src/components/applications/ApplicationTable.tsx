'use client'

import { ExternalLink, Edit2, Trash2, Tag, Calendar, UserCheck } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { APPLICATION_STATUSES } from '@/lib/constants'
import type { JobApplication, ApplicationStatus } from '@/types'

interface ApplicationTableProps {
  applications: JobApplication[]
  onEdit: (app: JobApplication) => void
  onDelete: (app: JobApplication) => void
  onQuickStatusChange: (id: string, newStatus: ApplicationStatus) => void
}

export function ApplicationTable({
  applications,
  onEdit,
  onDelete,
  onQuickStatusChange,
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-sm">
        <p className="text-sm font-bold text-slate-900 dark:text-white">No applications match your criteria</p>
        <p className="text-xs text-slate-500 dark:text-neutral-400">Try adjusting your search query or status filter.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-neutral-800 sticky top-0">
          <tr>
            <th className="px-4 py-3.5 font-bold">Company & Role</th>
            <th className="px-4 py-3.5 font-bold">Platform</th>
            <th className="px-4 py-3.5 font-bold">Applied Date</th>
            <th className="px-4 py-3.5 font-bold">Status</th>
            <th className="px-4 py-3.5 font-bold">Referral</th>
            <th className="px-4 py-3.5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-800/80">
          {applications.map((app) => {
            const formattedDate = new Date(app.appliedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            return (
              <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors group">
                {/* Company & Role */}
                <td className="px-4 py-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {app.companyName}
                      </span>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 dark:text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Open job link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-slate-500 dark:text-neutral-400 flex items-center gap-2 text-xs font-medium">
                      <span>{app.role}</span>
                      {app.location && (
                        <>
                          <span className="text-slate-300 dark:text-neutral-600">•</span>
                          <span className="text-slate-400 dark:text-neutral-500">{app.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 text-slate-700 dark:text-neutral-300 font-semibold bg-slate-100 dark:bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-neutral-700/50">
                    <Tag className="w-3 h-3 text-slate-400 dark:text-neutral-400" />
                    <span>{app.platform}</span>
                  </span>
                </td>

                {/* Applied Date */}
                <td className="px-4 py-3.5 text-slate-600 dark:text-neutral-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                    <select
                      value={app.status}
                      aria-label="Change application status"
                      onChange={(e) => onQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-neutral-300 text-[11px] font-semibold rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-sm"
                    >
                      {APPLICATION_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                {/* Referral */}
                <td className="px-4 py-3.5">
                  {app.usedReferral ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold border border-emerald-500/20">
                      <UserCheck className="w-3 h-3" />
                      <span>Referred</span>
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-neutral-600 text-[11px]">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(app)}
                      className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Edit application"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(app)}
                      className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-red-400 hover:bg-rose-500/10 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
