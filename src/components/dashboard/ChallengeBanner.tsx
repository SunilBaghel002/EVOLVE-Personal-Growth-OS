'use client'

import { Flame, Clock, Briefcase, Brain } from 'lucide-react'

interface ChallengeBannerProps {
  dayNumber: number
  achievedHours: number
  targetHours: number
  achievedApps: number
  targetApps: number
  achievedDSA: number
  targetDSA: number
}

export function ChallengeBanner({
  dayNumber = 1,
  achievedHours = 0,
  targetHours = 11,
  achievedApps = 0,
  targetApps = 5,
  achievedDSA = 0,
  targetDSA = 2,
}: ChallengeBannerProps) {
  const hoursPct = Math.min(100, Math.round((achievedHours / targetHours) * 100))
  const appsPct = Math.min(100, Math.round((achievedApps / targetApps) * 100))
  const dsaPct = Math.min(100, Math.round((achievedDSA / targetDSA) * 100))

  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-emerald-950/40 border border-slate-200/80 dark:border-neutral-800 space-y-6 shadow-xl dark:shadow-2xl overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
            <Flame className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                21-Day Sprint Challenge
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Day {dayNumber} of 21 — Today&apos;s Performance
            </h2>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Daily Goal Standard</span>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">11 hrs study • 5 apps • 2 DSA</p>
        </div>
      </div>

      {/* 3 Live Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Study Hours Progress */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Study Hours
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">
              {achievedHours.toFixed(1)} / {targetHours} hrs
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${hoursPct}%` }}
            />
          </div>
        </div>

        {/* Job Applications Progress */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Applications
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-black">
              {achievedApps} / {targetApps} apps
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${appsPct}%` }}
            />
          </div>
        </div>

        {/* DSA Problems Progress */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              DSA Problems
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-black">
              {achievedDSA} / {targetDSA} solved
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500 rounded-full"
              style={{ width: `${dsaPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
