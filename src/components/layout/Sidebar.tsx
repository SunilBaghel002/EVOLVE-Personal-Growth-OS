'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Brain, Clock, BookOpenCheck, BarChart3, MessageSquareCode, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'DSA Tracker', href: '/dsa', icon: Brain },
  { label: 'Daily Logs', href: '/logs', icon: Clock },
  { label: 'MERN Revision', href: '/mern', icon: BookOpenCheck },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Interviews', href: '/interviews', icon: MessageSquareCode },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  // Calculate dynamic Challenge Day Number (Start: Aug 12, 2026)
  const challengeStartDate = new Date('2026-08-12T00:00:00.000Z').getTime()
  const todayTime = new Date().getTime()
  const dayDiff = Math.floor((todayTime - challengeStartDate) / (1000 * 60 * 60 * 24)) + 1
  const currentDayNumber = Math.min(21, Math.max(1, dayDiff))
  const progressPercent = Math.round((currentDayNumber / 21) * 100)

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg tracking-wider shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight block leading-none">
              EVOLVE
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest">
              Personal OS
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                isActive
                  ? 'bg-slate-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-neutral-700/60 shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-800/50'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Dynamic 21-Day Challenge Card */}
      <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/80 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-neutral-400 mb-1.5 font-medium">
          <span>21-Day Evolution</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Day {currentDayNumber}/21</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-500 h-full transition-all duration-300 rounded-full" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </aside>
  )
}
