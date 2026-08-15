'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

export interface HoursTrendItem {
  dayNumber: number
  label: string
  date: string
  gateHours: number
  mernHours: number
  projectHours: number
  interviewHours: number
  totalHours: number
  targetHours: number
}

interface WeeklyHoursChartProps {
  data: HoursTrendItem[]
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
    const dataItem = payload[0]
    return (
      <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">{entry.value} hrs</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function WeeklyHoursChart({ data }: WeeklyHoursChartProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📈 Daily Study Hours Trend</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            21-Day logged study hours vs 11 hrs daily evolution benchmark
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Logged Hours
          </span>
          <span className="flex items-center gap-1.5 text-amber-500">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500" /> Target (11h)
          </span>
        </div>
      </div>

      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotalHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.3} />
            <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 16]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={11} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: '11h Goal', fill: '#F59E0B', fontSize: 10, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="totalHours"
              name="Total Study"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotalHours)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
