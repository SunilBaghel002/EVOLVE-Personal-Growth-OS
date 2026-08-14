'use client'

import { Flame, Clock, Briefcase, Brain, Dumbbell } from 'lucide-react'

interface StreaksData {
  studyHoursStreak: number
  appsStreak: number
  dsaStreak: number
  exerciseStreak: number
}

interface StreakCardProps {
  streaks: StreaksData
}

export function StreakCard({ streaks }: StreakCardProps) {
  const streakItems = [
    {
      title: '11-Hour Study Streak',
      count: streaks.studyHoursStreak,
      target: '11 hrs/day',
      icon: <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      title: '5+ Job Apps Streak',
      count: streaks.appsStreak,
      target: '5 apps/day',
      icon: <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    {
      title: '2+ DSA Problems Streak',
      count: streaks.dsaStreak,
      target: '2 probs/day',
      icon: <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    },
    {
      title: 'Workout Habit Streak',
      count: streaks.exerciseStreak,
      target: '30 mins workout',
      icon: <Dumbbell className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {streakItems.map((item) => (
        <div
          key={item.title}
          className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800">{item.icon}</div>
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                {item.title}
              </span>
            </div>
            <Flame
              className={`w-5 h-5 ${
                item.count > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-300 dark:text-neutral-700'
              }`}
            />
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{item.count}</span>
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">days streak</span>
            </div>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${item.badgeBg}`}
            >
              {item.target}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
