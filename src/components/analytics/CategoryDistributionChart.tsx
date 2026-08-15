'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

export interface CategoryDistributionItem {
  name: string
  hours: number
  color: string
  percentage: number
}

interface CategoryDistributionChartProps {
  data: CategoryDistributionItem[]
  totalHours: number
}

interface TooltipPayloadItem {
  name: string
  value: number
  payload: CategoryDistributionItem
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
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}
        </p>
        <div className="text-slate-300 font-mono">
          <span>{item.hours} hrs</span> ({item.percentage}%)
        </div>
      </div>
    )
  }
  return null
}

export function CategoryDistributionChart({ data, totalHours }: CategoryDistributionChartProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊 Study Category Distribution</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400">
          Proportional time spent across study focus areas
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Pie Chart */}
        <div className="w-44 h-44 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={4}
                dataKey="hours"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{totalHours.toFixed(1)}h</span>
          </div>
        </div>

        {/* Category Legend & Breakdown */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-700 dark:text-neutral-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-black text-slate-900 dark:text-white">{item.hours}h</span>
                <span className="text-slate-400 dark:text-neutral-500 font-bold">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
