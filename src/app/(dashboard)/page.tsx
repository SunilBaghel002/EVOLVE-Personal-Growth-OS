import { Flame, Clock, Briefcase, Brain, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-900/50 border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>21-Day Evolution Challenge • Day 1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good Morning, Sunil ☀️
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
            Every hour tracked is progress. Target: 11 hours of focused effort today across GATE, Interview Prep, Client Projects, and MERN.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Today&apos;s Study</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">0.0</span>
            <span className="text-xs text-neutral-500">/ 11.0 hrs</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[0%]" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Applications</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">0</span>
            <span className="text-xs text-neutral-500">sent total</span>
          </div>
          <p className="text-xs text-neutral-500">Target: 100+ applications</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">DSA Solved</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">0</span>
            <span className="text-xs text-neutral-500">problems</span>
          </div>
          <p className="text-xs text-neutral-500">Target: 42+ problems</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">1</span>
            <span className="text-xs text-neutral-500">days active</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">Keep the fire burning 🔥</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/applications"
          className="group p-6 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
              Application Tracker
            </h2>
            <p className="text-xs text-neutral-400">
              Track job applications, interview rounds, and referral pipelines.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center text-xs font-medium text-blue-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Tracker</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dsa"
          className="group p-6 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
              DSA Problem Tracker
            </h2>
            <p className="text-xs text-neutral-400">
              Log coding problems with difficulty, topic heatmaps, and confidence ratings.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center text-xs font-medium text-purple-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Problems</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/logs"
          className="group p-6 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
              Daily Reflection Logs
            </h2>
            <p className="text-xs text-neutral-400">
              Log study hours across GATE, Interview, Project, and MERN stack.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center text-xs font-medium text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Log Today&apos;s Hours</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  )
}
