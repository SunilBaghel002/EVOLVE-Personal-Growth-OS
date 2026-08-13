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
      <div className="p-12 text-center rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
        <p className="text-sm font-semibold text-white">No applications match your criteria</p>
        <p className="text-xs text-neutral-400">Try adjusting your search query or status filter.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800 sticky top-0">
          <tr>
            <th className="px-4 py-3 font.semibold">Company & Role</th>
            <th className="px-4 py-3 font-semibold">Platform</th>
            <th className="px-4 py-3 font-semibold">Applied Date</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Referral</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/80">
          {applications.map((app) => {
            const formattedDate = new Date(app.appliedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            return (
              <tr key={app.id} className="hover:bg-neutral-800/40 transition-colors group">
                {/* Company & Role */}
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {app.companyName}
                      </span>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-500 hover:text-blue-400 transition-colors"
                          title="Open job link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-neutral-400 flex items-center gap-2 text-xs">
                      <span>{app.role}</span>
                      {app.location && (
                        <>
                          <span className="text-neutral-600">•</span>
                          <span className="text-neutral-500">{app.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-neutral-300 font-medium bg-neutral-800/80 px-2 py-0.5 rounded border border-neutral-700/50">
                    <Tag className="w-3 h-3 text-neutral-400" />
                    <span>{app.platform}</span>
                  </span>
                </td>

                {/* Applied Date */}
                <td className="px-4 py-3 text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) => onQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                <td className="px-4 py-3">
                  {app.usedReferral ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-500/20">
                      <UserCheck className="w-3 h-3" />
                      <span>Referred</span>
                    </span>
                  ) : (
                    <span className="text-neutral-600 text-[11px]">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(app)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                      title="Edit application"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(app)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
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
