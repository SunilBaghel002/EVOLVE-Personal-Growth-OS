'use client'

import { Database, Server, Code, Cpu } from 'lucide-react'

interface CategoryStat {
  category: string
  total: number
  completed: number
  percent: number
}

interface MERNCategoryProgressProps {
  stats: CategoryStat[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function MERNCategoryProgress({
  stats,
  selectedCategory,
  onSelectCategory,
}: MERNCategoryProgressProps) {
  const categoryIconMap: Record<string, React.ReactNode> = {
    MongoDB: <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    Express: <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
    React: <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    Node: <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const isSelected = selectedCategory.toLowerCase() === stat.category.toLowerCase()

        return (
          <button
            key={stat.category}
            type="button"
            onClick={() => onSelectCategory(isSelected ? 'ALL' : stat.category)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 shadow-xs flex flex-col justify-between space-y-3 ${
              isSelected
                ? 'bg-slate-100 dark:bg-neutral-800 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-neutral-900/80 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                {categoryIconMap[stat.category]}
                <span>{stat.category}</span>
              </span>
              <span className="text-xs font-extrabold text-slate-500 dark:text-neutral-400">
                {stat.completed}/{stat.total}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-neutral-500">
                <span>{stat.percent}% done</span>
                {stat.percent === 100 && <span className="text-emerald-600 dark:text-emerald-400">Mastered</span>}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
