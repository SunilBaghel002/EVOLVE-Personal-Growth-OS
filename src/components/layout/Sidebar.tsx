'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Brain,
  BookOpenCheck,
  FileText,
  LineChart,
  Target,
  Settings,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'DSA Tracker', href: '/dsa', icon: Brain },
  { label: 'MERN Revision', href: '/mern', icon: BookOpenCheck },
  { label: 'Daily Logs', href: '/logs', icon: FileText },
  { label: 'Analytics', href: '/analytics', icon: LineChart },
  { label: 'Goals', href: '/goals', icon: Target },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] h-screen sticky top-0 shadow-xs">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Flame className="w-5 h-5 fill-emerald-500/20" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">EVOLVE</h1>
          <p className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-widest font-bold">Personal Growth OS</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-emerald-500/10 dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-neutral-700/50 shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-900'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-neutral-500')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/80 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-neutral-400 mb-1.5 font-medium">
          <span>21-Day Evolution</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Active Sprint</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-500 h-full w-[25%]" />
        </div>
      </div>
    </aside>
  )
}
