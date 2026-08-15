'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Globe, Award } from 'lucide-react'

export interface PlatformEffectivenessItem {
  platform: string
  totalApps: number
  positiveResponses: number
  conversionRate: number
}

interface PlatformEffectivenessChartProps {
  data: PlatformEffectivenessItem[]
}

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl text-xs space-y-1.5">
        <p className="font-bold text-white mb-1 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          {label} Platform
        </p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function PlatformEffectivenessChart({ data }: PlatformEffectivenessChartProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Platform Effectiveness</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Applications sent vs interview/OA responses by platform
          </p>
        </div>
      </div>

      <div className="w-full h-60 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis dataKey="platform" stroke="#64748B" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              formatter={(value: string | number | React.ReactNode) => <span className="text-slate-700 dark:text-neutral-300 font-semibold">{value}</span>}
            />
            <Bar dataKey="totalApps" name="Total Applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="positiveResponses" name="OA / Interview Calls" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Conversion Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
        {data.slice(0, 4).map((item) => (
          <div key={item.platform} className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-100 dark:border-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 dark:text-neutral-300 truncate">{item.platform}</span>
              <Award className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-black text-slate-900 dark:text-white">{item.conversionRate}%</span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-500">{item.positiveResponses}/{item.totalApps} resp</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
