'use client'

import { Brain, AlertCircle, CheckCircle2, Star } from 'lucide-react'

export interface DSATopicCoverageItem {
  topic: string
  totalSolved: number
  easy: number
  medium: number
  hard: number
  avgConfidence: number
}

interface DSATopicHeatmapProps {
  data: DSATopicCoverageItem[]
  totalSolved: number
}

export function DSATopicHeatmap({ data, totalSolved }: DSATopicHeatmapProps) {
  const maxTopicSolved = Math.max(...data.map((d) => d.totalSolved), 1)

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>DSA Topic Coverage & Practice Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Problem distribution, difficulty split, and confidence ratings per topic
          </p>
        </div>
        <div className="text-xs font-bold text-slate-900 dark:text-white bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-xl border border-purple-500/20 self-start sm:self-auto">
          {totalSolved} Problems Solved Total
        </div>
      </div>

      {/* Topics Coverage Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((item) => {
          const intensity = Math.min(100, Math.round((item.totalSolved / maxTopicSolved) * 100))
          const isZero = item.totalSolved === 0

          return (
            <div
              key={item.topic}
              className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                isZero
                  ? 'bg-slate-50/50 dark:bg-neutral-900/30 border-slate-200 dark:border-neutral-800/80'
                  : 'bg-white dark:bg-neutral-800/40 border-slate-200 dark:border-neutral-800 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {isZero ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  )}
                  {item.topic}
                </span>
                <span className={`text-xs font-black ${isZero ? 'text-slate-400' : 'text-purple-600 dark:text-purple-400'}`}>
                  {item.totalSolved} solved
                </span>
              </div>

              {/* Progress bar heatmap gauge */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isZero ? 'bg-slate-300 dark:bg-neutral-700' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.max(intensity, isZero ? 0 : 15)}%` }}
                />
              </div>

              {/* Difficulty & Confidence Details */}
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 font-semibold text-slate-500 dark:text-neutral-400">
                  <span className="text-emerald-600 dark:text-emerald-400">{item.easy}E</span>
                  <span>/</span>
                  <span className="text-amber-600 dark:text-amber-400">{item.medium}M</span>
                  <span>/</span>
                  <span className="text-rose-600 dark:text-rose-400">{item.hard}H</span>
                </div>

                <div className="flex items-center gap-1 font-bold text-slate-600 dark:text-neutral-300">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{item.avgConfidence > 0 ? `${item.avgConfidence}/5` : 'N/A'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
