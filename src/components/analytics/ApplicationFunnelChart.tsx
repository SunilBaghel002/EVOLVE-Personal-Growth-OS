'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { Briefcase, CheckCircle2, ArrowRight } from 'lucide-react'

export interface FunnelStageItem {
  stage: string
  count: number
  fill: string
}

interface ApplicationFunnelChartProps {
  data: FunnelStageItem[]
  totalApplications: number
}

interface TooltipPayloadItem {
  payload: FunnelStageItem
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-white flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
          {item.stage} Stage
        </p>
        <p className="text-slate-300 font-mono font-bold">
          {item.count} applications
        </p>
      </div>
    )
  }
  return null
}

export function ApplicationFunnelChart({ data, totalApplications }: ApplicationFunnelChartProps) {
  // Main funnel progression stages: Saved, Applied, OA, Interview, Offer
  const mainStages = data.filter((d) => ['Saved', 'Applied', 'OA Stage', 'Interviews', 'Offers'].includes(d.stage))

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>Job Application Pipeline Funnel</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Conversion stages across active job applications
          </p>
        </div>
        <div className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-neutral-700">
          Total Apps Logged: {totalApplications}
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis dataKey="stage" stroke="#64748B" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`funnel-cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Funnel Flow Chips */}
      <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {mainStages.map((stage, idx) => (
          <div key={stage.stage} className="flex items-center gap-1.5">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.fill }} />
              <span className="font-semibold text-slate-700 dark:text-neutral-300">{stage.stage}:</span>
              <span className="font-black text-slate-900 dark:text-white">{stage.count}</span>
            </div>
            {idx < mainStages.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-neutral-600 hidden sm:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
