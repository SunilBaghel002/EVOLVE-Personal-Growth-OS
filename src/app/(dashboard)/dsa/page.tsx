import { Brain, Plus } from 'lucide-react'

export default function DSAPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">DSA Problem Tracker</h1>
          <p className="text-xs text-neutral-400">Log solved problems, track topics, and manage revision schedules.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Problem</span>
        </button>
      </div>

      <div className="p-12 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <Brain className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold text-white">No DSA problems logged yet</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Start logging solved problems with confidence ratings to activate spaced repetition reminders.
        </p>
      </div>
    </div>
  )
}
