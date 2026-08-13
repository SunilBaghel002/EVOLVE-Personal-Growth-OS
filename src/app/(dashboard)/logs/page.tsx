import { Clock } from 'lucide-react'

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Daily Reflection Logs</h1>
        <p className="text-xs text-neutral-400">Log time spent, exercise consistency, reflections, and tomorrow&apos;s priorities.</p>
      </div>

      <div className="p-12 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold text-white">Daily Logger</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Log daily study hours across GATE, Interview Prep, Client Projects, and MERN stack.
        </p>
      </div>
    </div>
  )
}
