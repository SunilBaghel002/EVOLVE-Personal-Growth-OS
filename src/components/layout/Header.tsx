'use client'

import { Flame, Bell, User } from 'lucide-react'

export function Header() {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 border-b border-neutral-800 bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Sunil Baghel</h2>
          <p className="text-xs text-neutral-400">{currentDateFormatted}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          <span>5 Day Streak</span>
        </div>

        <button
          type="button"
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 text-xs font-semibold">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  )
}
