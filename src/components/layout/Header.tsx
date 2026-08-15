'use client'

import { Flame, Bell, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 border-b border-slate-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sunil Baghel</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">{currentDateFormatted}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Flame className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
          <span>5 Day Streak</span>
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-slate-700 dark:text-neutral-300 text-xs font-semibold shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  )
}
