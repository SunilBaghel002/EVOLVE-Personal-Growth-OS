'use client'

import { useState, useEffect } from 'react'
import { Flame, Bell, User, Search, Command } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CommandPalette } from './CommandPalette'

export function Header() {
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false)

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCmdPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sunil Baghel</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">{currentDateFormatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/60 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search or command...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-neutral-900 text-[10px] font-mono text-slate-600 dark:text-neutral-400 border border-slate-300 dark:border-neutral-800">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

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

      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
      />
    </>
  )
}
