'use client'

import { DSA_TOPICS } from '@/lib/constants'
import type { DSAProblemEntry } from '@/types'

interface TopicHeatmapProps {
  problems: DSAProblemEntry[]
  onSelectTopic?: (topic: string) => void
  selectedTopic?: string
}

export function TopicHeatmap({
  problems,
  onSelectTopic,
  selectedTopic = 'ALL',
}: TopicHeatmapProps) {
  // Count problems per topic
  const topicCounts: Record<string, number> = {}
  DSA_TOPICS.forEach((t) => {
    topicCounts[t] = 0
  })

  problems.forEach((p) => {
    if (topicCounts[p.topic] !== undefined) {
      topicCounts[p.topic] += 1
    } else {
      topicCounts[p.topic] = 1
    }
  })

  const maxCount = Math.max(...Object.values(topicCounts), 1)

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Topic Coverage & Progress</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Distribution of solved problems across DSA learning topics</p>
        </div>
        {selectedTopic !== 'ALL' && (
          <button
            type="button"
            onClick={() => onSelectTopic && onSelectTopic('ALL')}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
          >
            Clear topic filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {DSA_TOPICS.map((topic) => {
          const count = topicCounts[topic] || 0
          const percentage = Math.min(100, Math.round((count / maxCount) * 100))
          const isSelected = selectedTopic === topic

          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelectTopic && onSelectTopic(isSelected ? 'ALL' : topic)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-emerald-50/80 dark:bg-neutral-800 border-emerald-500 shadow-sm'
                  : 'bg-slate-50/80 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800/80 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Background progress fill */}
              <div
                className="absolute bottom-0 left-0 top-0 bg-emerald-500/10 transition-all pointer-events-none"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-200 truncate group-hover:text-emerald-700 dark:group-hover:text-white">
                  {topic}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{count} solved</span>
                  {count === 0 && (
                    <span className="text-[10px] text-slate-400 dark:text-neutral-600 font-semibold">Needs focus</span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
